import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Util } from '../../../../helper/Util';
import { AtributosDoBemHelper } from '../../../../helper/atributos-do-bem/AtributosDoBemHelper';
import { InventarioHelper } from '../../../../helper/inventario/InventarioHelper';
import { PatrimonioHelper } from '../../../../helper/patrimonio/PatrimonioHelper';
import { ConfiguracaoEquipamento } from '../../../../modelos/ConfiguracaoEquipamento';
import { TipoDadosPatrimonioDaoProvider } from '../../../../providers/tipo-dados-patrimonio-dao/tipo-dados-patrimonio-dao';
import { ConfiguracoesEquipamentoDaoProvider } from '../../../../providers/configuracoes-equipamento-dao/configuracoes-equipamento-dao';
import { Session } from '../../../../providers/session/session';
import { PatrimonioDaoProvider } from '../../../../providers/patrimonio-dao/patrimonio-dao';
import { InventarioMovimentacoesDaoProvider } from '../../../../providers/inventario-movimentacoes-dao/inventario-movimentacoes-dao';
import { AtributosDoBemDaoProvider } from '../../../../providers/atributos-do-bem-dao/atributos-do-bem-dao';
import { InventarioDaoProvider } from '../../../../providers/inventario-dao/inventario-dao';

//todo: Tela de salto corrigir CSS lista de saltos

/**
 * Generated class for the SaltoPlaquetaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-salto-plaqueta',
  templateUrl: 'salto-plaqueta.html',
})
export class SaltoPlaquetaPage {

  private objConfig;
  private clienteSelecionado;
  public teste;
  public listSaltos: string [] = [];
  public inicio;
  public fim;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public patrimonioDao: PatrimonioDaoProvider,
    public inventarioDao: InventarioDaoProvider,
    public atributosDoBemDao: AtributosDoBemDaoProvider,
    public session: Session,
    public tipoDadoPatrimonioDao: TipoDadosPatrimonioDaoProvider, 
    public inventarioMovimentacoesDao: InventarioMovimentacoesDaoProvider,
    public configEqpDao: ConfiguracoesEquipamentoDaoProvider,
    public loadingCtrl: LoadingController) { }

  async ionViewWillEnter() {
    var config: ConfiguracaoEquipamento = await this.session.getConfiguracao();
    this.objConfig = new ConfiguracaoEquipamento(config);
    this.clienteSelecionado = await this.session.getClienteSelecionado();
  }

  ionViewDidLoad() {
  }

  async saltoPlaquetaClick() {
    let loading = this.loadingCtrl.create({
      content: 'Executando salto de plaquetas...'
    });
    loading.present();
    this.listSaltos = [];
    var codigoConsulta = '';
    var salto = '';
    var inicio: number = +this.inicio;
    var fim: number = +this.fim;
    var atributosDoBemHelper = new AtributosDoBemHelper(this.atributosDoBemDao);
    var inventarioHelper = new InventarioHelper(this.inventarioDao);
    var patrimonioHelper: PatrimonioHelper = new PatrimonioHelper(this.tipoDadoPatrimonioDao, this.inventarioMovimentacoesDao, 
      this.patrimonioDao, this.configEqpDao, this.session,
      atributosDoBemHelper, inventarioHelper);

    if(inicio < fim) {
      for(var i = inicio; i <= fim; i++) {
        codigoConsulta = Util.aplicaMascara(this.objConfig.mascara, i.toString());
        var retorno = await patrimonioHelper.retornaPlaquetas(this.clienteSelecionado.banco, codigoConsulta)

        if(retorno == undefined) {
          if(salto == '') {
            salto = 'De ' + codigoConsulta;
          }
        } else {
          if(salto != '') {
            salto += ' Até ' + Util.aplicaMascara(this.objConfig.mascara, (i-1).toString());
            this.listSaltos.push(salto);
            salto = '';
          }
        }

        if(retorno == undefined && i == fim) {
          if(salto != '') {
            salto += ' Até ' + Util.aplicaMascara(this.objConfig.mascara, i.toString());
            this.listSaltos.push(salto);
            salto = '';
          }
        }
      }
      console.log('plaquetas',this.listSaltos.toString());
      
    } else {
      alert('O Numero de início precisa ser menor que o fim');
    }
    loading.dismiss();
  }

}
