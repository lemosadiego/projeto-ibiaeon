import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PatrimoniosDaoProvider } from '../../providers/cadastro-dao/patrimonio-dao/patrimonio-dao';
import { Session } from '../../providers/session/session';
import { ResultadoTagsPage } from '../resultado-tags/resultado-tags';

/**
 * Generated class for the PageTagsNaoEncontradasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-page-tags-nao-encontradas',
  templateUrl: 'page-tags-nao-encontradas.html',
})
export class PageTagsNaoEncontradasPage{

  items: any = [];
  itemExpandHeight: number = 500;
  itemteste: any = [];
  public clienteSelecionado: any;
  public tabelaResultante: any;
  public localParaBusca;
  local;
  public totalAusente;

  constructor(public navParams: NavParams, public navCtrl: NavController, public patrimoniosDao: PatrimoniosDaoProvider, public session: Session) {

    this.local = this.navParams.get('localTagsNaoEncontradas')
    this.tabelaResultante = this.navParams.get('tagsNaoEncontradas')
    this.totalAusente = this.navParams.get('totalAusente');
    for (let i = 0; i < this.tabelaResultante.length; i++) {
        this.tabelaResultante[i].qtde_encontrado = false;
    } 
    

  }
  async ionViewDidLoad(){
    await this.session.getClienteSelecionado().then((res) => {
      this.clienteSelecionado = res;
    })
  }
  async detalhesTags(tags) {
    var teste = await this.patrimoniosDao.detalhesEtiquetasNaoEncontradas(this.clienteSelecionado.banco, this.local.id, tags.idGrupo)
    this.navCtrl.push('PageDetalhesTagsPage', {
      tagsNaoEncontradas: teste,
      localTagsNaoEncontradas: this.local,
      page: 'tagsNaoEncontradas'
    })
  }

}