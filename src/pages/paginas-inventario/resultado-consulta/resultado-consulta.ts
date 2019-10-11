import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, Events, Platform } from 'ionic-angular';

/**
 * Generated class for the ResultadoConsultaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-resultado-consulta',
  templateUrl: 'resultado-consulta.html',
})
export class ResultadoConsultaPage {
  public resultadosConsulta
  public estaAgrupado: boolean
  public grupo: string

  constructor(public navCtrl: NavController, public app: App,public navParams: NavParams,public platform: Platform,
     public events: Events,public appCtrl: App) {
  }

  ionViewWillEnter(){
    this.events.publish('data:created1', true);
    this.resultadosConsulta = this.navParams.get('resultadosConsulta')
    this.estaAgrupado = this.navParams.get('estaAgrupado')
    this.grupo = this.navParams.get('grupo')
  }


  consultaEscolhida(consulta){
    // this.navCtrl.setRoot('InventarioPage',{
    //   consultaEscolhida:consulta
    // });
    this.app.getActiveNavs()[0].parent.select(0);
    this.events.publish('data:created', consulta);
  }

}
