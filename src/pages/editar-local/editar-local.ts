import { Util } from './../../helper/Util';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Session } from '../../providers/session/session';
import { LocaisDaoProvider } from '../../providers/cadastro-dao/locais-dao/locais-dao';

/**
 * Generated class for the EditarLocalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-editar-local',
  templateUrl: 'editar-local.html',
})
export class EditarLocalPage {
  public localSelecionado: any;
  public status: any;
  public localAlterado:any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private _alertCtrl: AlertController,
    public localDao: LocaisDaoProvider,
    public session: Session) {
    this.localSelecionado = this.navParams.get('localSelecionado');
  }
  get toggleStatus(){
    return this.localSelecionado.status === "Ativo" ? true: false;
  }

  mudaStatus(ativado: boolean) { //acessorio é do tipo interface Acessorio, foi definido 
    // os tipos das variáveis na interface então caso seja escrito errado o nome dessas varáveis o visual code 
    //irá alertar o erro
    ativado ?
      this.localSelecionado.status = "Ativo":
      this.localSelecionado.status = "Inativo";

      ativado ? this.status = 1 : this.status = 0;
      console.log('status',this.status);
  }

  async salvaAlteracao() {
    console.log('fialial selecionada', this.localSelecionado);
    var cliente: any = await this.session.getClienteSelecionado();
    var usuario: any = await this.session.getUsuario();
    var dtAlteracao = Util.gerarData(new Date());
    
    var result: boolean = await this.localDao.editarLocal(cliente.banco, this.localAlterado, this.status, usuario.login, dtAlteracao, this.localSelecionado.codigo);

    if(result) {
      this.alerta('Alterações realizadas com sucesso');
    } else {
      this.alerta('Falha na alteração');
    }

  }

  alerta(mensagem: string) {
    this._alertCtrl.create({
      title: mensagem,
      buttons: [
        { text: 'ok' }
      ]
    }).present();
    this.navCtrl.popTo('LocaisPage', {
    });

  }

}
