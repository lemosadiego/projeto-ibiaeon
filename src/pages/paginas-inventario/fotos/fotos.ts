import { FotosDoBemHelper } from './../../../helper/fotos-do-bem/FotosDoBemHelper';
import { Session } from './../../../providers/session/session';
import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, AlertController, LoadingController, App, Loading } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File, DirectoryEntry, FileEntry } from '@ionic-native/file';
import { FotosDaoProvider } from '../../../providers/fotos-dao/fotos-dao';
import { ConfiguracaoEquipamento } from '../../../modelos/ConfiguracaoEquipamento';
import { FotoDoBem } from '../../../modelos/FotoDoBem';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer';
import { Events } from "ionic-angular";
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Diagnostic } from '@ionic-native/diagnostic';

//TODO: logica para numeracao de fotos ao salvar.

@IonicPage()
@Component({
  selector: 'page-fotos',
  templateUrl: 'fotos.html',
})
export class FotosPage {

  tab2Root = 'FotosPage';
  [x: string]: any;
  @ViewChild('mySlider') mySlider: any;

  private URL_HFS = 'http://192.168.1.166/fotos/'
  public image: any [] = [];
  public semFoto: boolean;
  private imagensAFazerSync: string[] = [];
  private cliente;
  private objConfig: ConfiguracaoEquipamento;
  private fileTransfer: FileTransferObject;
  public codigoPatrimonio: any;
  public codigoFilial: any;
  public incorporacao: any;
  public loading: Loading;
  private fotosNoBanco = 0;
  private numeroDaFoto = 1;
  private numeroFotoDisponivelAposExclusao = [];
  private listaDeFotos = [];
  public patrimonio;

  async ionViewWillEnter() {
    this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
    this.cliente = await this.session.getClienteSelecionado();
    var config: ConfiguracaoEquipamento = await this.session.getConfiguracao();
    this.objConfig = new ConfiguracaoEquipamento(config);
    this.patrimonio = this.events.publish('codigoPatrimonio');
    for (let i = 0; i < this.patrimonio.length; i++) {
      if (this.patrimonio[i] != undefined) {
        this.codigoPatrimonio = this.patrimonio[i].codigo;
        this.codigoFilial = this.patrimonio[i].CodigoFilial;
        this.incorporacao = this.patrimonio[i].incorporacao;
      }
    }

    this.verificaPatrimonio();
    await this.carregarFotos();
  }

  ionViewDidLeave() {
    this.codigoPatrimonio = undefined;
    this.codigoFilial = undefined;
    this.incorporacao = undefined;
    this.patrimonio = undefined;
    this.fotosNoBanco = 0;
    this.numeroDaFoto = 1;
    this.numeroFotoDisponivelAposExclusao = [];
    this.listaDeFotos = [];
    this.imagensAFazerSync = [];
  }

  constructor(
    private camera: Camera,
    public alertCtrl: AlertController,
    private file: File,
    public loadingCtrl: LoadingController,
    public fotosDao: FotosDaoProvider,
    public session: Session,
    private transfer: FileTransfer,
    public events: Events,
    public diagnostic: Diagnostic,
    public alert: AlertController,
    public androidPermissions: AndroidPermissions,
    public app: App,
    public _zone: NgZone) {
    this.image[0] = { data: 'assets/img/sem-foto.jpg', path: 'sem-foto.jpg' };
    this.semFoto = true;
    console.log(this.navParams);

  }

  onTakePicture() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(
      result => console.log('Has permission?',result.hasPermission)
    );
    
