import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Session } from '../../../../providers/session/session';
import * as $ from "jquery";
/**
 * Generated class for the CodigosFicticiosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-codigos-ficticios',
  templateUrl: 'codigos-ficticios.html',
})
export class CodigosFicticiosPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public session: Session) {
  }
  async ngOnInit() { 

    var usuario = await this.session.getUsuario();
    var cliente = await this.session.getClienteSelecionado();
    $('#codigo-ficticio-cliente').html('Usuário: '+usuario.nome);
    $('#codigo-ficticio-usuario').html('Cliente: '+cliente.nome);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CodigosFicticiosPage');
  }

}
