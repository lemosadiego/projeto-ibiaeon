import { Util } from './../../helper/Util';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, IonicPage } from 'ionic-angular';
import { Session } from '../../providers/session/session';
import { FilialDaoProvider } from '../../providers/cadastro-dao/filial-dao/filial-dao';

@IonicPage()
@Component({
  selector: 'page-editar-filial',
  templateUrl: 'editar-filial.html'
})
export class EditarFilialPage {

  public filialSelecionada: any;
  public status: any;
  public filialAlterada:any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private _alertCtrl: AlertController,
    public filialDao: FilialDaoProvider,
    public session: Session) {
    this.filialSelecionada = this.navParams.get('filialSelecionada');
  }
  get toggleStatus(){
    return this.filialSelecionada.status === "Ativo" ? true: false;
  }

  mudaStatus(ativado: boolean) { //acessorio é do tipo interface Acessorio, foi definido 
    // os tipos das variáveis na interface então caso seja escrito errado o nome dessas varáveis o visual code 
    //irá alertar o erro
    ativado ?
      this.filialSelecionada.status = "Ativo":
      this.filialSelecionada.status = "Inativo";

      ativado ? this.status = 1 : this.status = 0;
      console.log('status',this.status);
  }

  async salvaAlteracao() {
    console.log('fialial selecionada', this.filialSelecionada);
    var cliente: any = await this.session.getClienteSelecionado();
    var usuario: any = await this.session.getUsuario();
    var dtAlteracao = Util.gerarData(new Date());
    
    var result: boolean = await this.filialDao.editarFilial(cliente.banco, this.filialAlterada, this.status, usuario.login, dtAlteracao, this.filialSelecionada.codigo);

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
