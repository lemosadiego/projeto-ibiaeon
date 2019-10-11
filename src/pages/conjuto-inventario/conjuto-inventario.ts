import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-conjuto-inventario',
  templateUrl: 'conjuto-inventario.html',
})
export class ConjutoInventarioPage {
  teste:any;
  tab1Root = 'InventarioPage';
  tab2Root = 'FotosPage';
  tab3Root = 'HistoricoPage';
  tab4Root = (this.teste) ? 'ResultadoConsultaPage':'ConsultaPage';
           
  constructor(public navCtrl: NavController, public navParams: NavParams, public events:Events) {
    events.subscribe('data:created1', async (data) => {
      this.teste = data;
    });
  }

  ionViewDidLeave(){
    console.log('EXECUTOU O CONJUNTO');
    
    this.events.publish('didLeave');
  }

}
