import { InventarioHelper } from '../../../helper/inventario/InventarioHelper';
import { ConfiguracoesEquipamentoDaoProvider } from '../../../providers/configuracoes-equipamento-dao/configuracoes-equipamento-dao';
import { TipoDadosPatrimonioDaoProvider } from '../../../providers/tipo-dados-patrimonio-dao/tipo-dados-patrimonio-dao';
import { InventarioMovimentacoesDaoProvider } from '../../../providers/inventario-movimentacoes-dao/inventario-movimentacoes-dao';
import { LookUpDaoProvider } from '../../../providers/look-up-dao/look-up-dao';
import { CodigoFicticioDaoProvider } from '../../../providers/codigo-ficticio-dao/codigo-ficticio-dao';
import { Util } from '../../../helper/Util';
import { IonicPage, NavController, NavParams, PopoverController, Events, ToastController, ToastOptions, App, LoadingController } from "ionic-angular";
import { Component } from "@angular/core";
import { Patrimonio } from "../../../modelos/Patrimonio";
import { AtributoDoBem } from "../../../modelos/AtributoDoBem";
import { ConfiguracaoEquipamento } from "../../../modelos/ConfiguracaoEquipamento";
import { PatrimonioDaoProvider } from "../../../providers/patrimonio-dao/patrimonio-dao";
import { InventarioDaoProvider } from "../../../providers/inventario-dao/inventario-dao";
import { AtributosDoBemDaoProvider } from "../../../providers/atributos-do-bem-dao/atributos-do-bem-dao";
import { DatabaseProvider } from "../../../providers/database/database";
import { Session } from "../../../providers/session/session";
import { AtributosDoBemHelper } from "../../../helper/atributos-do-bem/AtributosDoBemHelper";
import { PatrimonioHelper } from "../../../helper/patrimonio/PatrimonioHelper";
import { CodigoFicticioHelper } from "../../../helper/codigo-ficticio/CodigoFicticioHelper";
import { AlteracaoCampos } from "../../../modelos/AlteracaoCampos";
import { LookUpHelper } from "../../../helper/lookup/lookupHelper";
import { PopoverComponent } from '../../../components/popover/popover';
import { DadosPropriedades } from '../../../modelos/DadosPropriedade';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Geolocation } from '@ionic-native/geolocation';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { RfidNativoPage } from '../rfid-nativo/rfid-nativo';
import { FotosDoBemHelper } from '../../../helper/fotos-do-bem/FotosDoBemHelper';
import { FotosDaoProvider } from '../../../providers/fotos-dao/fotos-dao';

