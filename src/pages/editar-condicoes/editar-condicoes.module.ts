import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditarCondicoesPage } from './editar-condicoes';

@NgModule({
  declarations: [
    EditarCondicoesPage,
  ],
  imports: [
    IonicPageModule.forChild(EditarCondicoesPage),
  ],
})
export class EditarCondicoesPageModule {}
