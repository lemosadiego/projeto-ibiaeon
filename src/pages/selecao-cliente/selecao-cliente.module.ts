import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelecaoClientePage } from './selecao-cliente';

@NgModule({
  declarations: [
    SelecaoClientePage,
  ],
  imports: [
    IonicPageModule.forChild(SelecaoClientePage),
  ]
})
export class RfidPageModule {}
