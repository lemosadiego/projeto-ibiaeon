import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LocalLeituraRfidPage } from './local-leitura-rfid';

@NgModule({
  declarations: [
    LocalLeituraRfidPage,
  ],
  imports: [
    IonicPageModule.forChild(LocalLeituraRfidPage),
  ],
})
export class LocalLeituraRfidPageModule {}
