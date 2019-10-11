import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuscaLocalPage } from './busca-local';

@NgModule({
  declarations: [
    BuscaLocalPage,
  ],
  imports: [
    IonicPageModule.forChild(BuscaLocalPage),
  ],
})
export class BuscaLocalPageModule {}
