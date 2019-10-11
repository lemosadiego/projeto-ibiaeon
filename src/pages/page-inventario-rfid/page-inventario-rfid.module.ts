import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PageInventarioRfidPage } from './page-inventario-rfid';

@NgModule({
  declarations: [
    PageInventarioRfidPage,
  ],
  imports: [
    IonicPageModule.forChild(PageInventarioRfidPage),
  ],
})
export class PageInventarioRfidPageModule {}
