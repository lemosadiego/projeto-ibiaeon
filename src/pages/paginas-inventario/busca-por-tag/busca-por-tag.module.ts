import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuscaPorTagPage } from './busca-por-tag';

@NgModule({
  declarations: [
    BuscaPorTagPage,
  ],
  imports: [
    IonicPageModule.forChild(BuscaPorTagPage),
  ],
})
export class BuscaPorTagPageModule {}
