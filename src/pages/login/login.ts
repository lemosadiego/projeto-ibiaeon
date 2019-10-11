import { SDES } from './../../helper/SDES';
import { Clientes } from './../../modelos/Clientes';
import { ClienteDaoProvider } from './../../providers/cliente-dao/cliente-dao';
import { SyncServerToClientProvider } from './../../providers/sync-server-to-client/sync-server-to-client';
import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, Events, Platform } from 'ionic-angular';
import { UsuarioDaoProvider } from '../../providers/usuario-dao/usuario-dao';
import { Session } from '../../providers/session/session';
import { Usuario } from '../../modelos/Usuario';
import { ConfiguracaoEquipamento } from '../../modelos/ConfiguracaoEquipamento';
import * as AppConstants from '../../app/app-constantes';
import * as ConstantsConfig from '../../providers/database/sqlDbConfig';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {

  public valida: boolean = true;
  public login: string;
  public senha: string;
  public nomeBranco: boolean = true;
  usuario: Usuario;
  clientes: Clientes;
  config: ConfiguracaoEquipamento;
  showedAlert: boolean;

  constructor(public session: Session, public navCtrl: NavController,
    public sync: SyncServerToClientProvider, public usuarioDao: UsuarioDaoProvider,
    public clienteDao: ClienteDaoProvider,
    public statusSync: SyncServerToClientProvider,
    public alertIp: AlertController,
    public event: Events,
    public platform: Platform,
    public alertCtrl: AlertController,
    public syncClient: SyncServerToClientProvider,
    public alert: AlertController) {
    this.event.subscribe('mudarIp', () => {
      this.presentAlertConfirm();
    });
    platform.registerBackButtonAction(() => {
      if(navCtrl.getActive().name == 'LoginPage' || navCtrl.getActive().name == 'MenuPrincipalPage'){
        if(!this.showedAlert)
        this.confirmExitApp();
      }else{
        console.log(navCtrl.getActive().name);
        navCtrl.pop();
      }
    });
   
  }
  confirmExitApp() {
    this.showedAlert = true;
    var alert = this.alertCtrl.create({
      title: "Fechar a aplicação?",
      message: "Tem certeza que quer sair da aplicação?",
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            this.showedAlert = false;
            alert.dismiss();
          }
        },
        {
          text: 'Sair',
          handler: () => {
            this.platform.exitApp();
          }
        }
      ]
    });
    alert.present();
  }
  


  async ionViewWillEnter() {
    if(localStorage.getItem('id') != 'undefined'){
      this.login = localStorage.getItem('id');
    }
     //nav lifecyclesconm
    /*LÓGICA VERIFICADOR DE IMEI
    if(this.device.uuid == '391a325a81ace6aa'){
      
      this.alert.create({
        title: 'Aparelho não cadastrado',
        subTitle: 'Não é possível utilizar a aplicação pois o aparelho não está cadastrado, procuro o'+
        'responsável! A aplicação será fechada.',
        buttons: [
          {
            text: 'OK',
            handler: () => {
              this.platform.exitApp();
            }
          }
        ],
        enableBackdropDismiss: false,
      }).present();

    }*/
    if (!this.statusSync.flagIp) {
      await this.sync.iniciarConfig();
    }

  }

  criaSessionUsuario(dado: any) {
    this.usuario = new Usuario(dado);
    //disparando a sessão
    this.session.createUsuario(this.usuario);
  }

  presentAlertConfirm() {
    const alertIp = this.alertIp.create({
      title: 'Digite o ip que será utilizado',
      inputs: [
        {
          name: 'name1',
          type: 'text',
          placeholder: 'Digite aqui o ip'
        },
      ],
      buttons: [
        {
          text: 'Confirmar',
          handler: () => {
            if (alertIp.data.inputs[0].value == "") {
              alertIp.setMessage('endereço ip inválido')
              return false;
            } else {
              this.sync.ipAtual(alertIp.data.inputs[0].value);
              this.sync.iniciarConfig();
            }
          }
        }
      ],
      cssClass: 'my-class',
      enableBackdropDismiss: false
    });
    alertIp.present()
  }
  async updateConfig() {
    await this.syncClient.syncConfigInside(AppConstants.dbConfigServer, ConstantsConfig.tabelas, true);
  }

  criaSessionClientes(dado: any) {
    this.clientes = new Clientes(dado);
    this.session.createClientes(this.clientes);
  }

  async goToSincronizaO(params) {
   localStorage.setItem('id', this.login);
    var usuarioRes: any = await this.usuarioDao.buscaUsuario(this.login);

    if (usuarioRes != undefined) {
      this.criaSessionUsuario(usuarioRes);

      var clientesRes = await this.clienteDao.buscaCliente(usuarioRes.id);
      this.criaSessionClientes(clientesRes);
      var sdes = new SDES();
      sdes.mensagem = usuarioRes.senha;
      sdes.Decrypt();

      if (this.senha === sdes.mensagem) {
        if (!params) params = {};
        this.navCtrl.setRoot('SelecaoClientePage');
      } else {
        this.valida = false;
        this.nomeBranco = true;
      }
      if (this.senha == undefined || this.senha == "") {
        this.valida = true;
        this.nomeBranco = false;
      }
    } else {
      if (this.login == undefined || this.login == "") {
        this.valida = true;
        this.nomeBranco = false;
      } else if (this.login != undefined) {
        this.valida = false;
        this.nomeBranco = true;
      }
    }
  }
}
