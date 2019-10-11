import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RfidPage } from './rfid';

@NgModule({
  declarations: [
    RfidPage,
  ],
  imports: [
    IonicPageModule.forChild(RfidPage),
  ]
})
export class RfidPageModule {}
