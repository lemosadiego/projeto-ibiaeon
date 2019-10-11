import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the HistoricoCamposPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-historico-campos',
  templateUrl: 'historico-campos.html',
})
export class HistoricoCamposPage {

  public itensHistorico: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.itensHistorico = this.navParams.get('itensHistorico');
  }

  selecionaHistorico(historico) {
    this.navCtrl.first().data.historicoEscolhido = historico;
    this.navCtrl.pop();

  }


}
