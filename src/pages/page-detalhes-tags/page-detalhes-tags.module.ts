import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PageDetalhesTagsPage } from './page-detalhes-tags';

@NgModule({
  declarations: [
    PageDetalhesTagsPage,
  ],
  imports: [
    IonicPageModule.forChild(PageDetalhesTagsPage),
  ],
})
export class PageDetalhesTagsPageModule {}
