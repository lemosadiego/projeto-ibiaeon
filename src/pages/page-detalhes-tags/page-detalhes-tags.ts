import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PatrimoniosDaoProvider } from '../../providers/cadastro-dao/patrimonio-dao/patrimonio-dao';
import { Session } from '../../providers/session/session';

/**
 * Generated class for the PageDetalhesTagsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-page-detalhes-tags',
  templateUrl: 'page-detalhes-tags.html',
})
export class PageDetalhesTagsPage {
  public detalhesTags;
  public page;
  public local;
  public detalhesItem;
  clienteSelecionado: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public session: Session,
    public patrimoniosDao: PatrimoniosDaoProvider) {
    this.page = this.navParams.get('page');
    if (this.page == 'tagsEncontradas') {
      this.detalhesTags = this.navParams.get('tagsEncontradas');
      console.log('hshsshsh',this.detalhesTags.length);
      
      this.local = this.navParams.get('localTagsEncontradas');
    }
    else if(this.page == 'tagsNaoEncontradas'){
      this.detalhesItem = this.navParams.get('tagsNaoEncontradas');
      this.local = this.navParams.get('localTagsNaoEncontradas');
    }
  }

  async ionViewDidEnter() {
    await this.session.getClienteSelecionado().then((res) => {
      this.clienteSelecionado = res;
    })
    
  }

}
