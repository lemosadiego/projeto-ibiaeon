import { Util } from './../../helper/Util';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Session } from '../../providers/session/session';
import { ResponsaveisDaoProvider } from '../../providers/cadastro-dao/responsaveis-dao/responsaveis-dao';

/**
 * Generated class for the EditarResponsaveisPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-editar-responsavel',
  templateUrl: 'editar-responsavel.html',
})
export class EditarResponsaveisPage {
  public responsavelSelecionado: any;
  public status: any;
  public responsavelAlterado:any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private _alertCtrl: AlertController,
    public responsaveisDao: ResponsaveisDaoProvider,
    public session: Session) {
    this.responsavelSelecionado = this.navParams.get('responsavelSelecionado');
  }
  get toggleStatus(){
    return this.responsavelSelecionado.status === "Ativo" ? true: false;
  }

  mudaStatus(ativado: boolean) { //acessorio é do tipo interface Acessorio, foi definido 
    // os tipos das variáveis na interface então caso seja escrito errado o nome dessas varáveis o visual code 
    //irá alertar o erro
    ativado ?
      this.responsavelSelecionado.status = "Ativo":
      this.responsavelSelecionado.status = "Inativo";

      ativado ? this.status = 1 : this.status = 0;
      console.log('status',this.status);
  }

  async salvaAlteracao() {
    console.log('Responsável selecionado', this.responsavelSelecionado);
    var cliente: any = await this.session.getClienteSelecionado();
    var usuario: any = await this.session.getUsuario();
    var dtAlteracao = Util.gerarData(new Date());
    
    var result: boolean = await this.responsaveisDao.editarResponsaveis(cliente.banco, this.responsavelAlterado, this.status, usuario.login, dtAlteracao, this.responsavelSelecionado.codigo);

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
    this.navCtrl.popTo('EditarResponsaveisPage', {
    });

  }

}
