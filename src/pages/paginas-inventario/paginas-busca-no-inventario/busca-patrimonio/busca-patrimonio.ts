import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Session } from '../../../../providers/session/session';
import { PatrimoniosDaoProvider } from '../../../../providers/cadastro-dao/patrimonio-dao/patrimonio-dao';

/**
 * Generated class for the BuscaPatrimonioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-busca-patrimonio',
  templateUrl: 'busca-patrimonio.html',
})
export class BuscaPatrimonioPage {
  clientesRetornados: any;
  empresa: any;
  showArray: any;
  filtraNome: any[] = [];
  filtraCode: any[] = [];
  filtraStatus: any[] = [];
  public searchName: any;
  public searchCod: any;
  public searchSt: any;

  async ionViewWillEnter() {
    //this.empresa = await this.buscaPatrimonio();
    this.empresa = [
      { codigo: '10000052', nome:	'BANQUETA DE MADEIRA', status: 1}, 
      { codigo: '10000053', nome:	'BANQUETA DE MADEIRA', status: 1}, 
      { codigo: '10000054', nome:	'BANQUETA DE MADEIRA', status: 1}
       ]

    this.searchName = '';
    this.searchCod = '';
    this.searchSt = '';

    for (var i = 0; i < this.empresa.length; i++) {
      this.filtraNome.push(this.empresa[i].nome);
      this.filtraCode.push(this.empresa[i].codigo);
      this.empresa[i].status = this.empresa[i].status === 1 ? "Ativo": "Inativo";
      this.filtraStatus.push(this.empresa[i].status);
    }
    this.showArray = this.empresa;

  }

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public patrimonioDao: PatrimoniosDaoProvider, public session: Session,
    private _loadingCtrl: LoadingController) {

  }

  async buscaPatrimonio() {
    var loading = this._loadingCtrl.create({
      content: 'Carregando patrimonios...'
    });
    loading.present();
    await this.session.getClienteSelecionado().then((res) => {
      this.clientesRetornados = res;
    })
    loading.dismiss();
    return this.patrimonioDao.buscaPatrimonio(this.clientesRetornados.banco);
  }



  searchNome(): void {
    let term = this.searchName;
    let a: any;
    let b:any[] = [];
    this.showArray = this.empresa;
    a = this.filtraNome.filter((tag) => {
      tag = tag.toLowerCase();
      return tag.indexOf(term.toLowerCase()) >= 0;
    });
    for (let j = 0; j < a.length; j++){
      for (let i = 0; i < this.showArray.length; i++) {
        if (a[j] == this.showArray[i].nome) {
          b[j] = this.showArray[i];
        }
      }
    }
    
    if(term != ""){
      this.showArray = b;
    }

  }
  searchCode(): void {
    let term = this.searchCod;
    let a: any;
    let b:any[] = [];
    this.showArray = this.empresa;
    a = this.filtraCode.filter((tag) => {
      tag = tag.toLowerCase();
      return tag.indexOf(term.toLowerCase()) >= 0;
    });
    for (let j = 0; j < a.length; j++){
      for (let i = 0; i < this.showArray.length; i++) {
        if (a[j] == this.showArray[i].codigo) {
          b[j] = this.showArray[i];
        }
      }
    }
    
    if(term != ""){
      this.showArray = b;
    }

  }

  searchStatus(): void {
    let term = this.searchSt;
    let a: any;
    let b:any[] = [];
    this.showArray = this.empresa;
    a = this.searchSt.filter((tag) => {
      tag = tag;
      return tag.indexOf(term) >= 0;
    });
      for (let i = 0; i < this.showArray.length; i++) {
        if (this.showArray[i].status == a[0]) {
          b.push(this.showArray[i]);
          
        }
      }
    
    
    if(term != ""){
      this.showArray = b;
    }

  }

  selecionaPatrimonio(patrimonio){
    this.navCtrl.getPrevious().data.patrimonioSelecionado = patrimonio;
    this.navCtrl.pop();
  }
};
