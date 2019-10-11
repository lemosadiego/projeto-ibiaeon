import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { EditarCondicoesPage } from '../editar-condicoes/editar-condicoes';
import { CondicaoDeUsoPage } from '../paginas-cadastro/condicao-de-uso/condicao-de-uso';

@IonicPage()
@Component({
  selector: 'page-cadastros',
  templateUrl: 'cadastros.html'
})
export class CadastrosPage{

  constructor(public navCtrl: NavController) {
  }

  goToMenuPrincipal(){
    this.navCtrl.push('MenuPrincipalPage');
  }
  goToCadastros(){
    this.navCtrl.push('CadastrosPage');
  }
  goToFiliais(){
    this.navCtrl.push('FiliaisPage');
  }
  goToLocais(){
    this.navCtrl.push('LocaisPage');
  }
  goToResponsVeis(){
    this.navCtrl.push('ResponsaveisPage');
  }
  goToCentroDeCustos(){
    this.navCtrl.push('CentroCustoPage');
  }
  goToCondicoes(){
    this.navCtrl.push('CondicaoDeUsoPage');
  }
}
