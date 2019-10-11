import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Session } from '../../../../providers/session/session';
import { GrupoDaoProvider } from '../../../../providers/cadastro-dao/grupo-dao/grupo-dao';

/**
 * Generated class for the EspeciePage page.
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-busca-grupo',
  templateUrl: 'busca-grupo.html',
})
export class BuscaGrupoPage {
  clientesRetornados: any;
  empresa: any;
  showArray: any[] = [];
  filtraNome: any[] = [];
  filtraCode: any[] = [];
  filtraStatus: any[] = [];
  public searchName: any;
  public searchCod: any;
  public searchSt: any;
  page = 1;
  perPage = 0;
  totalData = 0;
  totalPage = 0;

  async ionViewWillEnter() {
    this.empresa = await this.buscaGrupo();

    this.searchName = '';
    this.searchCod = '';
    this.searchSt = '';

    for (var i = 0; i < this.empresa.length; i++) {
      this.filtraNome.push(this.empresa[i].nome);
      this.filtraCode.push(this.empresa[i].codigo);
      this.empresa[i].status = this.empresa[i].status === 1 ? "Ativo" : "Inativo";
      this.filtraStatus.push(this.empresa[i].status);
    }

  }

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public grupoDao: GrupoDaoProvider, public session: Session,
    private _loadingCtrl: LoadingController) {
    this.getTopStories();
  }

  async buscaGrupo() {

    await this.session.getClienteSelecionado().then((res) => {
      this.clientesRetornados = res;
    })
    return this.grupoDao.buscaGrupo(this.clientesRetornados.banco);
  }
  async getTopStories() {

    this.empresa = await this.buscaGrupo();
    for (let i = 0; i <= 100; i++) {

      this.showArray.push(this.empresa[i]);
    }

    this.perPage = 100;
    this.totalData = this.empresa.length;
    this.totalPage = 100;
  }

  doInfinite(infiniteScroll) {
    this.totalPage = this.page * 100;
    let result = this.empresa.slice(this.page * 100);

    for (let i = 1; i <= this.perPage; i++) {
      if (result[i] != undefined) {

        this.showArray.push(this.empresa[i]);
      }
    }

    this.page += 1;

    infiniteScroll.complete();
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

  selecionaGrupo(grupo) {

    this.navCtrl.push('BuscaEspeciePage', {
      idGrupo: grupo
    });
  }
};