@IonicPage()
@Component({
  selector: 'page-inventario',
  templateUrl: 'inventario.html',
})
export class InventarioPage {
  public dadosPropriedades: DadosPropriedades[] = [];
  a: any = 0;
  public teste: any = undefined;
  public propriedades: any;
  public filialSelecionada: any;
  public especieSelecionada: any;
  public codigo: string = "";
  public tamMascara: number;
  public centroCustosSelecionado: any;
  public localSelecionado: any;
  public responsavelSelecionado: any;
  public clienteSelecionado: any;
  public codicaoSelecionada: any;
  public historicoSelecionado: any;
  public resposta: any;
  public consultaEscolhida: any;
  public gravouPatrimonio: boolean = false;
  public incorporacao = '0';
  public camposAuxiliares: any[] = [];
  public aux1; aux2; aux3; aux4; aux5; aux6; aux7; aux8; obs; tag; incorporacaoAnterior;
  codAnterior = undefined; serie; modelo; marca; descricao; etiquetaSelecionada;
  public teste1: any[] = [];
  public patrimonio: Patrimonio = new Patrimonio();
  public permiteGravarDireto: boolean = false;
  public atributosDoBem: AtributoDoBem[];
  public atributosDoBemAlterado: AtributoDoBem[];
  public isFicticio: boolean = false;
  private objConfig: ConfiguracaoEquipamento;
  private objFicticio: any;
  pegaPropriedade: any[] = [];
  passapropriedade: any;
  private usuario: any;
  public toastOptionsTrue: ToastOptions;
  public toastOptionsfalse: ToastOptions;
  public rfidStatus: boolean = false;
  public leituraEscolhida: string = "Câmera";
  public status = "?"
  config: ConfiguracaoEquipamento;
  qtdAuxiliares: any[] = [];
  filtro: string;
  retornoBuscaTags: any;
  patrimonioSelecionado: any;
  public fixaFilial: boolean = false;
  public fixEspecie: boolean = false;
  public fixaDescricao: boolean = false;
  public fixaPropriedades: boolean = false;
  public fixaSerie: boolean = false;
  public fixaCondicao: boolean = false;
  public fixaCCusto: boolean = false;
  public fixaLocal: boolean = false;
  public fixaResponsavel: boolean = false;
  public fixaAux1: boolean = false; fixaAux2: boolean = false; fixaAux3: boolean = false; fixaAux4: boolean = false;
  fixaAux5: boolean = false; fixaAux6: boolean = false; fixaAux7: boolean = false; fixaAux8: boolean = false;
  public fixaObs: boolean = false;
  public historicoFilial: any[] = [];
  public historicoEspecie: any[] = [];
  public historicoDescricao: any[] = [];
  public historicoMarca: any[] = [];
  public historicoModelo: any[] = [];
  public historicoCusto: any[] = [];
  public historicoLocal: any[] = [];
  public historicoResposanveis: any[] = [];
  public historicoCondicao: any[] = [];
  public historicoTag: any[] = [];
  public historicoAux1: any[] = []; public historicoAux2: any[] = []; public historicoAux3: any[] = []; public historicoAux4: any[] = [];
  public historicoAux5: any[] = []; public historicoAux6: any[] = []; public historicoAux7: any[] = [];
  public historicoAux8: any[] = []; public historicoObs: any[] = [];
  public flagFilial: boolean = true; public flagCusto: boolean = true;
  public flagEspecie: boolean = true; public flagLocal: boolean = true;
  public flagResponsavel: boolean = true;
  public revisaoRapidaAtivado: boolean = false;
  public tipoDeRevisao: string;
  public buscaFeita: boolean = false;
  loadingSalvar: any;
  public campoLocal; campoCcusto; campoCondicao; campoResponsavel; campoDescricao; campoMarca; campoModelo; campoSerie;
  campoCodAnterior; campoTag; campoAux1; campoAux2; campoAux3; campoAux4; campoAux5; campoAux6; campoAux7; campoAux8;
  campoObervacao; campoFilial = '*Filial'; campoEspecie = 'Espécie';
  public mostraDescricao = false;
  public itemBaixado: boolean = false;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public androidPermissions: AndroidPermissions,
    public patrimonioDao: PatrimonioDaoProvider,
    public inventarioDao: InventarioDaoProvider,
    public atributosDoBemDao: AtributosDoBemDaoProvider,
    public dbProvider: DatabaseProvider,
    public session: Session,
    public toast: ToastController,
    private geo: Geolocation,
    private locationAccuracy: LocationAccuracy,
    public tipoDadoPatrimonioDao: TipoDadosPatrimonioDaoProvider,
    public inventarioMovimentacoesDao: InventarioMovimentacoesDaoProvider,
    public configEqpDao: ConfiguracoesEquipamentoDaoProvider,
    public lookUpDaoProvider: LookUpDaoProvider,
    public codigoFicticioDao: CodigoFicticioDaoProvider,
    public popoverCtrl: PopoverController,
    private events: Events,
    public loadingCtrl: LoadingController,
    private barcodeScanner: BarcodeScanner,
    public appCtrl: App,
    public fotosDao: FotosDaoProvider) {

    this.toastOptionsTrue = {
      message: 'Leitura por RFID selecionada',
      duration: 2500,
      position: 'top'
    }

    this.toastOptionsfalse = {
      message: 'Leitura por código de barras selecionada',
      duration: 2500,
      position: 'top'
    }
    events.subscribe('data:created', async (data) => {
      this.codigo = data.codigo;
      this.clienteSelecionado = await this.session.getClienteSelecionado();
      this.buscaPatrimonioCodigo();
      console.log('esse aqui é o evento ', data);
    });

    this.events.subscribe('baixar', async () => {
      await this.gravarPatrimonio('baixar');
    });

    this.events.subscribe('chamaId', () => {
      return this.retornaIdPatrimonio();
    });

    this.events.subscribe('codigoPatrimonio', () => {
      if (this.resposta != undefined) {
        return this.resposta;
      } else {
        if (this.filialSelecionada != undefined) {
          var codigoFilial = this.filialSelecionada.codigo;
        }
        var itensTela =
        {
          codigo: this.codigo,
          CodigoFilial: codigoFilial,
          incorporacao: this.incorporacao
        }
        return itensTela;
      }
    });

    this.events.subscribe('desfazbaixa', async () => {
      await this.gravarPatrimonio('desfazbaixa');
    });
    this.events.subscribe('didLeave', () => {
      this.resposta = undefined;
    });
  }

  showToast(toggle) {
    if (toggle) {
      this.toast.create(this.toastOptionsTrue).present();
      this.rfidStatus = true;
      this.leituraEscolhida = "RFID";
    } else {
      this.toast.create(this.toastOptionsfalse).present();
      this.rfidStatus = false;
      this.leituraEscolhida = "Câmera";
    }
  }
  ionViewDidEnter() {

    this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if (canRequest) {
        // the accuracy option will be ignored by iOS
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
          () => console.log('Request successful'),
          error => console.log('Error requesting location permissions', error)
        );
      }
    });
  }
  async ionViewWillEnter() {
    if (this.navParams.get('filialSelecionada') != null) {
      this.filialSelecionada = this.navParams.get('filialSelecionada');
      if (this.filialSelecionada != null) {
        this.navParams.data.filialSelecionada = null;
        this.flagFilial = false;
        this.patrimonio.idFilial = this.filialSelecionada.id;
        this.patrimonio.nomeFilial = this.filialSelecionada.nome;
        this.patrimonio.codigoFilial = this.filialSelecionada.codigo;
      }
    }
    if (this.navParams.get('especieSelecionada') != null) {
      this.especieSelecionada = this.navParams.get('especieSelecionada');
      if (this.especieSelecionada != null) {
        this.mostraDescricao = false;
        this.navParams.data.especieSelecionada = null;
        this.flagEspecie = false;
        this.patrimonio.idEspecie = this.especieSelecionada.id;
        this.patrimonio.nomeEspecie = this.especieSelecionada.nome;
        if (this.dadosPropriedades.length == 0) {
          this.descricao = undefined;
          this.propriedades = await this.carregaPropriedadePorEspecie(this.clienteSelecionado.banco, this.especieSelecionada.id);
          await this.preencherLookUp();
          this.preencheLookUpTipo2();
        }
      }
    }
    if (this.navParams.get('centroCustosSelecionado') != null) {
      this.centroCustosSelecionado = this.navParams.get('centroCustosSelecionado');
      if (this.centroCustosSelecionado != null) {
        this.navParams.data.centroCustosSelecionado = null;
        this.flagCusto = false;
        this.patrimonio.idCentroCusto = this.centroCustosSelecionado.id;
        this.patrimonio.nomeCentroCusto = this.centroCustosSelecionado.nome;
      }
    }
    if (this.navParams.get('localSelecionado') != null) {
      this.localSelecionado = this.navParams.get('localSelecionado');
      if (this.localSelecionado != null) {
        this.navParams.data.localSelecionado = null;
        this.flagLocal = false;
        this.patrimonio.idLocal = this.localSelecionado.id;
        this.patrimonio.nomeLocal = this.localSelecionado.nome;
      }
    }
    if (this.navParams.get('responsavelSelecionado') != null) {
      this.responsavelSelecionado = this.navParams.get('responsavelSelecionado');
      if (this.responsavelSelecionado != null) {
        this.navParams.data.responsavelSelecionado = null;
        this.flagResponsavel = false;
        this.patrimonio.idResponsavel = this.responsavelSelecionado.id;
        this.patrimonio.nomeResponsavel = this.responsavelSelecionado.nome;
      }
    }
    if (this.navParams.get('codicaoSelecionada') != null) {
      this.codicaoSelecionada = this.navParams.get('codicaoSelecionada');
      if (this.codicaoSelecionada != null) {
        this.navParams.data.codicaoSelecionada = null;
        this.patrimonio.idCondicao = this.codicaoSelecionada.id;
        this.patrimonio.nomeCondicao = this.codicaoSelecionada.nome;
      }
    }
    this.historicoSelecionado = this.navParams.get('historicoEscolhido');
    if (this.historicoSelecionado != null) {
      this.atribuiHistoricoAosCampos(this.historicoSelecionado);
    }
    this.etiquetaSelecionada = this.navParams.get('etiquetaSelecionada');
    if (this.etiquetaSelecionada != null) {
      this.navParams.data.etiquetaSelecionada = null;
      this.codigo = this.etiquetaSelecionada;
      this.clienteSelecionado = await this.session.getClienteSelecionado();
      this.buscaPatrimonio();

    }
    this.patrimonioSelecionado = this.navParams.get('patrimonioSelecionado');
    if (this.patrimonioSelecionado != null) {
      this.navParams.data.patrimonioSelecionado = null;
      this.codigo = this.patrimonioSelecionado.codigo;
      this.clienteSelecionado = await this.session.getClienteSelecionado();
      this.buscaPatrimonioCodigo();

    }
    this.flagCusto = true; this.flagEspecie = true; this.flagFilial = true; this.flagLocal = true;
    this.flagResponsavel = true;
  }

  async ionViewDidLoad() {
    this.usuario = await this.session.getUsuario();
    this.verificaRevisao();
    this.config = await this.session.getConfiguracao();
    this.objConfig = new ConfiguracaoEquipamento(this.config);

    for (let i = 0; i < this.objConfig.campoAuxiliar.length; i++) {
      if (i == 0) {
        this.camposAuxiliares.push(this.objConfig.campoAuxiliar[i].aux1);
        this.qtdAuxiliares.push(true);
      }
      if (i == 1) {
        this.camposAuxiliares.push(this.objConfig.campoAuxiliar[i].aux2);
        this.qtdAuxiliares.push(true);
      }
      if (i == 2) {
        this.camposAuxiliares.push(this.objConfig.campoAuxiliar[i].aux3);
        this.qtdAuxiliares.push(true);
      }
      if (i == 3) {
        this.camposAuxiliares.push(this.objConfig.campoAuxiliar[i].aux4);
        this.qtdAuxiliares.push(true);
      }
      if (i == 4) {
        this.camposAuxiliares.push(this.objConfig.campoAuxiliar[i].aux5);
        this.qtdAuxiliares.push(true);
      }
      if (i == 5) {
        this.camposAuxiliares.push(this.objConfig.campoAuxiliar[i].aux6);
        this.qtdAuxiliares.push(true);
      }
      if (i == 6) {
        this.camposAuxiliares.push(this.objConfig.campoAuxiliar[i].aux7);
        this.qtdAuxiliares.push(true);
      }
      if (i == 7) {
        this.camposAuxiliares.push(this.objConfig.campoAuxiliar[i].aux8);
        this.qtdAuxiliares.push(true);
      }

      // this.camposAuxiliares.push(
    }
    this.bindCampoObrigatorio(this.objConfig);
    if (this.codigo == "")
      this.codigo = this.objConfig.mascara;
    this.tamMascara = this.objConfig.mascara.length;
    this.tamMascara = this.objConfig.mascara.length;
    this.clienteSelecionado = await this.session.getClienteSelecionado();
  }
  private async verificaRevisao() {
    this.config = await this.session.getConfiguracao();
    this.objConfig = new ConfiguracaoEquipamento(this.config);
    if (this.objConfig.revisaoRapida == 1) {
      this.tipoDeRevisao = 'R'
      this.revisaoRapidaAtivado = true;
    }
    else {
      this.tipoDeRevisao = 'C'
      this.revisaoRapidaAtivado = false;
    }
  }

  alterarConfiguracao() {
    this.navCtrl.setRoot('ConfiguracoesPage', {
      paginaInventario: true
    })
  }
  editarInventario() {
    this.revisaoRapidaAtivado = false;
  }
  bindCampoObrigatorio(objetoConfig) {
    for (let i = 0; i < objetoConfig.campoObrigatorio.length; i++) {
      switch (objetoConfig.campoObrigatorio[i].nome) {
        case 'local':
          if (objetoConfig.campoObrigatorio[i].valor == 1) {
            this.campoLocal = "*Local"
          } else if (objetoConfig.campoObrigatorio[i].valor == 0) {
            this.campoLocal = "Local"
          }
          break;
        case 'cCusto':
          if (objetoConfig.campoObrigatorio[i].valor == 1) {
            this.campoCcusto = "*C. Custos"
          } else if (objetoConfig.campoObrigatorio[i].valor == 0) {
            this.campoCcusto = "C. Custos"
          }
          break;
        case 'condicao':
          if (objetoConfig.campoObrigatorio[i].valor == 1) {
            this.campoCondicao = "*Condição"
          } else if (objetoConfig.campoObrigatorio[i].valor == 0) {
            this.campoCondicao = "Condição"
          }
          break;
        case 'responsavel':
          if (objetoConfig.campoObrigatorio[i].valor == 1) {
            this.campoResponsavel = "*Responsáveis"
          } else if (objetoConfig.campoObrigatorio[i].valor == 0) {
            this.campoResponsavel = "Responsáveis"
          }
          break;
        case 'descricao':
          if (objetoConfig.campoObrigatorio[i].valor == 1) {
            this.campoDescricao = "*Descrição"
          } else if (objetoConfig.campoObrigatorio[i].valor == 0) {
            this.campoDescricao = "Descrição"
          }
          break;
        case 'marca':
          if (objetoConfig.campoObrigatorio[i].valor == 1) {
            this.campoMarca = "*Marca"
          } else if (objetoConfig.campoObrigatorio[i].valor == 0) {
            this.campoMarca = "Marca"
          }
          break;
        case 'modelo':
          if (objetoConfig.campoObrigatorio[i].valor == 1) {
            this.campoModelo = "*Modelo"
          } else if (objetoConfig.campoObrigatorio[i].valor == 0) {
            this.campoModelo = "Modelo"
          }
          break;
        case 'serie':
          if (objetoConfig.campoObrigatorio[i].valor == 1) {
            this.campoSerie = "*Série"
          } else if (objetoConfig.campoObrigatorio[i].valor == 0) {
            this.campoSerie = "Série"
          }
          break;
        case 'codAnterior':
          if (objetoConfig.campoObrigatorio[i].valor == 1) {
            this.campoCodAnterior = "*Código Anterior"
          } else if (objetoConfig.campoObrigatorio[i].valor == 0) {
            this.campoCodAnterior = "Código Anterior"
          }
          break;
        case 'tag':
          if (objetoConfig.campoObrigatorio[i].valor == 1) {
            this.campoTag = "*Tag"
          } else if (objetoConfig.campoObrigatorio[i].valor == 0) {
            this.campoTag = "Tag"
          }
          break;
        case 'aux1':
          if (objetoConfig.campoObrigatorio[i].valor == 1 && this.qtdAuxiliares[0] == true) {
            this.camposAuxiliares[0] = "*" + this.objConfig.campoAuxiliar[0].aux1
          } else if (objetoConfig.campoObrigatorio[i].valor == 0 && this.qtdAuxiliares[0] == true) {
            this.camposAuxiliares[0] = this.objConfig.campoAuxiliar[0].aux1
          }
          break;
        case 'aux2':
          if (objetoConfig.campoObrigatorio[i].valor == 1 && this.qtdAuxiliares[1] == true) {
            this.camposAuxiliares[1] = "*" + this.objConfig.campoAuxiliar[1].aux2
          } else if (objetoConfig.campoObrigatorio[i].valor == 0 && this.qtdAuxiliares[1] == true) {
            this.camposAuxiliares[1] = this.objConfig.campoAuxiliar[1].aux2
          }
          break;
        case 'aux3':
          if (objetoConfig.campoObrigatorio[i].valor == 1 && this.qtdAuxiliares[2] == true) {
            this.camposAuxiliares[2] = "*" + this.objConfig.campoAuxiliar[2].aux3
          } else if (objetoConfig.campoObrigatorio[i].valor == 0 && this.qtdAuxiliares[2] == true) {
            this.camposAuxiliares[2] = this.objConfig.campoAuxiliar[2].aux3
          }
          break;
        case 'aux4':
          if (objetoConfig.campoObrigatorio[i].valor == 1 && this.qtdAuxiliares[3] == true) {
            this.camposAuxiliares[3] = "*" + this.objConfig.campoAuxiliar[3].aux4
          } else if (objetoConfig.campoObrigatorio[i].valor == 0 && this.qtdAuxiliares[3] == true) {
            this.camposAuxiliares[3] = this.objConfig.campoAuxiliar[3].aux4
          }
          break;
        case 'aux5':
          if (objetoConfig.campoObrigatorio[i].valor == 1 && this.qtdAuxiliares[4] == true) {
            this.camposAuxiliares[4] = "*" + this.objConfig.campoAuxiliar[4].aux5
          } else if (objetoConfig.campoObrigatorio[i].valor == 0 && this.qtdAuxiliares[4] == true) {
            this.camposAuxiliares[4] = this.objConfig.campoAuxiliar[4].aux5
          }
          break;
        case 'aux6':
          if (objetoConfig.campoObrigatorio[i].valor == 1 && this.qtdAuxiliares[5] == true) {
            this.camposAuxiliares[5] = "*" + this.objConfig.campoAuxiliar[5].aux6
          } else if (objetoConfig.campoObrigatorio[i].valor == 0 && this.qtdAuxiliares[5] == true) {
            this.camposAuxiliares[5] = this.objConfig.campoAuxiliar[5].aux6
          }
          break;
        case 'aux7':
          if (objetoConfig.campoObrigatorio[i].valor == 1 && this.qtdAuxiliares[6] == true) {
            this.camposAuxiliares[6] = "*" + this.objConfig.campoAuxiliar[6].aux7
          } else if (objetoConfig.campoObrigatorio[i].valor == 0 && this.qtdAuxiliares[6] == true) {
            this.camposAuxiliares[6] = this.objConfig.campoAuxiliar[6].aux7
          }
          break;
        case 'aux8':
          if (objetoConfig.campoObrigatorio[i].valor == 1 && this.qtdAuxiliares[7] == true) {
            this.camposAuxiliares[7] = "*" + this.objConfig.campoAuxiliar[7].aux7
          } else if (objetoConfig.campoObrigatorio[i].valor == 0 && this.qtdAuxiliares[7] == true) {
            this.camposAuxiliares[7] = this.objConfig.campoAuxiliar[7].aux7
          }
          break;
        case 'observacao':
          if (objetoConfig.campoObrigatorio[i].valor == 1) {
            this.campoObervacao = "*Observações"
          } else if (objetoConfig.campoObrigatorio[i].valor == 0) {
            this.campoObervacao = "Observações"
          }
          break;
        default:
          break;
      }
    }
  };
  atribuiHistoricoAosCampos(historicoSelecionado) {
    if (historicoSelecionado.campo == 'filial' && this.flagFilial) {
      this.patrimonio.idFilial = historicoSelecionado.id;
      this.filialSelecionada = {
        id: historicoSelecionado.id,
        nome: historicoSelecionado.nome
      }
      this.patrimonio.nomeFilial = historicoSelecionado.nome;

    }
    if (historicoSelecionado.campo == 'custo' && this.flagCusto) {
      this.patrimonio.idCentroCusto = historicoSelecionado.id;
      this.centroCustosSelecionado = {
        id: historicoSelecionado.id,
        nome: historicoSelecionado.nome
      }
      this.patrimonio.nomeCentroCusto = historicoSelecionado.nome;
    }
    if (historicoSelecionado.campo == 'descricao') {
      this.mostraDescricao = true;
      this.patrimonio.nomeEspecie = historicoSelecionado.nome;
      this.descricao = historicoSelecionado.nome;
    }
    if (historicoSelecionado.campo == 'especie' && this.flagEspecie) {
      this.patrimonio.idEspecie = historicoSelecionado.id;
      this.especieSelecionada = {
        id: historicoSelecionado.id,
        nome: historicoSelecionado.nome
      }
      this.patrimonio.nomeEspecie = historicoSelecionado.nome;
    }
    if (historicoSelecionado.campo == 'local' && this.flagLocal) {
      this.patrimonio.idLocal = historicoSelecionado.id;
      this.localSelecionado = {
        id: historicoSelecionado.id,
        nome: historicoSelecionado.nome
      }
      this.patrimonio.nomeLocal = historicoSelecionado.nome;
    }
    if (historicoSelecionado.campo == 'marca') {
      this.patrimonio.marca = historicoSelecionado.nome;
      this.marca = historicoSelecionado.nome;
    }
    if (historicoSelecionado.campo == 'modelo') {
      this.patrimonio.modelo = historicoSelecionado.nome;
      this.modelo = historicoSelecionado.nome;
    }
    if (historicoSelecionado.campo == 'responsavel' && this.flagResponsavel) {
      this.patrimonio.idResponsavel = historicoSelecionado.id;
      this.responsavelSelecionado = {
        id: historicoSelecionado.id,
        nome: historicoSelecionado.nome
      }
      this.patrimonio.nomeResponsavel = historicoSelecionado.nome;
    }

  }

  onKey() {
    if (this.codigo.length > this.tamMascara) {
      if (this.codigo.charAt(this.tamMascara) != 'F' && isNaN(+this.codigo.charAt(this.tamMascara)))
        this.codigo = this.codigo.substr(0, this.tamMascara);
      else if (this.codigo.charAt(this.tamMascara) == 'F')
        this.codigo = Util.formataCodigo(this.objConfig.mascara, this.codigo) + 'F';
      else
        this.codigo = Util.formataCodigo(this.objConfig.mascara, this.codigo);
    } else {
      this.codigo = Util.aplicaMascara(this.objConfig.mascara, this.codigo);
    }
  }

  fixaCampo(campoFixado) {
    if (campoFixado == 'filialFalse') {
      this.fixaFilial = true;
    }
    if (campoFixado == 'filialTrue') {
      this.fixaFilial = false;
    }
    if (campoFixado == 'especieFalse') {
      this.fixEspecie = true;
    }
    if (campoFixado == 'especieTrue') {
      this.fixEspecie = false;
    }
    if (campoFixado == 'descricaoFalse') {
      this.fixaDescricao = true;
    }
    if (campoFixado == 'descricaoTrue') {
      this.fixaDescricao = false;
    }
    if (campoFixado == 'serieFalse') {
      this.fixaSerie = true;
    }
    if (campoFixado == 'serieTrue') {
      this.fixaSerie = false;
    }
    if (campoFixado == 'condicaoFalse') {
      this.fixaCondicao = true;
    }
    if (campoFixado == 'condicaoTrue') {
      this.fixaCondicao = false;
    }
    if (campoFixado == 'custoFalse') {
      this.fixaCCusto = true;
    }
    if (campoFixado == 'custoTrue') {
      this.fixaCCusto = false;
    }
    if (campoFixado == 'LocalFalse') {
      this.fixaLocal = true;
    }
    if (campoFixado == 'LocalTrue') {
      this.fixaLocal = false;
    }
    if (campoFixado == 'responsaveisFalse') {
      this.fixaResponsavel = true;
    }
    if (campoFixado == 'responsaveisTrue') {
      this.fixaResponsavel = false;
    }
    if (campoFixado == 'aux1False') {
      this.fixaAux1 = true;
    }
    if (campoFixado == 'aux1True') {
      this.fixaAux1 = false;
    }
    if (campoFixado == 'aux2False') {
      this.fixaAux2 = true;
    }
    if (campoFixado == 'aux2True') {
      this.fixaAux2 = false;
    }
    if (campoFixado == 'aux3False') {
      this.fixaAux3 = true;
    }
    if (campoFixado == 'aux3True') {
      this.fixaAux3 = false;
    }
    if (campoFixado == 'aux4False') {
      this.fixaAux4 = true;
    }
    if (campoFixado == 'aux4True') {
      this.fixaAux4 = false;
    }
    if (campoFixado == 'aux5False') {
      this.fixaAux5 = true;
    }
    if (campoFixado == 'aux5True') {
      this.fixaAux5 = false;
    }
    if (campoFixado == 'aux6False') {
      this.fixaAux6 = true;
    }
    if (campoFixado == 'aux6True') {
      this.fixaAux6 = false;
    }
    if (campoFixado == 'aux7False') {
      this.fixaAux7 = true;
    }
    if (campoFixado == 'aux7True') {
      this.fixaAux7 = false;
    }
    if (campoFixado == 'aux8False') {
      this.fixaAux8 = true;
    }
    if (campoFixado == 'aux8True') {
      this.fixaAux8 = false;
    }
    if (campoFixado == 'obsFalse') {
      this.fixaObs = true;
    }
    if (campoFixado == 'obsTrue') {
      this.fixaObs = false;
    }
  }

  buscarFilial() {
    this.navCtrl.push('BuscaFilaisPage');
  }

  buscarEspecie() {
    this.navCtrl.push('BuscaGrupoPage');
  }

  buscarCentroCustos() {
    this.navCtrl.push('BuscaCcustosPage');
  }

  buscarLocal() {
    this.navCtrl.push('BuscaLocalPage');
  }

  buscarResponsavel() {
    this.navCtrl.push('BuscaResponsaveisPage');
  }

  buscarPatrimonio() {
    this.navCtrl.push('BuscaPatrimonioPage');
  }
  buscarCondicao() {
    this.navCtrl.push('BuscaCondicaoPage')
  }

  chamarRfid() { // método chamado para realizar leitura por RFID
    this.navCtrl.push('RfidNativoPage');
  }

  salvarDados() { // método chamado para salvar inclusão/alteração nos dados do patrimonio
    this.gravarPatrimonio("");
  }

  buscaHistorico(campo) {
    var top10Historico: any[] = [];
    if (campo == 'filial') {
      if (this.historicoFilial.length > 10) {
        for (let i = 10; i >= 1; i--) {

          top10Historico.push(this.historicoFilial[this.historicoFilial.length - i])
        }
      } else {
        for (let i = 0; i < this.historicoFilial.length; i++) {
        }
        top10Historico = this.historicoFilial;
      }
      this.navCtrl.push('HistoricoCamposPage', {
        itensHistorico: top10Historico
      });
    }
    if (campo == 'especie') {
      if (this.historicoEspecie.length > 10) {
        for (let i = 10; i >= 1; i--) {
          top10Historico.push(this.historicoEspecie[this.historicoEspecie.length - i])
        }
      } else {
        top10Historico = this.historicoEspecie;
      }
      this.navCtrl.push('HistoricoCamposPage', {
        itensHistorico: top10Historico
      });
    }
    if (campo == 'descricao') {
      if (this.historicoDescricao.length > 10) {
        for (let i = 10; i >= 1; i--) {
          top10Historico.push(this.historicoDescricao[this.historicoDescricao.length - i])
        }
      } else {
        top10Historico = this.historicoDescricao;
      }
      this.navCtrl.push('HistoricoCamposPage', {
        itensHistorico: top10Historico
      });
    }
    if (campo == 'marca') {
      if (this.historicoMarca.length > 10) {
        for (let i = 10; i >= 1; i--) {
          top10Historico.push(this.historicoMarca[this.historicoMarca.length - i])
        }
      } else {
        top10Historico = this.historicoMarca;
      }
      this.navCtrl.push('HistoricoCamposPage', {
        itensHistorico: top10Historico
      });
    }
    if (campo == 'modelo') {
      if (this.historicoModelo.length > 10) {
        for (let i = 10; i >= 1; i--) {
          top10Historico.push(this.historicoModelo[this.historicoModelo.length - i])
        }
      } else {
        top10Historico = this.historicoModelo;
      }
      this.navCtrl.push('HistoricoCamposPage', {
        itensHistorico: top10Historico
      });
    }
    if (campo == 'custos') {
      if (this.historicoCusto.length > 10) {
        for (let i = 10; i >= 1; i--) {
          top10Historico.push(this.historicoCusto[this.historicoCusto.length - i])
        }
      } else {
        top10Historico = this.historicoCusto;
      }
      this.navCtrl.push('HistoricoCamposPage', {
        itensHistorico: top10Historico
      });
    }
    if (campo == 'local') {
      if (this.historicoLocal.length > 10) {
        for (let i = 10; i >= 1; i--) {
          top10Historico.push(this.historicoLocal[this.historicoLocal.length - i])
        }
      } else {
        top10Historico = this.historicoLocal;
      }
      this.navCtrl.push('HistoricoCamposPage', {
        itensHistorico: top10Historico
      });
    }
    if (campo == 'responsaveis') {
      if (this.historicoResposanveis.length > 10) {
        for (let i = 10; i >= 1; i--) {
          top10Historico.push(this.historicoResposanveis[this.historicoResposanveis.length - i])
        }
      } else {
        top10Historico = this.historicoResposanveis;
      }
      this.navCtrl.push('HistoricoCamposPage', {
        itensHistorico: top10Historico
      });
    }
  }
  buscaHistoricoAnterior(campo) {
    if (campo == 'filial') {
      this.filialSelecionada = this.historicoFilial[this.historicoFilial.length - 1];

    }
    if (campo == 'especie') {
      this.especieSelecionada = this.historicoEspecie[this.historicoEspecie.length - 1];
    }
    if (campo == 'descricao') {
      this.especieSelecionada = this.historicoEspecie[this.historicoEspecie.length - 1];
      this.descricao = this.historicoDescricao[this.historicoDescricao.length - 1].nome;
    }
    if (campo == 'marca') {
      this.marca = this.historicoMarca[this.historicoMarca.length - 1].nome;
    }
    if (campo == 'modelo') {
      this.modelo = this.historicoModelo[this.historicoModelo.length - 1].nome;
    }
    if (campo == 'custos') {
      this.centroCustosSelecionado = this.historicoCusto[this.historicoCusto.length - 1];
    }
    if (campo == 'local') {
      this.localSelecionado = this.historicoLocal[this.historicoLocal.length - 1];
    }
    if (campo == 'responsaveis') {
      this.responsavelSelecionado = this.historicoResposanveis[this.historicoResposanveis.length - 1];
    }
    if (campo == 'condicao') {
      this.codicaoSelecionada = this.historicoCondicao[this.historicoCondicao.length - 1];
    }
    if (campo == 'tag') {
      this.tag = this.historicoTag[this.historicoTag.length - 1].nome;
    }
    if (campo == 'aux1') {
      this.aux1 = this.historicoAux1[this.historicoAux1.length - 1].nome;
    }
    if (campo == 'aux2') {
      this.aux2 = this.historicoAux2[this.historicoAux2.length - 1].nome;
    }
    if (campo == 'aux3') {
      this.aux3 = this.historicoAux3[this.historicoAux3.length - 1].nome;
    }
    if (campo == 'aux4') {
      this.aux4 = this.historicoAux4[this.historicoAux4.length - 1].nome;
    }
    if (campo == 'aux5') {
      this.aux5 = this.historicoAux5[this.historicoAux5.length - 1].nome;
    }
    if (campo == 'aux6') {
      this.aux6 = this.historicoAux6[this.historicoAux6.length - 1].nome;
    }
    if (campo == 'aux7') {
      this.aux7 = this.historicoAux7[this.historicoAux7.length - 1].nome;
    }
    if (campo == 'aux8') {
      this.aux8 = this.historicoAux8[this.historicoAux8.length - 1].nome;
    }
    if (campo == 'obs') {
      this.obs = this.historicoObs[this.historicoObs.length - 1].nome;
    }
    this.bindHistoricoToPatrimonio(campo);
  }

  chamaBarCode() {
    this.barcodeScanner.scan().then(async data => {
      if (data.cancelled === true) {
        this.appCtrl.getRootNav().setRoot('ConjutoInventarioPage', { tabIndex: 1 });
      } else
        this.config = await this.session.getConfiguracao();
      this.objConfig = new ConfiguracaoEquipamento(this.config);
      if (this.objConfig.mascara.length > data.text.length) {
        this.codigo = Util.aplicaMascara(this.objConfig.mascara, data.text)
      } else {
        this.codigo = data.text.substring(data.text.length - this.objConfig.mascara.length);
      }
      this.filtro = ' WHERE Patrimonio.codigo = ' + '\'' + this.codigo + '\'';
      this.buscaPatrimonio();
    });
  }

  async carregaPropriedadePorPartrimonio(banco: string, idPatrimonio: number, idEspecie: number) {
    var atributosDoBemHelper: AtributosDoBemHelper = new AtributosDoBemHelper(this.atributosDoBemDao);
    var retorno = await atributosDoBemHelper.buscaAtributosDoBemPorPatrimonio(banco, idPatrimonio);

    if (retorno == undefined || (retorno != undefined && retorno.length == 0)) {
      if (idEspecie != undefined && idEspecie != 0) {
        retorno = await this.carregaPropriedadePorEspecie(banco, idEspecie);
      }
    }

    return retorno;
  }

  async carregaPropriedadePorEspecie(banco: string, idEspecie: number) {

    var atributosDoBemHelper: AtributosDoBemHelper = new AtributosDoBemHelper(this.atributosDoBemDao);
    var retorno = await atributosDoBemHelper.buscaAtributosDoBemPorEspecie(banco, idEspecie);
    return retorno;

  }

  async gravarPatrimonio(operacao: string) {
    if (!await this.validarFotos())
      return
    let loadingSalvar = this.loadingCtrl.create({
      content: 'Salvando...'
    })
    loadingSalvar.present();
    this.verificaRevisao();
    var permiteBaixar = true;
    var atributosDoBemHelper = new AtributosDoBemHelper(this.atributosDoBemDao);
    var inventarioHelper = new InventarioHelper(this.inventarioDao);
    var patrimonioHelper: PatrimonioHelper = new PatrimonioHelper(this.tipoDadoPatrimonioDao, this.inventarioMovimentacoesDao,
      this.patrimonioDao, this.configEqpDao, this.session,
      atributosDoBemHelper, inventarioHelper);
    var patrimonio: Patrimonio = await this.preencherObjetoPatrimonio();

    if (operacao === 'baixar') {

      if (patrimonio.observacao == this.resposta.observacao)
        permiteBaixar = false;

    }

    if (permiteBaixar) {
      this.atributosDoBemAlterado = this.preencherPropriedades();

      if (patrimonio.status == "") {
        var temF: number = patrimonio.codigo.indexOf('F');

        if (temF > 0) {
          if (this.isFicticio) {
            this.permiteGravarDireto = true;
          } else {
            this.permiteGravarDireto = false;
            alert("O caracter 'F' é reservado para códigos ficti­cios. \nVocê só pode inserir um código ficticio clicando no botão 'F'.")
          }
        } else {
          this.permiteGravarDireto = true;
        }

        if (this.permiteGravarDireto) {
          try {
            patrimonio.status = 'I';

            var idInserido = await patrimonioHelper.inserirRegistro(this.clienteSelecionado.banco, this.atributosDoBemAlterado, patrimonio);
            if (idInserido > 0) {
              this.historicoCampos();
              this.status = "I"
              this.dadosPropriedades = [];
              this.gravouPatrimonio = true;
              this.toast.create({
                message: 'Patrimonio inserido com sucesso',
                duration: 2500,
                position: 'center'
              }).present();
              loadingSalvar.dismiss();
            }
          } catch (ex) {
            loadingSalvar.dismiss();
            alert(ex);
            patrimonio.status = "";
            this.status = "?"
            return;
          }
          if (this.isFicticio && this.permiteGravarDireto) {
            var codigoFicticioHelper: CodigoFicticioHelper = new CodigoFicticioHelper(this.codigoFicticioDao, this.session, this.patrimonioDao);
            await codigoFicticioHelper.atualizaFicticio(this.objFicticio);
            this.isFicticio = false;
            this.permiteGravarDireto = false;
          }
        }
      } else {
        if (this.resposta == undefined) {
          var filtro = ' WHERE Patrimonio.codigo = ' + '\'' + this.codigo + '\'';
          this.resposta = await patrimonioHelper.selecionaPatrimonioPorFiltro(this.clienteSelecionado.banco, filtro);
        }
        var listAlteracaoCampos: AlteracaoCampos[] = patrimonioHelper.buscaAlteracoesCampos(this.resposta, this.patrimonio);
        var listAlteracoesPropriedades: AlteracaoCampos[] = patrimonioHelper.buscaAlteracoesPropriedade(this.propriedades, this.atributosDoBemAlterado);
        var alteracao: AlteracaoCampos;

        if (operacao == "baixar") {
          alteracao = new AlteracaoCampos();
          alteracao.campo = "Status";
          alteracao.idAntigo = "";
          alteracao.idNovo = "";
          alteracao.valorAntigo = patrimonio.status;
          alteracao.valorNovo = "B";
          listAlteracaoCampos.push(alteracao);
          patrimonio.status = "B";
        }
        if (operacao == "desfazbaixa" && patrimonio.status == 'B') {
          alteracao = new AlteracaoCampos();
          alteracao.campo = "Status";
          alteracao.idAntigo = "";
          alteracao.idNovo = "";
          alteracao.valorAntigo = patrimonio.status;
          alteracao.valorNovo = "A";
          listAlteracoesPropriedades.push(alteracao);
          patrimonio.status = "A";
        } else if (operacao == "desfazbaixa" && patrimonio.status != 'B') {
          loadingSalvar.dismiss();
          alert('Patrimonio não está baixado!');
          return
        }
        var retorno: any = await patrimonioHelper.alterarRegistro(this.clienteSelecionado.banco, listAlteracaoCampos, listAlteracoesPropriedades, this.patrimonio, this.atributosDoBemAlterado)
        if (retorno > 0) {
          if (operacao != 'baixar' && operacao != 'desfazbaixa') {
            if (this.revisaoRapidaAtivado === true)
              this.status = 'R'
            else
              this.status = 'A'
          } else if (operacao == 'baixar') {
            this.status = 'B'
          } else {
            this.status = 'A'
          }

          this.historicoCampos();
          this.dadosPropriedades = [];
          this.gravouPatrimonio = true;
          this.toast.create({
            message: 'Patrimonio alterado com sucesso',
            duration: 2500,
            cssClass: 'teste-toast'
          }).present();
          loadingSalvar.dismiss();
        }
        else {
          loadingSalvar.dismiss();
          alert("Por algum motivo o item não foi gravado\rPor favor, informe ao desenvolvimento.");
        }
      }
    } else {
      loadingSalvar.dismiss();
      alert('Justifique a baixa no campo OBSERVAÇÃO.');
    }
  }

  retornaIdPatrimonio() {
    if (this.resposta != undefined)
      return { id: this.resposta.id, banco: this.clienteSelecionado.banco }
    else
      return null
  }

  private preencherPropriedades(): AtributoDoBem[] {
    var listProp: AtributoDoBem[] = [];
    if (this.passapropriedade == undefined) {
      this.passapropriedade = this.pegaPropriedades();
      if (this.passapropriedade.length > 0) {
        for (var i = 0; i < this.passapropriedade.length; i++) {
          listProp.push(Object.assign({}, this.passapropriedade[i]));
        }
      }
    }
    else {
      for (var i = 0; i < this.passapropriedade.length; i++) {
        listProp.push(Object.assign({}, this.passapropriedade[i]));
      }
    }
    return listProp;

  }

  pegaPropriedades() {
    let pegaPropriedade: any[] = [];
    if (this.propriedades != undefined) {
      for (let index = 0; index < this.propriedades.length; index++) {
        pegaPropriedade[index] = Object.assign({}, this.propriedades[index]);
      }
    }
    return pegaPropriedade;
  }

  change(att2, att) {

    if (this.patrimonio.status == "") {
      if (this.passapropriedade == undefined)
        this.passapropriedade = [];
      if (this.passapropriedade.length == 0) {
        for (var i = 0; i < this.propriedades.length; i++) {
          this.passapropriedade.push(Object.assign({}, this.propriedades[i]));
        }
      }
      this.atualizaValorPropriedade(att, att2);
    }
    else {
      this.atualizaValorPropriedade(att, att2);
    }
  }

  private atualizaValorPropriedade(att: any, att2: any) {
    var nomeAtt;
    if (att.id_tipoDado == 1)
      nomeAtt = att2.value;
    else if (att.id_tipoDado == 2)
      nomeAtt = att2;
    else if (att.id_tipoDado == 4)
      nomeAtt = att2.valor;

    if (att.id_tipoDado == 1 || att.id_tipoDado == 2 || att.id_tipoDado == 4) {
      this.dadosPropriedades.pop();
      this.dadosPropriedades.push({
        id_tipoDado: att.id_tipoDado,
        nome: att.nome,
        id_patrimonio: att.id_patrimonio,
        texto: nomeAtt,
        id_propriedade: att.id_propriedade
      });
      for (let i = 0; i < this.passapropriedade.length; i++) {
        if (this.passapropriedade[i].id_propriedade == this.dadosPropriedades[0].id_propriedade) {
          this.passapropriedade[i].texto = this.dadosPropriedades[0].texto;
        }
      }
    }
  }
  async buscaPatrimonioCodigo() {
    this.filtro = ' WHERE Patrimonio.codigo = ' + '\'' + this.codigo + '\'';
    this.buscaPatrimonio();
    this.obtemCoordenadas();
  }
  async buscaPatrimonioTags(campo, valor) {
    var atributosDoBemHelper = new AtributosDoBemHelper(this.atributosDoBemDao);
    var inventarioHelper = new InventarioHelper(this.inventarioDao);
    var patrimonioHelper: PatrimonioHelper = new PatrimonioHelper(this.tipoDadoPatrimonioDao, this.inventarioMovimentacoesDao,
      this.patrimonioDao, this.configEqpDao, this.session,
      atributosDoBemHelper, inventarioHelper);
    this.filtro = ' WHERE Patrimonio.' + campo + ' = ' + '\'' + valor + '\'';
    this.retornoBuscaTags = await patrimonioHelper.selecionaPatrimonioPorFiltro(this.clienteSelecionado.banco,
      this.filtro);
    this.navCtrl.push('BuscaPorTagPage', {
      tagsEncontradas: this.retornoBuscaTags
    });
  }

  async buscaPatrimonio() {
    this.gravouPatrimonio = false;
    this.buscaFeita = true;
    this.verificaRevisao();
    var atributosDoBemHelper = new AtributosDoBemHelper(this.atributosDoBemDao);
    var inventarioHelper = new InventarioHelper(this.inventarioDao);
    var patrimonioHelper: PatrimonioHelper = new PatrimonioHelper(this.tipoDadoPatrimonioDao, this.inventarioMovimentacoesDao,
      this.patrimonioDao, this.configEqpDao, this.session,
      atributosDoBemHelper, inventarioHelper);

    this.resposta = await patrimonioHelper.selecionaPatrimonioPorFiltro(this.clienteSelecionado.banco, this.filtro);
    if (this.resposta.status == "B") {
      this.itemBaixado = true;
    } else {
      this.itemBaixado = false;
    }
    console.log('rerererere', this.resposta);

    if (this.resposta == undefined) {
      this.pegaCamposFixados();
      this.limparCampos();
      this.propriedades = undefined;
      this.limparChamadas();
      console.log('Nenhum patrimonio encontrado');
      this.patrimonio = new Patrimonio();
      this.status = '?'
    } else {
      this.status = this.resposta.status
      this.pegaCamposFixados();
      console.log('Patrimonio encontrado');
      this.propriedades = await this.carregaPropriedadePorPartrimonio(this.clienteSelecionado.banco, this.resposta.id, this.resposta.idEspecie);
      this.passapropriedade = this.pegaPropriedades();

      await this.preencherLookUp();
      this.preencheLookUpTipo2();
      this.bindResult(this.resposta);
      this.bindFixacao();
    }
  }

  historicoCampos() {
    if (this.patrimonio.idFilial != null) {
      if (this.historicoFilial.length > 0) {
        var teste = this.historicoFilial.find(data => data.id === this.patrimonio.idFilial);
        if (teste == undefined) {
          this.historicoFilial.push({
            id: this.patrimonio.idFilial,
            codigo: this.patrimonio.codigoFilial, nome: this.patrimonio.nomeFilial, campo: 'filial'
          });
        }
      } else {
        this.historicoFilial.push({
          id: this.patrimonio.idFilial,
          codigo: this.patrimonio.codigoFilial, nome: this.patrimonio.nomeFilial, campo: 'filial'
        });
      }
    }
    if (this.patrimonio.idCentroCusto != null && this.patrimonio.idCentroCusto != 0) {
      if (this.historicoCusto.length > 0) {
        var teste = this.historicoCusto.find(data => data.id === this.patrimonio.idCentroCusto);
        if (teste == undefined) {
          this.historicoCusto.push({
            id: this.patrimonio.idCentroCusto, nome: this.patrimonio.nomeCentroCusto, campo: 'custo'
          });
        }
      } else {
        this.historicoCusto.push({
          id: this.patrimonio.idCentroCusto, nome: this.patrimonio.nomeCentroCusto, campo: 'custo'
        });
      }
    }
    if (this.patrimonio.descricao != null && this.patrimonio.descricao != "") {
      if (this.historicoDescricao.length > 0) {
        var teste = this.historicoDescricao.find(data => data.nome === this.patrimonio.descricao);
        if (teste == undefined) {
          this.historicoDescricao.push({
            nome: this.patrimonio.descricao, campo: 'descricao'
          });
        }
      } else {
        this.historicoDescricao.push({
          nome: this.patrimonio.descricao, campo: 'descricao'
        });
      }
    }
    if (this.patrimonio.idEspecie != null) {
      if (this.historicoEspecie.length > 0) {
        var teste = this.historicoEspecie.find(data => data.id === this.patrimonio.idEspecie);
        if (teste == undefined) {
          this.historicoEspecie.push({
            id: this.patrimonio.idEspecie, nome: this.patrimonio.nomeEspecie, campo: 'especie'
          });
        }
      } else {
        this.historicoEspecie.push({
          id: this.patrimonio.idEspecie, nome: this.patrimonio.nomeEspecie, campo: 'especie'
        });
      }
    }
    if (this.patrimonio.idLocal != null) {
      if (this.historicoLocal.length > 0) {
        var teste = this.historicoLocal.find(data => data.id === this.patrimonio.idLocal);
        if (teste == undefined) {
          this.historicoLocal.push({
            id: this.patrimonio.idLocal, nome: this.patrimonio.nomeLocal, campo: 'local'
          });
        }
      } else {
        this.historicoLocal.push({
          id: this.patrimonio.idLocal, nome: this.patrimonio.nomeLocal, campo: 'local'
        });
      }
    }
    if (this.patrimonio.marca != null && this.patrimonio.marca != "") {
      if (this.historicoMarca.length > 0) {
        var teste = this.historicoMarca.find(data => data.nome === this.patrimonio.marca);
        if (teste == undefined) {
          this.historicoMarca.push({
            nome: this.patrimonio.marca, campo: 'marca'
          });
        }
      } else {
        this.historicoMarca.push({
          nome: this.patrimonio.marca, campo: 'marca'
        });
      }
    }
    if (this.patrimonio.modelo != null && this.patrimonio.modelo != "") {
      if (this.historicoModelo.length > 0) {
        var teste = this.historicoModelo.find(data => data.nome === this.patrimonio.modelo);
        if (teste == undefined) {
          this.historicoModelo.push({
            nome: this.patrimonio.modelo, campo: 'modelo'
          });
        }
      } else {
        this.historicoModelo.push({
          nome: this.patrimonio.modelo, campo: 'modelo'
        });
      }
    }
    if (this.patrimonio.idResponsavel != null) {
      if (this.historicoResposanveis.length > 0) {
        var teste = this.historicoResposanveis.find(data => data.id === this.patrimonio.idResponsavel);
        if (teste == undefined) {
          this.historicoResposanveis.push({
            id: this.patrimonio.idResponsavel, nome: this.patrimonio.nomeResponsavel, campo: 'responsavel'
          });
        }
      } else {
        this.historicoResposanveis.push({
          id: this.patrimonio.idResponsavel, nome: this.patrimonio.nomeResponsavel, campo: 'responsavel'
        });
      }
    }
    if (this.patrimonio.idCondicao != null && this.patrimonio.idCondicao != undefined) {
      if (this.historicoCondicao.length > 0) {
        var teste = this.historicoCondicao.find(data => data.id === this.patrimonio.idCondicao);
        if (teste == undefined) {
          this.historicoCondicao.push({
            id: this.patrimonio.idCondicao, nome: this.patrimonio.nomeCondicao, campo: 'condicao'
          });
        }
      } else {
        this.historicoCondicao.push({
          id: this.patrimonio.idCondicao, nome: this.patrimonio.nomeCondicao, campo: 'condicao'
        });
      }
    }
    if (this.patrimonio.tag != null && this.patrimonio.tag != "") {
      if (this.historicoTag.length > 0) {
        var teste = this.historicoTag.find(data => data.nome === this.patrimonio.tag);
        if (teste == undefined) {
          this.historicoTag.push({
            nome: this.patrimonio.tag, campo: 'tag'
          });
        }
      } else {
        this.historicoTag.push({
          nome: this.patrimonio.tag, campo: 'tag'
        });
      }
    }
    if (this.patrimonio.aux1 != null && this.patrimonio.aux1 != "") {
      if (this.historicoAux1.length > 0) {
        var teste = this.historicoAux1.find(data => data.nome === this.patrimonio.aux1);
        if (teste == undefined) {
          this.historicoAux1.push({
            nome: this.patrimonio.aux1, campo: 'aux1'
          });
        }
      } else {
        this.historicoAux1.push({
          nome: this.patrimonio.aux1, campo: 'aux1'
        });
      }
    }
    if (this.patrimonio.aux2 != null && this.patrimonio.aux2 != "") {
      if (this.historicoAux2.length > 0) {
        var teste = this.historicoAux2.find(data => data.nome === this.patrimonio.aux2);
        if (teste == undefined) {
          this.historicoAux2.push({
            nome: this.patrimonio.aux2, campo: 'aux1'
          });
        }
      } else {
        this.historicoAux2.push({
          nome: this.patrimonio.aux2, campo: 'aux1'
        });
      }
    }
    if (this.patrimonio.aux3 != null && this.patrimonio.aux3 != "") {
      if (this.historicoAux3.length > 0) {
        var teste = this.historicoAux3.find(data => data.nome === this.patrimonio.aux3);
        if (teste == undefined) {
          this.historicoAux3.push({
            nome: this.patrimonio.aux3, campo: 'aux1'
          });
        }
      } else {
        this.historicoAux3.push({
          nome: this.patrimonio.aux3, campo: 'aux1'
        });
      }
    }
    if (this.patrimonio.aux4 != null && this.patrimonio.aux4 != "") {
      if (this.historicoAux4.length > 0) {
        var teste = this.historicoAux4.find(data => data.nome === this.patrimonio.aux4);
        if (teste == undefined) {
          this.historicoAux4.push({
            nome: this.patrimonio.aux4, campo: 'aux1'
          });
        }
      } else {
        this.historicoAux4.push({
          nome: this.patrimonio.aux4, campo: 'aux1'
        });
      }
    }
    if (this.patrimonio.aux5 != null && this.patrimonio.aux5 != "") {
      if (this.historicoAux5.length > 0) {
        var teste = this.historicoAux5.find(data => data.nome === this.patrimonio.aux5);
        if (teste == undefined) {
          this.historicoAux5.push({
            nome: this.patrimonio.aux5, campo: 'aux1'
          });
        }
      } else {
        this.historicoAux5.push({
          nome: this.patrimonio.aux5, campo: 'aux1'
        });
      }
    }
    if (this.patrimonio.aux6 != null && this.patrimonio.aux6 != "") {
      if (this.historicoAux6.length > 0) {
        var teste = this.historicoAux6.find(data => data.nome === this.patrimonio.aux6);
        if (teste == undefined) {
          this.historicoAux6.push({
            nome: this.patrimonio.aux6, campo: 'aux1'
          });
        }
      } else {
        this.historicoAux6.push({
          nome: this.patrimonio.aux6, campo: 'aux1'
        });
      }
    }
    if (this.patrimonio.aux7 != null && this.patrimonio.aux7 != "") {
      if (this.historicoAux7.length > 0) {
        var teste = this.historicoAux7.find(data => data.nome === this.patrimonio.aux7);
        if (teste == undefined) {
          this.historicoAux7.push({
            nome: this.patrimonio.aux7, campo: 'aux1'
          });
        }
      } else {
        this.historicoAux7.push({
          nome: this.patrimonio.aux7, campo: 'aux1'
        });
      }
    }
    if (this.patrimonio.aux8 != null && this.patrimonio.aux8 != "") {
      if (this.historicoAux8.length > 0) {
        var teste = this.historicoAux8.find(data => data.nome === this.patrimonio.aux8);
        if (teste == undefined) {
          this.historicoAux8.push({
            nome: this.patrimonio.aux8, campo: 'aux1'
          });
        }
      } else {
        this.historicoAux8.push({
          nome: this.patrimonio.aux8, campo: 'aux1'
        });
      }
    }
    if (this.patrimonio.observacao != null && this.patrimonio.observacao != "") {
      if (this.historicoObs.length > 0) {
        var teste = this.historicoObs.find(data => data.nome === this.patrimonio.observacao);
        if (teste == undefined) {
          this.historicoObs.push({
            nome: this.patrimonio.observacao, campo: 'obs'
          });
        }
      } else {
        this.historicoObs.push({
          nome: this.patrimonio.observacao, campo: 'obs'
        });
      }
    }
  }

  lerBarcodeDoCampo(campoDeLeitura) {
    this.barcodeScanner.scan().then(data => {
      if (data.cancelled === true) {
        this.appCtrl.getRootNav().setRoot('ConjutoInventarioPage', { tabIndex: 1 });
      } else {
        if (campoDeLeitura == 'codAnterior') {
          this.codAnterior = data.text;
        }
        if (campoDeLeitura == 'marca') {
          this.marca = data.text;
        }
        if (campoDeLeitura == 'modelo') {
          this.modelo = data.text;
        }
        if (campoDeLeitura == 'serie') {
          this.serie = data.text;
        }
        if (campoDeLeitura == 'tag') {
          this.tag = data.text;
        }
        if (campoDeLeitura == 'aux1') {
          this.aux1 = data.text;
        }
        if (campoDeLeitura == 'aux2') {
          this.aux2 = data.text;
        }
        if (campoDeLeitura == 'aux3') {
          this.aux3 = data.text;
        }
        if (campoDeLeitura == 'aux4') {
          this.aux4 = data.text;
        }
        if (campoDeLeitura == 'aux5') {
          this.aux5 = data.text;
        }
        if (campoDeLeitura == 'aux6') {
          this.aux6 = data.text;
        }
        if (campoDeLeitura == 'aux7') {
          this.aux7 = data.text;
        }
        if (campoDeLeitura == 'aux8') {
          this.aux8 = data.text;
        }
        if (campoDeLeitura == 'obs') {
          this.obs = data.text;
        }
      }
    });
  }

  pegaCamposFixados() {
    if (this.fixaFilial && this.filialSelecionada != undefined) {
      if (this.resposta == undefined) {
        this.resposta = {
          idFilial: this.filialSelecionada.id,
          CodigoFilial: this.filialSelecionada.codigo,
          Filial: this.filialSelecionada.nome
        }
      } else {
        this.resposta.idFilial = this.filialSelecionada.id;
        this.resposta.CodigoFilial = this.filialSelecionada.codigo;
        this.resposta.Filial = this.filialSelecionada.nome;
      }
    }
    if (this.fixEspecie && this.especieSelecionada != undefined) {
      if (this.resposta == undefined) {
        this.resposta = {
          idEspecie: this.especieSelecionada.id,
          CodigoEspecie: this.especieSelecionada.codigo,
          Especie: this.especieSelecionada.nome
        }
      } else {
        this.resposta.idEspecie = this.especieSelecionada.id;
        this.resposta.CodigoEspecie = this.especieSelecionada.codigo;
        this.resposta.Especie = this.especieSelecionada.nome;
      }
    }
    if (this.fixaDescricao) {
      if (this.resposta == undefined) {
        this.resposta = {
          descricao: this.descricao
        }
      } else {
        this.resposta.descricao = this.descricao;
      }
    }
    if (this.fixaSerie) {
      if (this.resposta == undefined) {
        this.resposta = {
          serie: this.serie
        }
      } else {
        this.resposta.serie = this.serie;
      }
    }
    if (this.fixaCondicao && this.codicaoSelecionada != undefined) {
      if (this.resposta == undefined) {
        this.resposta = {
          idCondicao: this.codicaoSelecionada.id,
          Condicao: this.codicaoSelecionada.nome
        }
      } else {
        this.resposta.idCondicao = this.codicaoSelecionada.id;
        this.resposta.Condicao = this.codicaoSelecionada.nome;
      }
    }
    if (this.fixaCCusto && this.centroCustosSelecionado != undefined) {
      if (this.resposta == undefined) {
        this.resposta = {
          idCentroCusto: this.centroCustosSelecionado.id,
          CentroDeCusto: this.centroCustosSelecionado.nome
        }
      } else {
        this.resposta.idCentroCusto = this.centroCustosSelecionado.id;
        this.resposta.CentroDeCusto = this.centroCustosSelecionado.nome;
      }
    }
    if (this.fixaLocal && this.localSelecionado != undefined) {
      if (this.resposta == undefined) {
        this.resposta = {
          idLocal: this.localSelecionado.id,
          Local: this.localSelecionado.nome
        }
      } else {
        this.resposta.idLocal = this.localSelecionado.id;
        this.resposta.Local = this.localSelecionado.nome;
      }
    }
    if (this.fixaResponsavel && this.responsavelSelecionado != undefined) {
      if (this.resposta == undefined) {
        this.resposta = {
          idResponsavel: this.responsavelSelecionado.id,
          Responsavel: this.responsavelSelecionado.nome
        }
      } else {
        this.resposta.idResponsavel = this.responsavelSelecionado.id;
        this.resposta.Responsavel = this.responsavelSelecionado.nome;
      }
    }
    if (this.fixaAux1) {
      if (this.resposta == undefined) {
        this.resposta = {
          aux1: this.aux1
        }
      } else {
        this.resposta.aux1 = this.aux1;
      }
    }
    if (this.fixaAux2) {
      if (this.resposta == undefined) {
        this.resposta = {
          aux2: this.aux2
        }
      } else {
        this.resposta.aux2 = this.aux2;
      }
    }
    if (this.fixaAux3) {
      if (this.resposta == undefined) {
        this.resposta = {
          aux3: this.aux3
        }
      } else {
        this.resposta.aux3 = this.aux3;
      }
    }
    if (this.fixaAux4) {
      if (this.resposta == undefined) {
        this.resposta = {
          aux4: this.aux4
        }
      } else {
        this.resposta.aux4 = this.aux4;
      }
    }
    if (this.fixaAux5) {
      if (this.resposta == undefined) {
        this.resposta = {
          aux5: this.aux5
        }
      } else {
        this.resposta.aux5 = this.aux5;
      }
    }
    if (this.fixaAux6) {
      if (this.resposta == undefined) {
        this.resposta = {
          aux6: this.aux6
        }
      } else {
        this.resposta.aux6 = this.aux6;
      }
    }
    if (this.fixaAux7) {
      if (this.resposta == undefined) {
        this.resposta = {
          aux7: this.aux7
        }
      } else {
        this.resposta.aux7 = this.aux7;
      }
    }
    if (this.fixaAux8) {
      if (this.resposta == undefined) {
        this.resposta = {
          aux8: this.aux8
        }
      } else {
        this.resposta.aux8 = this.aux8;
      }
    }
    if (this.fixaObs) {
      if (this.resposta == undefined) {
        this.resposta = {
          observacao: this.obs
        }
      } else {
        this.resposta.observacao = this.obs;
      }
    }
  }

  private limparChamadas() {
    if (this.navParams.data.filialSelecionada != null || this.navParams.data.filialSelecionada != undefined) {
      this.navParams.data.filialSelecionada = null;
    }
    if (this.navParams.data.especieSelecionada != null || this.navParams.data.especieSelecionada != undefined) {
      this.navParams.data.especieSelecionada = null;
    }
    if (this.navParams.data.centroCustosSelecionado != null || this.navParams.data.centroCustosSelecionado != undefined) {
      this.navParams.data.centroCustosSelecionado = null;
    }
    if (this.navParams.data.localSelecionado != null || this.navParams.data.localSelecionado != undefined) {
      this.navParams.data.localSelecionado = null;
    }
    if (this.navParams.data.responsavelSelecionado != null || this.navParams.data.responsavelSelecionado != undefined) {
      this.navParams.data.responsavelSelecionado = null;
    }
    if (this.navParams.data.codicaoSelecionada != null || this.navParams.data.codicaoSelecionada != undefined) {
      this.navParams.data.codicaoSelecionada = null;
    }
  }
  bindFixacao() {
    this.filialSelecionada =
      {
        id: this.resposta.idFilial,
        codigo: this.resposta.CodigoFilial,
        nome: this.resposta.Filial
      }
    this.especieSelecionada =
      {
        id: this.resposta.idEspecie,
        codigo: this.resposta.CodigoEspecie,
        nome: this.resposta.Especie
      }
    this.centroCustosSelecionado =
      {
        id: this.resposta.idCentroCusto,
        nome: this.resposta.CentroDeCusto
      }
    this.localSelecionado =
      {
        id: this.resposta.idLocal,
        nome: this.resposta.Local
      }
    this.responsavelSelecionado =
      {
        id: this.resposta.idResponsavel,
        nome: this.resposta.Responsavel
      }
    this.codicaoSelecionada =
      {
        id: this.resposta.idCondicao,
        nome: this.resposta.Condicao
      }
    this.descricao = this.resposta.descricao;
    this.serie = this.resposta.serie;
    this.aux1 = this.resposta.aux1;
    this.aux2 = this.resposta.aux2;
    this.aux3 = this.resposta.aux3;
    this.aux4 = this.resposta.aux4;
    this.aux5 = this.resposta.aux5;
    this.aux6 = this.resposta.aux6;
    this.aux7 = this.resposta.aux7;
    this.aux8 = this.resposta.aux8;
    this.obs = this.resposta.observacao;




  }

  private limparCampos() {
    if (!this.fixaFilial)
      this.filialSelecionada = undefined;
    if (!this.fixEspecie)
      this.especieSelecionada = undefined;
    if (!this.fixaCCusto)
      this.centroCustosSelecionado = undefined;
    if (!this.fixaLocal)
      this.localSelecionado = undefined;
    if (!this.fixaResponsavel)
      this.responsavelSelecionado = undefined;
    if (!this.fixaCondicao)
      this.codicaoSelecionada = undefined;
    if (!this.fixaDescricao)
      this.descricao = '';
    if (!this.fixaSerie)
      this.serie = '';
    if (!this.fixaAux1)
      this.aux1 = '';
    if (!this.fixaAux2)
      this.aux2 = '';
    if (!this.fixaAux3)
      this.aux3 = '';
    if (!this.fixaAux4)
      this.aux4 = '';
    if (!this.fixaAux5)
      this.aux5 = '';
    if (!this.fixaAux6)
      this.aux6 = '';
    if (!this.fixaAux7)
      this.aux7 = '';
    if (!this.fixaAux8)
      this.aux8 = '';
    if (!this.fixaObs)
      this.obs = '';
    this.codAnterior = '';
    this.marca = '';
    this.modelo = '';
    this.tag = '';




  }

  private preencheLookUpTipo2() {
    this.a = 0
    for (let index = 0; index < this.propriedades.length; index++) {
      if (this.propriedades[index].id_tipoDado == 2) {
        this.pegaPropriedade[this.a] = Object.assign({}, this.propriedades[index]);
        this.a++;
      }
    }
    if (this.pegaPropriedade.length != 0) {
      for (let index = 0; index < this.pegaPropriedade.length; index++) {
        this.teste1[index] = this.pegaPropriedade[index];
      }
    }
  }

  private async preencherLookUp() {
    var lookUpHelper: LookUpHelper = new LookUpHelper(this.lookUpDaoProvider);
    for (var i = 0; i < this.propriedades.length; i++) {
      if (this.propriedades[i].id_tipoDado === 4) {
        var lookUp = await lookUpHelper.retornaValorLookUpPorPropriedade(this.clienteSelecionado.banco, this.propriedades[i].id_propriedade);
        this.propriedades[i].lookUp = lookUp;
      }
    }
  }

  async preencherObjetoPatrimonio() {
    this.patrimonio.codigo = this.codigo;
    this.patrimonio.incorporacao = +this.incorporacao;
    this.patrimonio.descricao = this.descricao == undefined ? "" : this.descricao;
    this.patrimonio.aux1 = this.aux1 == undefined ? "" : this.aux1;
    this.patrimonio.aux2 = this.aux2 == undefined ? "" : this.aux2;
    this.patrimonio.aux3 = this.aux3 == undefined ? "" : this.aux3;
    this.patrimonio.aux4 = this.aux4 == undefined ? "" : this.aux4;
    this.patrimonio.aux5 = this.aux5 == undefined ? "" : this.aux5;
    this.patrimonio.aux6 = this.aux6 == undefined ? "" : this.aux6;
    this.patrimonio.aux7 = this.aux7 == undefined ? "" : this.aux7;
    this.patrimonio.aux8 = this.aux8 == undefined ? "" : this.aux8;
    this.patrimonio.observacao = this.obs == undefined ? "" : this.obs;
    this.patrimonio.tag = this.tag == undefined ? "" : this.tag;
    this.patrimonio.incorporacaoAnterior = 0;
    this.patrimonio.codigoAnterior = this.codAnterior == undefined ? "" : this.codAnterior;
    this.patrimonio.serie = this.serie == undefined ? "" : this.serie;
    this.patrimonio.modelo = this.modelo == undefined ? "" : this.modelo;
    this.patrimonio.marca = this.marca == undefined ? "" : this.marca;
    this.patrimonio.ultimoUsuario = this.usuario.login;
    if (this.fixaFilial || this.fixEspecie || this.fixaAux1 || this.fixaAux2 || this.fixaAux3 || this.fixaAux4 ||
      this.fixaAux5 || this.fixaAux6 || this.fixaAux7 || this.fixaAux8 || this.fixaCCusto || this.fixaCondicao ||
      this.fixaDescricao || this.fixaLocal || this.fixaObs || this.fixaPropriedades || this.fixaResponsavel ||
      this.fixaSerie) {
      this.pegaCamposFixados();
      this.bindResultCamposFixados(this.resposta);
    }

    return this.patrimonio
  }

  bindResult(resposta) {
    this.patrimonio.id = resposta.id;
    this.patrimonio.idFilial = resposta.idFilial;
    this.patrimonio.codigoFilial = resposta.CodigoFilial;
    this.patrimonio.nomeFilial = resposta.Filial;
    this.patrimonio.idEspecie = resposta.idEspecie;
    this.patrimonio.nomeEspecie = resposta.Especie;
    this.patrimonio.idResponsavel = resposta.idResponsavel;
    this.patrimonio.nomeResponsavel = resposta.Responsavel;
    this.patrimonio.idCentroCusto = resposta.idCentroCusto;
    this.patrimonio.nomeCentroCusto = resposta.CentroDeCusto;
    this.patrimonio.idLocal = resposta.idLocal;
    this.patrimonio.nomeLocal = resposta.Local;
    this.patrimonio.idCondicao = resposta.idCondicao;
    this.patrimonio.nomeCondicao = resposta.Condicao;
    this.patrimonio.codigo = resposta.codigo;
    this.patrimonio.codigoAnterior = resposta.codigoAnterior;
    this.patrimonio.incorporacao = resposta.incorporacao;
    this.patrimonio.incorporacaoAnterior = resposta.incorporacaoAnterior;
    this.patrimonio.descricao = resposta.descricao;
    this.patrimonio.serie = resposta.serie;
    this.patrimonio.observacao = resposta.observacao;
    this.patrimonio.tag = resposta.tag;
    this.patrimonio.aux1 = resposta.aux1;
    this.patrimonio.aux2 = resposta.aux2;
    this.patrimonio.aux3 = resposta.aux3;
    this.patrimonio.aux4 = resposta.aux4;
    this.patrimonio.aux5 = resposta.aux5;
    this.patrimonio.aux6 = resposta.aux6;
    this.patrimonio.aux7 = resposta.aux7;
    this.patrimonio.aux8 = resposta.aux8;
    this.patrimonio.status = resposta.status;
    this.patrimonio.latitude = resposta.latitude;
    this.patrimonio.longitude = resposta.longitude;
    this.patrimonio.altitude = resposta.altitude;
    this.patrimonio.seq = resposta.seq;
    this.patrimonio.gravado = resposta.gravado;
    this.patrimonio.numeroFicticio = resposta.numeroFicticio;
    this.patrimonio.id_linkEspecieMarca = resposta.id_linkEspecieMarca;
    this.patrimonio.id_linkEspecieMarcaModelo = resposta.id_linkEspecieMarcaModelo;
    this.patrimonio.marca = resposta.marca;
    this.patrimonio.modelo = resposta.modelo;

  }
  bindHistoricoToPatrimonio(campo) {
    if (this.historicoFilial.length > 0 && campo == 'filial') {
      this.patrimonio.idFilial = this.historicoFilial[0].id;
      this.patrimonio.codigoFilial = this.historicoFilial[0].codigo;
      this.patrimonio.nomeFilial = this.historicoFilial[0].nome;
    }
    if (this.historicoEspecie.length > 0 && campo == 'especie') {
      this.patrimonio.idEspecie = this.historicoEspecie[0].id;
      this.patrimonio.nomeEspecie = this.historicoEspecie[0].nome;
    }
    if (this.historicoResposanveis.length > 0 && campo == 'responsaveis') {
      this.patrimonio.idResponsavel = this.historicoResposanveis[0].id;
      this.patrimonio.nomeResponsavel = this.historicoResposanveis[0].nome;
    }
    if (this.historicoCusto.length > 0 && campo == 'custos') {
      this.patrimonio.idCentroCusto = this.historicoCusto[0].id;
      this.patrimonio.nomeCentroCusto = this.historicoCusto[0].nome;
    }
    if (this.historicoLocal.length > 0 && campo == 'local') {
      this.patrimonio.idLocal = this.historicoLocal[0].id;
      this.patrimonio.nomeLocal = this.historicoLocal[0].nome;
    }
    if (this.historicoCondicao.length > 0 && campo == 'condicao') {
      this.patrimonio.idCondicao = this.historicoCondicao[0].id;
      this.patrimonio.nomeCondicao = this.historicoCondicao[0].nome;
    }
    if (this.historicoDescricao.length > 0 && campo == 'descricao')
      this.patrimonio.descricao = this.descricao == undefined ? "" : this.descricao;
    this.mostraDescricao = true;
  }
  bindResultCamposFixados(resposta) {
    if (this.fixaFilial) {
      this.patrimonio.idFilial = resposta.idFilial;
      this.patrimonio.codigoFilial = resposta.CodigoFilial;
      this.patrimonio.nomeFilial = resposta.Filial;
    }
    if (this.fixEspecie) {
      this.patrimonio.idEspecie = resposta.idEspecie;
      this.patrimonio.nomeEspecie = resposta.Especie;
    }
    if (this.fixaResponsavel) {
      this.patrimonio.idResponsavel = resposta.idResponsavel;
      this.patrimonio.nomeResponsavel = resposta.Responsavel;
    }
    if (this.fixaCCusto) {
      this.patrimonio.idCentroCusto = resposta.idCentroCusto;
      this.patrimonio.nomeCentroCusto = resposta.CentroDeCusto;
    }
    if (this.fixaLocal) {
      this.patrimonio.idLocal = resposta.idLocal;
      this.patrimonio.nomeLocal = resposta.Local;
    }
    if (this.fixaCondicao) {
      this.patrimonio.idCondicao = resposta.idCondicao;
      this.patrimonio.nomeCondicao = resposta.Condicao;
    }

  }
  obtemCoordenadas() {
    return this.geo.getCurrentPosition().then(pos => {
      this.patrimonio.latitude = pos.coords.latitude.toString();
      this.patrimonio.longitude = pos.coords.longitude.toString();
      this.patrimonio.altitude = pos.coords.altitude.toString();

    }).catch(err => console.log(err));
  }

  async ficticioClick() {
    var codigoFicticioHelper: CodigoFicticioHelper = new CodigoFicticioHelper(this.codigoFicticioDao, this.session, this.patrimonioDao);

    if (this.objConfig.mascara.length > 1) {
      this.objFicticio = await codigoFicticioHelper.buscaProximoFicticio();

      if (this.objFicticio != undefined && this.objFicticio.ficticio != '0') {
        this.isFicticio = true;
        this.codigo = this.objFicticio.ficticio;
        this.incorporacao = '0';

        if (this.codigo != '') {
          var atributosDoBemHelper = new AtributosDoBemHelper(this.atributosDoBemDao);
          var inventarioHelper = new InventarioHelper(this.inventarioDao);
          var patrimonioHelper: PatrimonioHelper = new PatrimonioHelper(this.tipoDadoPatrimonioDao, this.inventarioMovimentacoesDao,
            this.patrimonioDao, this.configEqpDao, this.session,
            atributosDoBemHelper, inventarioHelper);

          this.resposta = await patrimonioHelper.selecionaPatrimonioPorFiltro(this.clienteSelecionado.banco, this.filtroPatrimonio());
          if (this.resposta != undefined) { // se encontrou um patrimonio 
            this.propriedades = await this.carregaPropriedadePorPartrimonio(this.clienteSelecionado.banco, this.resposta.id, this.resposta.idEspecie);
            var lookUpHelper: LookUpHelper = new LookUpHelper(this.lookUpDaoProvider);
            for (var i = 0; i < this.propriedades.length; i++) {
              if (this.propriedades[i].id_tipoDado === 4) {
                var lookUp = await lookUpHelper.retornaValorLookUpPorPropriedade(this.clienteSelecionado.banco, this.propriedades[i].id_propriedade);
                this.propriedades[i].lookUp = lookUp;
              }
            }
          }
        }
      } else {
        this.isFicticio = false;
      }
    } else {
      alert('Configure a mascara de entrada para utilizar códigos fictícios.\nNão é necessário ativar a mascara, basta definí-la.');
    }
  }

  private filtroPatrimonio(): string {
    var filtro = " WHERE ";

    var filtros: string[] = [];

    try {
      if (this.codigo != "")
        filtros.push(" Patrimonio.codigo = '" + this.codigo.trim() + "'");

      if (this.filialSelecionada != undefined && this.filialSelecionada != "undefined" && this.filialSelecionada.id != "0")
        filtros.push(" Patrimonio.id_Filial = " + this.filialSelecionada.id);

      if (this.incorporacao != "")
        filtros.push(" Patrimonio.incorporacao = " + this.incorporacao.trim());

      for (var i = 0; i < filtros.length; i++) {
        filtro += filtros[i];
        if (i < filtros.length - 1)
          filtro += " AND ";
      }

    } catch (ex) {
      alert(ex);
    }

    return filtro;
  }

  increment(toggle, number) {

    if (number == 1) {
      this.teste1[0].texto++;
      this.pegaPropriedade[0].texto = this.teste1[0].texto;
      this.change(this.teste1[0].texto, this.pegaPropriedade[0]);
    }
    if (number == 2) {
      this.teste1[1].texto++;
      this.pegaPropriedade[1].texto = this.teste1[1].texto;
      this.change(this.teste1[1].texto, this.pegaPropriedade[1]);
    }
    if (number == 3) {
      this.teste1[2].texto++;
      this.pegaPropriedade[2].texto = this.teste1[2].texto;
      this.change(this.teste1[2].texto, this.pegaPropriedade[2]);
    }

    this.teste = +toggle.textContent;
  }

  decrement(toggle, number) {

    if (number == 1 && this.teste1[0].texto > 0) {
      this.teste1[0].texto--;
      this.pegaPropriedade[0].texto = this.teste1[0].texto;
      this.change(this.teste1[0].texto, this.pegaPropriedade[0]);
    }
    if (number == 2 && this.teste1[1].texto > 0) {
      this.teste1[1].texto--;
      this.pegaPropriedade[1].texto = this.teste1[1].texto;
      this.change(this.teste1[1].texto, this.pegaPropriedade[1]);
    }
    if (number == 3 && this.teste1[2].texto > 0) {
      this.teste1[2].texto--;
      this.pegaPropriedade[2].texto = this.teste1[2].texto;
      this.change(this.teste1[2].texto, this.pegaPropriedade[2]);
    }

    this.teste = +toggle.textContent;
  }

  presentPopover(myEvent) {
    var enviada;
    if (!this.patrimonio.idFilial) {
      enviada = null;
    } else {
      enviada = this.patrimonio;
    }
    let popover = this.popoverCtrl.create(PopoverComponent, {
      ev: enviada
    });
    popover.present({
      ev: myEvent,
    });
  }
  voltarInicial() {
    this.navCtrl.setRoot('MenuPrincipalPage');
  }

  async validarFotos() {
    var fotosHelper: FotosDoBemHelper = new FotosDoBemHelper(this.fotosDao);
    var listaDeFotos = await fotosHelper.retornaRegistros(this.clienteSelecionado.banco, this.codigo);
    var totalFotos = listaDeFotos.length;
    if (this.objConfig.numeroFotos != 10 && totalFotos < this.objConfig.numeroFotos) {
      alert('Por favor fotografar o número de fotos configurado.');
      return false;
    }
    return true;
  }

}