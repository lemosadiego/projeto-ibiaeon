import { Component } from '@angular/core';
import { ViewController, NavController, NavParams, Events } from 'ionic-angular';
import { ReplicacaoPage } from '../../pages/paginas-inventario/paginas-popoverMenu/replicacao/replicacao';
import { CodigosFicticiosPage } from '../../pages/paginas-inventario/paginas-popoverMenu/codigos-ficticios/codigos-ficticios';
import { SaltoPlaquetaPage } from '../../pages/paginas-inventario/paginas-popoverMenu/salto-plaqueta/salto-plaqueta';

@Component({
  selector: 'popover',
  //templateUrl: 'popover.html',
  template: `
  <ion-list>
    <button ion-item (click)="replicacao()">REPLICAR</button>
    <button ion-item (click)="codigosFicticio()">EDITAR FICTÍCIOS</button>
    <button ion-item (click)="saltoPlaqueta()">SALTO DE PLAQUETA</button>
    <button ion-item (click)="baixar()">BAIXAR</button>
    <button ion-item (click)="desfazerBaixa()">DESFAZER BAIXA</button>
  </ion-list>
`
})
export class PopoverComponent {

  mandateste: string;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public viewCtrl: ViewController,
    private events: Events) {
  }

  public ionViewWillEnter() {
    this.mandateste = this.navParams.get('ev');
  }
  close() {
    this.viewCtrl.dismiss();
  }
  replicacao() {
    if(this.mandateste == null){
      alert('filial não pode estar em branco')
    } else {
      this.navCtrl.push('ReplicacaoPage',{
        mandateste: this.mandateste
      });
    }
  }
  codigosFicticio() {
    this.navCtrl.push('CodigosFicticiosPage');
  }
  saltoPlaqueta() {
    this.navCtrl.push('SaltoPlaquetaPage');
  }
  baixar() {
    if(this.mandateste == null){
      alert('Patrimonio não selecionado')
    } else {
      this.events.publish('baixar');
    }
  }
  desfazerBaixa() {
    if(this.mandateste == null){
      alert('Patrimonio não selecionado')
    } else {
      this.events.publish('desfazbaixa');
    }
  }

}
