import { Component } from '@angular/core';
import { Events, ToastController } from 'ionic-angular';

/**
 * Generated class for the TestComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'test',
  templateUrl: 'test.html'
})
export class TestComponent {

  text: string;

  constructor(private toast: ToastController,private events: Events) {
    this.events.subscribe('hello', name => {
      const toast = this.toast.create({
        message: `Hello`,
        duration: 3000
      });
      toast.present();
    })
  }
}
