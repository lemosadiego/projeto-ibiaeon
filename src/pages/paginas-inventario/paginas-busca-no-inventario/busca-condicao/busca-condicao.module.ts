import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuscaCondicaoPage } from './busca-condicao';

@NgModule({
  declarations: [
    BuscaCondicaoPage,
  ],
  imports: [
    IonicPageModule.forChild(BuscaCondicaoPage),
  ],
})
export class BuscaCondicaoPageModule {}
