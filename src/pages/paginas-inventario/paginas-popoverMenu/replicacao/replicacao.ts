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
import { Patrimonio } from '../../../../modelos/Patrimonio';
import { AtributoDoBem } from '../../../../modelos/AtributoDoBem';


@IonicPage()
@Component({
  selector: 'page-replicacao',
  templateUrl: 'replicacao.html',
})
export class ReplicacaoPage {

  public quantidadeReplicar = 1;
  public codigoInicial;
  public codigoFinal;
  public text;
  public filialSelecionada: any;
  private objConfig: ConfiguracaoEquipamento;
  private clienteSelecionado;
  private usuario;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public patrimonioDao: PatrimonioDaoProvider,
    public inventarioDao: InventarioDaoProvider,
    public atributosDoBemDao: AtributosDoBemDaoProvider,
    public session: Session,
    public tipoDadoPatrimonioDao: TipoDadosPatrimonioDaoProvider, 
    public inventarioMovimentacoesDao: InventarioMovimentacoesDaoProvider,
    public configEqpDao: ConfiguracoesEquipamentoDaoProvider,
    public loadingCtrl: LoadingController) {
  }
  public ionViewWillEnter() {
    this.filialSelecionada = this.navParams.get('filialSelecionada');
    
    this.text = this.navParams.get('mandateste');
  }
  async ionViewDidLoad() {
    var config: ConfiguracaoEquipamento = await this.session.getConfiguracao();
    this.objConfig = new ConfiguracaoEquipamento(config);
    this.clienteSelecionado = await this.session.getClienteSelecionado();
    this.usuario = await this.session.getUsuario();
    this.codigoInicial = +this.text.codigo + 1;
    this.codigoFinal = this.codigoInicial;
  }

  increment() {
    this.quantidadeReplicar++;
    this.codigoFinal++;
  }

  decrement() {
    if (this.quantidadeReplicar > 1) {
      this.quantidadeReplicar--;
      this.codigoFinal--;
    }
  }

  listener() {
    this.quantidadeReplicar = 1;
    this.codigoFinal = this.codigoInicial;
  }

  buscarFilial() {
    this.navCtrl.push('BuscaFilaisPage');
  }

  onKey() {
    if (this.codigoInicial.toString().length > this.objConfig.mascara.length) {
      if (this.codigoInicial.toString().charAt(this.objConfig.mascara.length) != 'F')
        this.codigoInicial = +this.codigoInicial.toString().substr(0, this.objConfig.mascara.length);
        this.codigoFinal = this.codigoInicial
    }
  }

  async replicarClick() {
    let loading = this.loadingCtrl.create({
      content: 'Replicando patrimonio...'
    });
    loading.present();
    var codigoInicial: string = this.codigoInicial.toString();
    var codigoFinal: string = this.codigoFinal.toString();
    if(this.validaEntrada(this.quantidadeReplicar, codigoInicial)) {
      await this.replicarPlaqueta(+codigoInicial, +codigoFinal);
    }
    loading.dismiss();
  }

  validaEntrada(quantidadeReplicar: number, codigoInicial: string): boolean {
    var result: boolean = true;
    result = result && this.text.codigo != '';
    if(!result) {
      alert('Informe o bem a replicar.');
    } else {
      result = result && codigoInicial != '';
      if(!result) {
        var i = +codigoInicial;
        i++;
        codigoInicial = Util.aplicaMascara(this.objConfig.mascara, i.toString());
        result = true;
      }
      result = result && quantidadeReplicar > 0;
      if(!result) {
        alert('A quantidade deve ser maior que zero.');
      }
    }
    return result;
  }

  async replicarPlaqueta(codigoInicial: number, codigoFinal: number) {
    var naoInseridos: any [] = [];
    var atributosDoBemHelper = new AtributosDoBemHelper(this.atributosDoBemDao);
    var inventarioHelper = new InventarioHelper(this.inventarioDao);
    var patrimonioHelper: PatrimonioHelper = new PatrimonioHelper(this.tipoDadoPatrimonioDao, this.inventarioMovimentacoesDao, 
      this.patrimonioDao, this.configEqpDao, this.session,
      atributosDoBemHelper, inventarioHelper);

    var retorno = await patrimonioHelper.retornaTotalBensNoIntervalo(this.clienteSelecionado.banco, this.text.idFilial, +this.text.incorporacao, codigoInicial, codigoFinal, this.objConfig.mascara)

    if(retorno) {
      alert('Um ou mais números resultantes da replicação conflitam com os números já cadastrados.\nA replicação não poderá ser executada com esses parâmetros.');
      return;
    }

    for(var i = codigoInicial; i <= codigoFinal; i++) {
      var codigo = Util.aplicaMascara(this.objConfig.mascara, i.toString());
      
      var patrimonio: Patrimonio = this.preencherObjetoPatrimonio();
      patrimonio.codigo = codigo;
      var atriutosDoBem: AtributoDoBem[] = await this.preencherPropriedades(patrimonio);
      try {
        await patrimonioHelper.inserirRegistro(this.clienteSelecionado.banco, atriutosDoBem, patrimonio);
      } catch(e) {
        naoInseridos.push(codigo);
      }
    }
    if(naoInseridos.length > 0)
      alert('Atencao codigos nao inseridos: \n' + naoInseridos.toString())
    else
      alert('Replicacao concluida com sucesso!');
  }

  private preencherObjetoPatrimonio(): Patrimonio {
    var patrimonio: Patrimonio = new Patrimonio();
    patrimonio.id = this.text.id;
    patrimonio.altitude = this.text.altitude;
    patrimonio.aux1 = this.text.aux1;
    patrimonio.aux2 = this.text.aux2;
    patrimonio.aux3 = this.text.aux3;
    patrimonio.aux4 = this.text.aux4;
    patrimonio.aux5 = this.text.aux5;
    patrimonio.aux6 = this.text.aux6;
    patrimonio.aux7 = this.text.aux7;
    patrimonio.aux8 = this.text.aux8;
    patrimonio.codigo = this.text.codigo;
    patrimonio.codigoAnterior = this.text.codigoAnterior;
    patrimonio.descricao = this.text.descricao;
    patrimonio.gravado = this.text.gravado;
    patrimonio.idCentroCusto = this.text.idCentroCusto;
    patrimonio.idCondicao = this.text.idCondicao;
    patrimonio.idEspecie = this.text.idEspecie;
    patrimonio.idFilial = this.text.idFilial;
    patrimonio.idLocal = this.text.idLocal;
    patrimonio.idResponsavel = this.text.idResponsavel;
    patrimonio.id_linkEspecieMarca = this.text.id_linkEspecieMarca;
    patrimonio.id_linkEspecieMarcaModelo = this.text.id_linkEspecieMarcaModelo;
    patrimonio.incorporacao = this.text.incorporacao;
    patrimonio.incorporacaoAnterior = this.text.incorporacaoAnterior;
    patrimonio.latitude = this.text.latitude;
    patrimonio.longitude = this.text.longitude;
    patrimonio.marca = this.text.marca;
    patrimonio.modelo = this.text.modelo;
    patrimonio.serie = this.text.serie;
    patrimonio.seq = this.text.seq;
    patrimonio.observacao = this.text.observacao;
    patrimonio.status = this.text.status;
    patrimonio.tag = this.text.tag;
    patrimonio.numeroFicticio = this.text.numeroFicticio;
    patrimonio.ultimoUsuario = this.usuario.login;
    
    return patrimonio;
  }

  public async preencherPropriedades (patrimonio: Patrimonio) {
    var propriedades =  await this.carregaPropriedadePorPartrimonio(this.clienteSelecionado.banco, patrimonio.id, patrimonio.idEspecie);
    return propriedades;
  }

  async carregaPropriedadePorPartrimonio(banco: string, idPatrimonio: number, idEspecie: number) {
    var atributosDoBemHelper: AtributosDoBemHelper = new AtributosDoBemHelper(this.atributosDoBemDao);
    var retorno = await atributosDoBemHelper.buscaAtributosDoBemPorPatrimonio(banco, idPatrimonio);

    if (retorno == undefined || (retorno != undefined && retorno.length == 0)) {
      if (idEspecie != undefined && idEspecie != 0) {
        retorno = await this.carregaPropriedadePorEspecie(banco, idEspecie);
      }
    }

    return retorno;
  }

  async carregaPropriedadePorEspecie(banco: string, idEspecie: number) {
    var atributosDoBemHelper: AtributosDoBemHelper = new AtributosDoBemHelper(this.atributosDoBemDao);
    var retorno = await atributosDoBemHelper.buscaAtributosDoBemPorEspecie(banco, idEspecie);
    return retorno;
  }

}
