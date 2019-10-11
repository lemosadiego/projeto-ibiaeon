import { Util } from './../../helper/Util';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Session } from '../../providers/session/session';
import { CentroCustosDaoProvider } from '../../providers/cadastro-dao/ccustos-dao/ccustos-dao';

/**
 * Generated class for the EditarCentroCustoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-editar-ccusto',
  templateUrl: 'editar-ccusto.html',
})
export class EditarCentroCustoPage {
  public centroCustoSelecionado: any;
  public status: any;
  public centroCustoAlterado:any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private _alertCtrl: AlertController,
    public centroCustoDao: CentroCustosDaoProvider,
    public session: Session) {
    this.centroCustoSelecionado = this.navParams.get('centroCustoSelecionado');
  }
  get toggleStatus(){
    return this.centroCustoSelecionado.status === "Ativo" ? true: false;
  }

  mudaStatus(ativado: boolean) { //acessorio é do tipo interface Acessorio, foi definido 
    // os tipos das variáveis na interface então caso seja escrito errado o nome dessas varáveis o visual code 
    //irá alertar o erro
    ativado ?
      this.centroCustoSelecionado.status = "Ativo":
      this.centroCustoSelecionado.status = "Inativo";

      ativado ? this.status = 1 : this.status = 0;
      console.log('status',this.status);
  }

  async salvaAlteracao() {
    console.log('Centro de Custo selecionado', this.centroCustoSelecionado);
    var cliente: any = await this.session.getClienteSelecionado();
    var usuario: any = await this.session.getUsuario();
    var dtAlteracao = Util.gerarData(new Date());
    
    var result: boolean = await this.centroCustoDao.editarCentro(cliente.banco, this.centroCustoAlterado, this.status, usuario.login, dtAlteracao, this.centroCustoSelecionado.codigo);

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
    this.navCtrl.popTo('EditarCentroCustoPage', {
    });

  }

}
