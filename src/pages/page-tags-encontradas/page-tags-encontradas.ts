import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PageTagsEncontradasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-page-tags-encontradas',
  templateUrl: 'page-tags-encontradas.html',
})
export class PageTagsEncontradasPage {
  public tagsEncontradas;
  public local;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.tagsEncontradas = this.navParams.get('tagsEncontradas');
    this.local = navParams.get('localTagsEncontradas');
    console.log('local',this.local);
  }

  detalhesTags(tags) {
    this.navCtrl.push('PageDetalhesTagsPage', {
      tagsEncontradas: tags,
      localTagsEncontradas: this.local,
      page: 'tagsEncontradas'
    })
  }
}
