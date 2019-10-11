import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FotosPage } from './fotos';

@NgModule({
  declarations: [
    FotosPage,
  ],
  imports: [
    IonicPageModule.forChild(FotosPage),
  ],
})
export class FotosPageModule {}
