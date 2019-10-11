import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events  } from 'ionic-angular';
import { InventarioDaoProvider } from '../../../providers/inventario-dao/inventario-dao';
import { InventarioConsultaDaoProvider } from '../../../providers/inventario-consulta-dao/inventario-consulta-dao';

@IonicPage()
@Component({
  selector: 'page-historico',
  templateUrl: 'historico.html',
})

export class HistoricoPage {
  public listaHistorico:any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events,
    public inventarioDao: InventarioDaoProvider, public inventarioConsultaDao: InventarioConsultaDaoProvider) {
  }

  async ionViewWillEnter() {
    var registroAtual: any = this.events.publish('chamaId');
    var filtered = registroAtual.filter(function(el) { return el; }); //retorna um vetor sem nenhuma posição null
    if(filtered.length == 0) {
      alert('Nenhum patrimonio selecionado')
      return
    }
    this.listaHistorico = await this.inventarioDao.buscaHistorico(filtered[0].banco, filtered[0].id);
  }

}
