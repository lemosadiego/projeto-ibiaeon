import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the BuscaPorTagPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-busca-por-tag',
  templateUrl: 'busca-por-tag.html',
})
export class BuscaPorTagPage {
  tags: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
      this.tags = this.navParams.get('tagsEncontradas');
  }
  retornaCodigo(local){
    this.navCtrl.getPrevious().data.patrimonioSelecionado = local;
    this.navCtrl.pop();
  }

}
