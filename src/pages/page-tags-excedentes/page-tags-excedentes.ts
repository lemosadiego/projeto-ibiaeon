import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PageTagsExcedentesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-page-tags-excedentes',
  templateUrl: 'page-tags-excedentes.html'
})

export class PageTagsExcedentesPage {
  public tagsExcedentes;
  public local;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.tagsExcedentes = this.navParams.get('tagsExcedentes');
    this.local = this.navParams.get('localTagsExcedentes')
  }

  detalhesTags() {
    this.navCtrl.push('PageDetalhesTagsPage', {
      detalhesTags: this.detalhesTags
    })
  }
}