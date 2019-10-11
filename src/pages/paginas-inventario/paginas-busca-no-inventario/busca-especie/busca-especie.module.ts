import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuscaEspeciePage } from './busca-especie';

@NgModule({
  declarations: [
    BuscaEspeciePage,
  ],
  imports: [
    IonicPageModule.forChild(BuscaEspeciePage),
  ],
})
export class BuscaEspeciePageModule {}
