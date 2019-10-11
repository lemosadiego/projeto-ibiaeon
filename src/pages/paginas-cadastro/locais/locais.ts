import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LocaisDaoProvider } from '../../../providers/cadastro-dao/locais-dao/locais-dao';
import { Session } from '../../../providers/session/session';

@IonicPage()
@Component({
  selector: 'page-locais',
  templateUrl: 'locais.html'
})
export class LocaisPage {

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
  public b: any[] = [];
  filtroAtivado: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public locaisDao: LocaisDaoProvider,
    public session: Session) {
    this.getTopStories();
  }


  async buscaLocais() {

    await this.session.getClienteSelecionado().then((res) => {
      this.clientesRetornados = res;
    })
    return this.locaisDao.buscaLocais(this.clientesRetornados.banco);

  }
  async getTopStories() {
    var porPage = 100;
    this.empresa = await this.buscaLocais();

    this.searchName = '';
    this.searchCod = '';
    this.searchSt = 'Ativo';

    for (var i = 0; i < this.empresa.length; i++) {
      this.filtraNome.push(this.empresa[i].nome);
      this.filtraCode.push(this.empresa[i].codigo);
      this.empresa[i].status = this.empresa[i].status === 1 ? "Ativo" : "Inativo";
      this.filtraStatus.push(this.empresa[i].status);
    }
    if(this.empresa.length < 100){
      porPage = this.empresa.length-1;
    }else{
      porPage = 100;
    }

    for (let i = 0; i <= porPage; i++) {

      this.showArray.push(this.empresa[i]);
    }

    this.perPage = 100;
    this.totalData = this.empresa.length;
    this.totalPage = 100;
  }

  doInfinite(infiniteScroll) {
    this.totalPage = this.page * 100;
    let result = this.empresa.slice(this.page * 100);

    if (!this.filtroAtivado) {
      for (let i = 1; i <= this.perPage; i++) {
        if (result[i] != undefined) {

          this.showArray.push(this.empresa[i]);
        }
      }
    }
    if (this.filtroAtivado) {
      if(this.b.length > 100)
      for (let i = 1; i <= this.perPage; i++) {
        if (result[i] != undefined) {

          this.showArray.push(this.b[i]);
        }
      }
    }

    this.page += 1;

    infiniteScroll.complete();
  }


  searchNome(): void {
    let term = this.searchName;
    var max = 100;
    this.b = [];
    this.showArray = this.empresa;
    this.b = this.empresa.filter((tag) => {
      tag = tag.nome.toLowerCase();
      return tag.indexOf(term.toLowerCase()) >= 0;
    });

    if (term != "") {
      this.showArray = [];
      this.filtroAtivado = true;
      if(this.b.length < 101){
        max = this.b.length;
      }
      for (let i = 0; i < max; i++) {
        this.showArray.push(this.b[i]);
      }
    } else {
      this.showArray = [];
      this.filtroAtivado = false;
      for (let i = 0; i <= 100; i++) {
        this.showArray.push(this.empresa[i]);
      }
    }

  }
  searchCode(): void {
    let term = this.searchCod;
    var max = 100;
    this.b = [];
    this.showArray = this.empresa;
    this.b = this.empresa.filter((tag) => {
      tag = tag.codigo.toLowerCase();
      return tag.indexOf(term.toLowerCase()) >= 0;
    });

    if (term != "") {
      this.showArray = [];
      this.filtroAtivado = true;
      if(this.b.length < 101){
        max = this.b.length;
      }
      for (let i = 0; i < max; i++) {
        this.showArray.push(this.b[i]);
      }
    } else {
      this.showArray = [];
      this.filtroAtivado = false;
      for (let i = 0; i <= 100; i++) {
        this.showArray.push(this.empresa[i]);
      }
    }

  }

  searchStatus(): void {
    let term = this.searchSt;
    if (term == "Inativo") {
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
    } else {
      this.getTopStories();
    }
  }

  selecionaLocal(local) {
    this.navCtrl.push('EditarLocalPage', {
      localSelecionado: local
    });
  }
};