    let sdCardBase = '';
    let nomeFoto;
    let semNumeroFoto = false;
    if (this.numeroDaFoto <= this.objConfig.numeroFotos || this.numeroFotoDisponivelAposExclusao.length > 0) {
      const options: CameraOptions = {
        quality: 50,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        saveToPhotoAlbum: false,
        mediaType: this.camera.MediaType.PICTURE,
        correctOrientation: true
      }
      this.camera.getPicture(options).then(async (imageData) => {
        let fotoDoBem: FotoDoBem = new FotoDoBem();
        let fotosDoBemHelper: FotosDoBemHelper = new FotosDoBemHelper(this.fotosDao);

        var base64ImageData = 'data:image/jpeg;base64,' + imageData;
        if (this.semFoto) {
          this.image.pop();
        }
        this.semFoto = false;

        var externalRootDirectory;
        await this.diagnostic.getExternalSdCardDetails().then((state) => {
          if(state.length > 0){
            externalRootDirectory = state[1].filePath+'/';
          } else {
            externalRootDirectory = this.file.externalRootDirectory;
          }
        }).catch(e => console.error(e));
        var retorno = await this.existeDiretorio(externalRootDirectory, this.cliente.codigo);
        if (!retorno) {
          await this.criarDiretorio(externalRootDirectory, this.cliente.codigo);
        }
        sdCardBase = externalRootDirectory + this.cliente.codigo + '/';

        if (this.numeroFotoDisponivelAposExclusao.length > 0) {
          nomeFoto = this.numeroFotoDisponivelAposExclusao.pop();
          semNumeroFoto = true;
        } else {
          nomeFoto = this.codigoFilial + "_" + this.codigoPatrimonio + "_" + this.incorporacao + "_Foto" + this.numeroDaFoto + ".jpg";
        }
        this.image.push({ data: base64ImageData, path: nomeFoto });
        fotoDoBem.codigoFilial = this.codigoFilial;
        fotoDoBem.codigoPatrimonio = this.codigoPatrimonio;
        fotoDoBem.incorporacao = this.incorporacao;
        fotoDoBem.nomeFoto = nomeFoto;

        let blob = this.base64toBlob(base64ImageData, 'image/jpeg');

        await this.file.writeFile(sdCardBase, nomeFoto, blob, { replace: true }).then(async (sucess) => {
          if (!semNumeroFoto) {
            await fotosDoBemHelper.inserirRegistro(this.cliente.banco, fotoDoBem);
            this.numeroDaFoto++;
          } else {
            await fotosDoBemHelper.alterarRegistro(this.cliente.banco, fotoDoBem);
          }
          console.log('Arquivo salvo com sucesso', sucess);
        }).catch(err => console.log('Falha ao salvar o arquivo'));

      }, (err) => {
        this.displayErrorAlert(err);
      });
    } else {
      alert('Limite de fotos atingida');
    }

  }

  resolveUrl(clientePath: string) {
    return this.file.resolveDirectoryUrl(clientePath).then((directoryEntry: DirectoryEntry) => {
      return directoryEntry;
    }).catch(() => {
      throw new Error('Nao foi possivel ler o diretorio');
    });
  }

  verificaPatrimonio() {
    if (this.codigoPatrimonio == undefined) {
      this.alert.create({
        title: 'Nenhum código de patrimônio informado',
        subTitle: 'Informe o código de patrimônio.',
        buttons: [
          {
            text: 'ok',
            handler: () => {
              this.app.getActiveNavs()[0].parent.select(0);
            }
          }
        ]
      }).present();
    }
    else if (this.incorporacao == undefined || this.incorporacao === "") {
      this.alert.create({
        title: 'Nenhum código de incorporação informado',
        subTitle: 'Informe o código de incorporação.',
        buttons: [
          {
            text: 'ok',
            handler: () => {
              this.app.getActiveNavs()[0].parent.select(0);
            }
          }
        ]
      }).present();
    }
    else if (this.codigoFilial == undefined) {
      this.alert.create({
        title: 'Nenhuma filial selecionada',
        subTitle: 'Selecione uma filial',
        buttons: [
          {
            text: 'ok',
            handler: () => {
              this.app.getActiveNavs()[0].parent.select(0);
            }
          }
        ]
      }).present();
    }
  }

  getFile(directoryEntry: DirectoryEntry, imageName: string) {
    return this.file.getFile(directoryEntry, imageName, { create: false, exclusive: false }).then((fileEntry: FileEntry) => {
      return fileEntry;
    }).catch((err) => {
      throw new Error(err.message);
    });
  }

  readFile(fileEntry: FileEntry) {
    return new Promise((resolve) => {
      fileEntry.file(file => {
        resolve(file);
      });
    });
  }

  resultReader(inputFile) {
    const temporaryFileReader = new FileReader();
    return new Promise((resolve, reject) => {
      temporaryFileReader.onerror = () => {
        temporaryFileReader.abort();
        reject(new Error("Problema ao carregar a foto."));
      };

      temporaryFileReader.onload = () => {
        resolve(temporaryFileReader.result);
      };
      temporaryFileReader.readAsDataURL(inputFile);
    });
  };

  existeDiretorio(path: string, dir: string) {
    return this.file.checkDir(path, dir).then((result) => {
      return result;
    }).catch((err) => {
      console.log('erro ao checar diretorio', err);
      return false;
    });
  }

  criarDiretorio(path: string, dir: string) {
    return this.file.createDir(path, dir, true).then((result) => {
      console.log(result);
    }).catch((err) => {
      console.log('erro ao criar diretorio', err);
    });
  }

  displayErrorAlert(err) {
    console.log(err);
    let alert = this.alertCtrl.create({
      title: 'Erro',
      subTitle: 'Não foi possível fotografar.',
      buttons: ['OK']
    });
    alert.present();
  }

  //here is the method is used to get content type of an bas64 data  
  public getContentType(base64Data: any) {
    let block = base64Data.split(";");
    let contentType = block[0].split(":")[1];
    return contentType;
  }
  //here is the method is used to convert base64 data to blob data  
  public base64toBlob(b64Data, contentType) {
    contentType = contentType || '';
    var sliceSize = 512;
    b64Data = b64Data.split(',')[1];
    let byteCharacters = atob(b64Data);
    let byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);
      let byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    let blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  public async baixarImagens() {
    this.loading = this.loadingCtrl.create({
      content: 'Download...'
    });
    if (this.imagensAFazerSync.length > 0) {
      await this.loading.present()
      var falhas = [];
      for (var i = 0; i < this.imagensAFazerSync.length; i++) {
        try {
          this.fileTransfer = this.transfer.create();
          await this.download(this.imagensAFazerSync[i])
        } catch (err) {
          falhas.push(this.imagensAFazerSync[i])
          alert(err);
        }
      }

      if (falhas.length > 0)
        console.log('Arquivos que falharam no download', falhas.toString)

      await this.loading.dismiss();
      await this.carregarFotos();
    } else {
      alert('Não existe fotos para baixar');
    }
  }

  public async download(fileName: string) {
    var externalRootDirectory;
    await this.diagnostic.getExternalSdCardDetails().then((state) => {
      if(state.length > 0){
        externalRootDirectory = state[1].filePath+'/';
      } else {
        externalRootDirectory = this.file.externalRootDirectory;
      }
    }).catch(e => console.error(e));
    let sdCardBase = externalRootDirectory + this.cliente.codigo + '/';
    let url = encodeURI(this.URL_HFS + this.cliente.codigo + '/' + fileName);
    return new Promise((resolve, reject) => {

      this.fileTransfer.onProgress((progressEvent) => {
        this._zone.run(() => {
          if (progressEvent.lengthComputable) {
            var percent = progressEvent.loaded / progressEvent.total * 100;
            percent = Math.round(percent);
            //console.log('Download:  ' + percent + '%');
            this.updateLoading(percent);
          }
        });
      });

      this.fileTransfer.download(url, sdCardBase + fileName, true).then((entry) => {
        console.log('download completo: ' + entry.toURL());
        resolve();
      }, (error) => {
        console.log('falha no download : ' + error);
        reject('Falha no download');
      });
    });

  }

  updateLoading(progress: number) {
    console.log('Download:  ' + progress + '%');
    this.loading.setContent('Download:  ' + progress + '%');
  }

  async uploadFile(fileName: string, primeiraFoto:boolean, loader) {
    this.cliente = await this.session.getClienteSelecionado();
    var foto;
    if(primeiraFoto){
    await loader.present();
    }
    const fileTransfer: FileTransferObject = this.transfer.create();

    let options: FileUploadOptions = {
      fileKey: 'ionicfile',
      fileName: fileName,
      chunkedMode: false,
      mimeType: "image/jpg",
      headers: {}
    }

    var externalRootDirectory;
    await this.diagnostic.getExternalSdCardDetails().then((state) => {
      if(state.length > 0){
        externalRootDirectory = state[1].filePath+'/';
      } else {
        externalRootDirectory = this.file.externalRootDirectory;
      }
    }).catch(e => console.error(e));
    let sdCardBase = externalRootDirectory + this.cliente.codigo + '/';
    let directoryEntry: DirectoryEntry;
    try {
      directoryEntry = await this.resolveUrl(sdCardBase);
    } catch (err) {
      alert('Nao foi possivel ler o diretorio --> ' + sdCardBase);
      return;
    }

    try {
      const fileEntry: FileEntry = await this.getFile(directoryEntry, fileName);
      const file: any = await this.readFile(fileEntry);
      foto = await this.resultReader(file);
    } catch (error) {
      console.log(error);
      return
    }

      fileTransfer.onProgress((progressEvent) => {
        this._zone.run(() => {
          if (progressEvent.lengthComputable) {
            var percent = progressEvent.loaded / progressEvent.total * 100;
            percent = Math.round(percent);
            //console.log('Download:  ' + percent + '%');
            this.updateLoadingDownload(percent,loader);
          }
        });
      });

    await fileTransfer.upload(foto, this.URL_HFS + this.cliente.codigo + '/', options).then(async (data) => {
      await this.fotosDao.alterarRegistroSync(this.cliente.banco, fileName).then(() => {
        console.log('registro de foto alterado com sucesso');
      })
      .catch((err) => {
        console.log(err);
        throw new Error('Não foi possivel alterar o registro');
      });
      console.log(" Uploaded Successfully", data);
    }, (err) => {
      console.log(err);
      throw new Error('Não foi possivel fazer o upload');
    });
   
  }
  updateLoadingDownload(progress: number, loader) {
    console.log('Upload:  ' + progress + '%');
    loader.setContent('Upload:  ' + progress + '%');
  }
  
  slideChanged(item, pos) {
    console.log('hsuahsau item', item);
    console.log('hsuahsau pos', pos);

  }

  public async excluir(item, pos) {
    var disponiveis = this.numeroFotoDisponivelAposExclusao;
    var externalRootDirectory;
    
    await this.diagnostic.getExternalSdCardDetails().then((state) => {
      if(state.length > 0){
        externalRootDirectory = state[1].filePath+'/';
      } else {
        externalRootDirectory = this.file.externalRootDirectory;
      }
    }).catch(e => console.error(e));

    let sdCardBase = externalRootDirectory + this.cliente.codigo + '/';

    await this.file.removeFile(sdCardBase, item).then((res) => {
      this.image.splice(pos, 1);
      disponiveis.push(item);
      alert('imagem excluida com sucesso');

    }).catch(err => {
      console.log(err);
      alert('falha ao excluir imagem');
    })

    if (this.image.length == 0) {
      this.image = [];
      this.image[0] = { data: 'assets/img/sem-foto.jpg', path: 'sem-foto.jpg' };
      this.semFoto = true;
    }

  }

  private async carregarFotos() {
    var externalRootDirectory;
    this.image = [];
    this.image[0] = { data: 'assets/img/sem-foto.jpg', path: 'sem-foto.jpg' };
    this.semFoto = true;

    this.imagensAFazerSync = [];
    if (this.codigoPatrimonio != undefined && this.cliente != undefined) {

      let loading = this.loadingCtrl.create({
        content: 'Carregando Fotos...'
      });
      loading.present();

      var fotosHelper: FotosDoBemHelper = new FotosDoBemHelper(this.fotosDao);
      this.listaDeFotos = await fotosHelper.retornaRegistros(this.cliente.banco, this.codigoPatrimonio);
      this.fotosNoBanco = this.listaDeFotos.length;

      try {
        if (this.fotosNoBanco > 0)
          this.preencheNumeroProximaFoto(this.listaDeFotos[this.fotosNoBanco - 1])
      } catch (err) {
        alert(err);
        return;
      }
      
      await this.diagnostic.getExternalSdCardDetails().then((state) => {
        if(state.length > 0){
          externalRootDirectory = state[1].filePath+'/';
        } else {
          externalRootDirectory = this.file.externalRootDirectory;
        }
      }).catch(e => console.error(e));

      let sdCardBase = externalRootDirectory + this.cliente.codigo + '/';

      var retorno = await this.existeDiretorio(externalRootDirectory, this.cliente.codigo);
      if (!retorno) {
        await this.criarDiretorio(externalRootDirectory, this.cliente.codigo);
      }

      let directoryEntry: DirectoryEntry;
      try {
        directoryEntry = await this.resolveUrl(sdCardBase);
      } catch (err) {
        alert('Nao foi possivel ler o diretorio --> ' + sdCardBase);
        loading.dismiss();
        return;
      }

      for (var i = 0; i < this.listaDeFotos.length; i++) {
        try {
          const fileEntry: FileEntry = await this.getFile(directoryEntry, this.listaDeFotos[i]);
          const file: any = await this.readFile(fileEntry);
          const foto: any = await this.resultReader(file);
          if (this.semFoto) {
            this.image.pop();
            this.semFoto = false;
          }
          this.image.push({ data: foto, path: this.listaDeFotos[i] });
        } catch (err) {
          this.imagensAFazerSync.push(this.listaDeFotos[i]);
          console.error('erro ao ler a imagem ' + this.listaDeFotos[i], err);
        }
      }
      console.log('imagens A fazer sync', this.imagensAFazerSync.toString());
      if (this.imagensAFazerSync.length > 0) {
        if (this.imagensAFazerSync.length == 1)
          alert('Existe ' + this.imagensAFazerSync.length + ' foto para baixar');
        else
          alert('Existem ' + this.imagensAFazerSync.length + ' fotos para baixar');
      }
      loading.dismiss();
    }

    //console.log('Iniciando Download');
    //this.download('Sample-jpg-image-500kb.jpg','https://sample-videos.com/img/Sample-jpg-image-500kb.jpg','','');
  }

  /**
   * Metodo que preenche numero da proxima foto o inteiro antes do ponto.
   * 
   * @param nomeFoto 
   */
  preencheNumeroProximaFoto(nomeFoto: string) {
    var indexPonto = nomeFoto.indexOf('.')
    if (indexPonto > 0) {
      this.numeroDaFoto = +nomeFoto.charAt(indexPonto - 1) + 1
    } else {
      throw new Error('Problema ao identificar proxima foto');
    }
  }



}