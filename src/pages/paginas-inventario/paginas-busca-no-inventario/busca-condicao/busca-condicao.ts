import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Session } from '../../../../providers/session/session';
import { CondicaoUsoDaoProvider } from '../../../../providers/cadastro-dao/condicaoUso-dao/condicaoUso-dao';

/**
 * Generated class for the BuscaCondicaoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-busca-condicao',
  templateUrl: 'busca-condicao.html',
})
export class BuscaCondicaoPage {
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
    this.searchSt = '';

    for (var i = 0; i < this.empresa.length; i++) {
      this.filtraNome.push(this.empresa[i].nome);
      this.filtraCode.push(this.empresa[i].codigo);
      this.empresa[i].status = this.empresa[i].status === 1 ? "Ativo": "Inativo";
      this.filtraStatus.push(this.empresa[i].status);
    }
    this.showArray = this.empresa;

  }

  constructor(public navCtrl: NavController, 
    public condicaoDao: CondicaoUsoDaoProvider,  public navParams: NavParams,
    public session: Session) {

  }

  async buscaFiliais() {

    await this.session.getClienteSelecionado().then((res) => {
      this.clientesRetornados = res;
    })
    return this.condicaoDao.buscaCondicao(this.clientesRetornados.banco);
  }


  searchNome(): void {
    let term = this.searchName;
    let a: any;
    let b: any[] = [];
    this.showArray = this.empresa;
    a = this.filtraNome.filter((tag) => {
      tag = tag.toLowerCase();
      return tag.indexOf(term.toLowerCase()) >= 0;
    });
    for (let j = 0; j < a.length; j++) {
      for (let i = 0; i < this.showArray.length; i++) {
        if (a[j] == this.showArray[i].nome) {
          b[j] = this.showArray[i];
        }
      }
    }

    if (term != "") {
      this.showArray = b;
    }

  }
  searchCode(): void {
    let term = this.searchCod;
    let a: any;
    let b: any[] = [];
    this.showArray = this.empresa;
    a = this.filtraCode.filter((tag) => {
      tag = tag;
      return tag.indexOf(term.toLowerCase()) >= 0;
    });
    for (let j = 0; j < a.length; j++) {
      for (let i = 0; i < this.showArray.length; i++) {
        if (a[j] == this.showArray[i].codigo) {
          b[j] = this.showArray[i];
        }
      }
    }
    console.log(this.empresa);
    
    if (term != "") {
      this.showArray = b;
    }

  }

  searchStatus(): void {
    let term = this.searchSt;
    let a: any;
    let b: any[] = [];
    this.showArray = this.empresa;
    a = this.filtraStatus.filter((tag) => {
      tag = tag;
      return tag.indexOf(term) >= 0;
    });
    for (let i = 0; i < this.showArray.length; i++) {
      if (this.showArray[i].status == a[0]) {
        b.push(this.showArray[i]);

      }
    }

    if (term != "") {
      this.showArray = b;
    }
  }

  selecionaCondicao(condicao) {
    this.navCtrl.getPrevious().data.codicaoSelecionada = condicao;
    this.navCtrl.pop();
  }
};
