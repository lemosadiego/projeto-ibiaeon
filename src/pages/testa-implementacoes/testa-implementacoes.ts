import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform } from 'ionic-angular';

declare var PluginAutoid9U;


@IonicPage()
@Component({
  selector: 'page-testa-implementacoes',
  templateUrl: 'testa-implementacoes.html',
})
export class TestaImplementacoesPage {

  constructor(public navCtrl: NavController) {}

  ionViewDidEnter() {
    PluginAutoid9U.initialise(function(data) {
      console.log('initialise ',data)
    })
  }


}