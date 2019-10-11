import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ResponsaveisDaoProvider } from '../../../../providers/cadastro-dao/responsaveis-dao/responsaveis-dao';
import { Session } from '../../../../providers/session/session';

/**
 * Generated class for the BuscaResponsaveisPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-busca-responsaveis',
  templateUrl: 'busca-responsaveis.html',
})
export class BuscaResponsaveisPage {
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
    this.empresa = await this.buscaFiliais();

    this.searchName = '';
    this.searchCod = '';
    this.searchSt = 'Ativo';

    for (var i = 0; i < this.empresa.length; i++) {
      this.filtraNome.push(this.empresa[i].nome);
      this.filtraCode.push(this.empresa[i].codigo);
      this.empresa[i].status = this.empresa[i].status === 1 ? "Ativo": "Inativo";
      this.filtraStatus.push(this.empresa[i].status);
    }
    this.showArray = this.empresa;

  }

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public responsavelDao: ResponsaveisDaoProvider, public session: Session) {

  }

  async buscaFiliais() {

    await this.session.getClienteSelecionado().then((res) => {
      this.clientesRetornados = res;
    })
    return this.responsavelDao.buscaResponsaveis(this.clientesRetornados.banco);
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

  selecionaResponsavel(responsavel){
    this.navCtrl.getPrevious().data.responsavelSelecionado = responsavel;
    this.navCtrl.pop();
  }
};
