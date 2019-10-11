import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, AlertController, ViewController, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { Session } from '../providers/session/session';
import { InventarioPage } from '../pages/paginas-inventario/inventario/inventario';
import { ConfiguracoesPage } from '../pages/configuracoes/configuracoes';
import { ConsultaPage } from '../pages/paginas-inventario/consulta/consulta';
import { TestaImplementacoesPage } from '../pages/testa-implementacoes/testa-implementacoes';

@Component({
  selector: 'myapp',
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) public navCtrl: Nav;
  rootPage: any = TestaImplementacoesPage;

  public usuario: any;
  public cliente: any;
  
  constructor(public platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public session: Session) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      
    });

  }
  
  goToMenuPrincipal() {
    this.navCtrl.setRoot('MenuPrincipalPage');
  }
  goToPerfil() {
    this.navCtrl.push('PerfilPage');
  }
  goToSelecao() {
    this.navCtrl.push('SelecaoClientePage');
  }
  goToLogin() {
    this.navCtrl.setRoot('LoginPage');
  }

  get statusSwipe() {
    return this.session.isMenuPrincipal;
  }
}