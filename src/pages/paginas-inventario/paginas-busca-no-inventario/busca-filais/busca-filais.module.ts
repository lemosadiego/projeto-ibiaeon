import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuscaFilaisPage } from './busca-filais';

@NgModule({
  declarations: [
    BuscaFilaisPage,
  ],
  imports: [
    IonicPageModule.forChild(BuscaFilaisPage),
  ],
})
export class BuscaFilaisPageModule {}
