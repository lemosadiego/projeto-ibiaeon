import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuscaPatrimonioPage } from './busca-patrimonio';

@NgModule({
  declarations: [
    BuscaPatrimonioPage,
  ],
  imports: [
    IonicPageModule.forChild(BuscaPatrimonioPage),
  ],
})
export class BuscaLocalPageModule {}
