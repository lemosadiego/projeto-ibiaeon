import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditarLocalPage } from './editar-local';

@NgModule({
  declarations: [
    EditarLocalPage,
  ],
  imports: [
    IonicPageModule.forChild(EditarLocalPage),
  ],
})
export class EditarLocalPageModule {}
