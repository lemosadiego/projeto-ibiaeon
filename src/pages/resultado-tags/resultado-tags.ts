import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PatrimoniosDaoProvider } from '../../providers/cadastro-dao/patrimonio-dao/patrimonio-dao';
import { Session } from '../../providers/session/session';

/**
 * Generated class for the ResultadoTagsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-resultado-tags',
  templateUrl: 'resultado-tags.html',
})
export class ResultadoTagsPage {
  detalhesItemSelecionado;
  public detalhesItem;
  local: any;
  clienteSelecionado: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public session: Session,
    public patrimoniosDao: PatrimoniosDaoProvider) {
    this.detalhesItemSelecionado = this.navParams.get('itemSelecionado');
    this.local = this.navParams.get('local')

  }

  async ionViewDidEnter() {
    await this.session.getClienteSelecionado().then((res) => {
      this.clienteSelecionado = res;
    })
    this.detalhesItem = await this.patrimoniosDao.detalhesEtiquetasNaoEncontradas(this.clienteSelecionado.banco, this.local.id, this.detalhesItemSelecionado.idGrupo)
  console.log('shaushau',this.detalhesItem);
  
  }

}
