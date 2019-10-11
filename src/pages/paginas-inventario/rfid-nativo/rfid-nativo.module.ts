import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RfidNativoPage } from './rfid-nativo';

@NgModule({
  declarations: [
    RfidNativoPage,
  ],
  imports: [
    IonicPageModule.forChild(RfidNativoPage),
  ],
})
export class RfidNativoPageModule {}
