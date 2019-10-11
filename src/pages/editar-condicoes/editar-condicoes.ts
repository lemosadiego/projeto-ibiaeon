import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Session } from '../../providers/session/session';
import { CondicaoUsoDaoProvider } from '../../providers/cadastro-dao/condicaoUso-dao/condicaoUso-dao';
import { Util } from './../../helper/Util';

/**
 * Generated class for the EditarCondicoesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-editar-condicoes',
  templateUrl: 'editar-condicoes.html',
})
export class EditarCondicoesPage {

  public condicaoSelecionada: any;
  public status: any;
  public filialAlterada:any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private _alertCtrl: AlertController,
    public condicaoDao: CondicaoUsoDaoProvider,
    public session: Session) {
    this.condicaoSelecionada = this.navParams.get('condicaoSelecionada');
  }
  get toggleStatus(){
    return this.condicaoSelecionada.status === "Ativo" ? true: false;
  }

  mudaStatus(ativado: boolean) { //acessorio é do tipo interface Acessorio, foi definido 
    // os tipos das variáveis na interface então caso seja escrito errado o nome dessas varáveis o visual code 
    //irá alertar o erro
    ativado ?
      this.condicaoSelecionada.status = "Ativo":
      this.condicaoSelecionada.status = "Inativo";

      ativado ? this.status = 1 : this.status = 0;
      console.log('status',this.status);
  }

  async salvaAlteracao() {
    console.log('fialial selecionada', this.condicaoSelecionada);
    var cliente: any = await this.session.getClienteSelecionado();
    var usuario: any = await this.session.getUsuario();
    var dtAlteracao = Util.gerarData(new Date());
    
    var result: boolean = await this.condicaoDao.editarCondicao(cliente.banco, this.filialAlterada, this.status, usuario.login, dtAlteracao, this.condicaoSelecionada.codigo);

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
    this.navCtrl.popTo('FiliaisPage', {
    });

  }

}
