import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Session } from '../../providers/session/session';
import { ConfiguracoesEquipamentoDaoProvider } from '../../providers/configuracoes-equipamento-dao/configuracoes-equipamento-dao';
import { PatrimonioDaoProvider } from '../../providers/patrimonio-dao/patrimonio-dao';
import { PatrimonioHelper } from '../../helper/patrimonio/PatrimonioHelper';
import { InventarioHelper } from '../../helper/inventario/InventarioHelper';
import { AtributosDoBemHelper } from '../../helper/atributos-do-bem/AtributosDoBemHelper';
import { AtributosDoBemDaoProvider } from '../../providers/atributos-do-bem-dao/atributos-do-bem-dao';
import { InventarioDaoProvider } from '../../providers/inventario-dao/inventario-dao';
import { TipoDadosPatrimonioDaoProvider } from '../../providers/tipo-dados-patrimonio-dao/tipo-dados-patrimonio-dao';
import { InventarioMovimentacoesDaoProvider } from '../../providers/inventario-movimentacoes-dao/inventario-movimentacoes-dao';
import { LocaisDaoProvider } from '../../providers/cadastro-dao/locais-dao/locais-dao';
import { PatrimoniosDaoProvider } from '../../providers/cadastro-dao/patrimonio-dao/patrimonio-dao';
import { ConfiguracaoEquipamento } from '../../modelos/ConfiguracaoEquipamento';
import { PageTagsNaoEncontradasPage } from '../page-tags-nao-encontradas/page-tags-nao-encontradas';
import { PageTagsEncontradasPage } from '../page-tags-encontradas/page-tags-encontradas';
import { PageTagsExcedentesPage } from '../page-tags-excedentes/page-tags-excedentes';
import { PageTagsDesconhecidasPage } from '../page-tags-desconhecidas/page-tags-desconhecidas';

declare let TestePlugin;
@IonicPage()
@Component({
  selector: 'page-page-inventario-rfid',
  templateUrl: 'page-inventario-rfid.html'
})
export class PageInventarioRfidPage {
  public buscaFeita = false;
  public locais;
  public clienteSelecionado: any;
  public codigo = "1003"
  public filtro = ' WHERE Patrimonio.id_Local = ' + '\'' + this.codigo + '\'';
  resposta: any;
  public localEscolhido: any;
  public patrimoniosRetornados: any;
  gruposRetornados: any;
  public rfidLeitura = false
  public tags: string[] = [];
  public tipoLeitura = 'multipla';
  public objConfig: ConfiguracaoEquipamento;
  etiquetaComMascara: any;
  public tagEncontrada: any[] = [];
  mascara: number;
  public nadaEncontrado = 0;
  public qtdEncontrado = 0;
  contador: number;
  public tagsIdentificadasNoLocal: any[] = [];
  public tagsExcedentes: any[] = [];
  public verificadorDeTags: any[] = [];
  public resultadoBuscaLocalFiltrado: any;
  public resultadoBuscaTodosOsLocais: any;
  tabelaResultante: any;
  tabelaResultanteNaoEncontrados: any[] = [];
  verificadorDeBusca: any;
  tag: any;
  public tagsDesconhecidas: any[] = [];
  public totalNaoEncontrado: any[] = [];
  public contaBuscaBanco: number = 0;
  public porcentagemDeLeitura = '0';

  constructor(public navCtrl: NavController, public session: Session, public navParams: NavParams,
    public configEqpDao: ConfiguracoesEquipamentoDaoProvider, public patrimonioDao: PatrimonioDaoProvider,
    public inventarioDao: InventarioDaoProvider, public tipoDadoPatrimonioDao: TipoDadosPatrimonioDaoProvider,
    public inventarioMovimentacoesDao: InventarioMovimentacoesDaoProvider, public locaisDao: LocaisDaoProvider,
    public atributosDoBemDao: AtributosDoBemDaoProvider, public patrimoniosDao: PatrimoniosDaoProvider) {

  }

  async ionViewDidLoad() {
    this.locais = await this.buscaLocais();
    console.log('TESTE');
  }
  async buscaLocais() {
    await this.session.getClienteSelecionado().then((res) => {
      this.clienteSelecionado = res;
    })
    return this.locaisDao.buscaLocais(this.clienteSelecionado.banco);
  }
  async testaPatrimonio(localEscolhido) {
    await this.session.getClienteSelecionado().then((res) => {
      this.clienteSelecionado = res;
    })
    return this.patrimoniosDao.buscaPatrimonioPorLocal(this.clienteSelecionado.banco, localEscolhido.id)
  }

  localSelecionado(local) {
    this.localEscolhido = local

  }

  async fazerInventario() {
    await this.patrimoniosDao.deletarDados(this.clienteSelecionado.banco);
    this.patrimoniosRetornados = await this.testaPatrimonio(this.localEscolhido);
    if (this.totalNaoEncontrado.length == 0)
      this.totalNaoEncontrado[0] = Object.assign({}, this.patrimoniosRetornados[0]);
    await this.patrimoniosDao.atualizaNaTabelaTemporaria(this.clienteSelecionado.banco,
      this.localEscolhido.id);
    this.tabelaResultante = await this.patrimoniosDao.selectAll(this.clienteSelecionado.banco)
    for (let i = 0; i < this.tabelaResultante.length; i++) {
      if (this.tabelaResultante[i].qtde_encontrado == null) {
        this.tabelaResultante[i].qtde_encontrado = 0;
      }
    }
    if (this.tabelaResultante != undefined && this.tabelaResultanteNaoEncontrados.length == 0) {
      for (let index = 0; index < this.tabelaResultante.length; index++) {
        this.tabelaResultanteNaoEncontrados[index] = Object.assign({}, this.tabelaResultante[index]);
      }
    }
    this.buscaFeita = true;
    this.startRfid();
    console.log('teste');
  }
  async metodoTeste() {
    var teste;
    teste = await this.patrimoniosDao.testeDeQuery(this.clienteSelecionado.banco)
    console.log('teste de query', teste);
  }
  calcularPorcentagem(itens, totalEncontrado) {
    var encontrados = totalEncontrado * 100;
    var total = (encontrados / itens);
    this.porcentagemDeLeitura = total.toFixed(1);
  }

  async teste() {
    var atributosDoBemHelper = new AtributosDoBemHelper(this.atributosDoBemDao);
    var inventarioHelper = new InventarioHelper(this.inventarioDao);
    var patrimonioHelper: PatrimonioHelper = new PatrimonioHelper(this.tipoDadoPatrimonioDao, this.inventarioMovimentacoesDao,
      this.patrimonioDao, this.configEqpDao, this.session,
      atributosDoBemHelper, inventarioHelper);
    this.resposta = await patrimonioHelper.selecionaPatrimonioPorFiltro(this.clienteSelecionado.banco, this.filtro);
    if (this.resposta != undefined) {
      this.buscaFeita = true;
    }
  }

  public initialise() {
    TestePlugin.initialise(function (data) {
      console.log('initialise ', data)
    })
  }

  async ionViewWillEnter() {
    this.patrimoniosDao.fecharConexao(this.clienteSelecionado.banco)
    var config: ConfiguracaoEquipamento = await this.session.getConfiguracao();
    this.objConfig = new ConfiguracaoEquipamento(config);
    this.mascara = this.objConfig.mascara.length;
    this.localEscolhido = this.navParams.get('localSelecionado');
    this.patrimoniosDao.CriaTabelaResultado(this.clienteSelecionado.banco)
    this.fazerInventario();

  }
  ionViewDidLeave() {
    this.patrimoniosDao.fecharConexao(this.clienteSelecionado.banco);
    this.disconnect();
    this.rfidLeitura = false;
    
  }

  public single() {
    if (this.rfidLeitura) {
      TestePlugin.singleTag((data) => {
        console.log('tag ', data.tag)
        this.preencheListaTag(data.tag);

      })
    }
  }
  tipoDeLeitura(tipo) {
    if (tipo) {
      this.tipoLeitura = 'multipla'
    } else {
      this.tipoLeitura = 'individual'
    }

  }

  startRfid() {
    if (this.tipoLeitura == 'multipla') {
      this.multi();
    } else if (this.tipoLeitura == 'individual') {
      this.single();
    }
  }
  buscarLocal() {
    this.patrimoniosRetornados = undefined;
    this.tabelaResultante = undefined;
    this.localEscolhido = undefined;
    this.navCtrl.push('BuscaLocalPage');
  }

  public async multi() {
    this.rfidLeitura = true;
    while (this.rfidLeitura) {
      this.single();
      await this.delay(300);
    }
  }

  private async preencheListaTag(tag: string) {
    var existeEtiqueta;
    var existeEtiquetaEncontrada;
    var existeEtiquetaExcedente;
    var existe = false;

    this.etiquetaComMascara = tag.substring(tag.length - this.mascara);
    if (this.rfidLeitura) {
      this.resultadoBuscaLocalFiltrado = await this.patrimoniosDao.buscaPatrimonioPorEtiquetaLocalEscolhido(this.clienteSelecionado.banco,
        this.etiquetaComMascara, this.localEscolhido.id)
      this.verificadorDeBusca = this.resultadoBuscaLocalFiltrado;
      if (this.verificadorDeBusca.length == 0 && this.rfidLeitura) {
        this.resultadoBuscaTodosOsLocais = await this.patrimoniosDao.buscaPatrimonioPorEtiquetaEmLocais(this.clienteSelecionado.banco,
          this.etiquetaComMascara, this.localEscolhido.id)
        this.verificadorDeBusca = this.resultadoBuscaTodosOsLocais;
      }
      if (this.resultadoBuscaTodosOsLocais != undefined && this.resultadoBuscaTodosOsLocais.length > 0) {
        if (!this.verificaExistencia(this.tagsExcedentes, this.resultadoBuscaTodosOsLocais[0].codigo)) {
          this.tagsExcedentes.push(this.resultadoBuscaTodosOsLocais[0]);
          await this.patrimoniosDao.updatePatrimonioStatus(this.clienteSelecionado.banco, 'I', this.resultadoBuscaTodosOsLocais[0].codigo)
        }
      }
    }
    if (this.tagsIdentificadasNoLocal.length == 0 && this.resultadoBuscaLocalFiltrado.length > 0) {
      this.tagsIdentificadasNoLocal.push(this.resultadoBuscaLocalFiltrado[0])
      console.log('adicionou');
    } else if (this.resultadoBuscaLocalFiltrado.length > 0 && this.tagsIdentificadasNoLocal.length > 0) {
      if (!this.verificaExistencia(this.tagsIdentificadasNoLocal, this.resultadoBuscaLocalFiltrado[0].codigo)) {
        this.tagsIdentificadasNoLocal.push(this.resultadoBuscaLocalFiltrado[0])
        console.log('adicionou');
      }
    }
    if (this.tagsIdentificadasNoLocal.length > 0) {
      for (let a = 0; a < this.tagsIdentificadasNoLocal.length; a++) {
        for (let c = 0; c < this.tabelaResultante.length; c++) {
          if (this.tagsIdentificadasNoLocal[a].id_grupo == this.tabelaResultante[c].idGrupo) {
            if (this.verificadorDeTags.length > 0) {
              if (!this.verificaExistencia(this.verificadorDeTags, this.tagsIdentificadasNoLocal[a].codigo)) {
                this.verificadorDeTags.push(this.tagsIdentificadasNoLocal[a])
                await this.patrimoniosDao.updatePatrimonioStatus(this.clienteSelecionado.banco, 'R', this.tagsIdentificadasNoLocal[a].codigo)
                var add = this.tabelaResultante[c].qtde_encontrado;
                var add2 = this.tabelaResultanteNaoEncontrados[c].qtde;
                this.tabelaResultante[c].qtde_encontrado = add + 1;
                this.tabelaResultanteNaoEncontrados[c].qtde = add2 - 1;
                this.totalNaoEncontrado[0].qtde = this.totalNaoEncontrado[0].qtde - 1;
                this.calcularPorcentagem(this.patrimoniosRetornados[0].qtde, this.verificadorDeTags.length)
              }
            } else {
              this.verificadorDeTags.push(this.tagsIdentificadasNoLocal[a])
              await this.patrimoniosDao.updatePatrimonioStatus(this.clienteSelecionado.banco, 'R', this.tagsIdentificadasNoLocal[a].codigo)
              var add = this.tabelaResultante[c].qtde_encontrado;
              var add2 = this.tabelaResultanteNaoEncontrados[c].qtde;
              this.tabelaResultante[c].qtde_encontrado = add + 1;
              this.tabelaResultanteNaoEncontrados[c].qtde = add2 - 1;
              this.totalNaoEncontrado[0].qtde = this.totalNaoEncontrado[0].qtde - 1;
              this.calcularPorcentagem(this.patrimoniosRetornados[0].qtde, this.verificadorDeTags.length)
            }
          }
        }
      }
    }
    existeEtiqueta = this.verificaExistencia(this.tagsDesconhecidas, this.etiquetaComMascara)
    existeEtiquetaEncontrada = this.verificaExistencia(this.tagsIdentificadasNoLocal, this.etiquetaComMascara)
    existeEtiquetaExcedente = this.verificaExistencia(this.tagsExcedentes, this.etiquetaComMascara)
    if (!existeEtiqueta && !existeEtiquetaEncontrada && !existeEtiquetaExcedente &&
      this.contaBuscaBanco > 5) {
      this.contaBuscaBanco = 0;
      this.tagsDesconhecidas.push({
        codigo: this.etiquetaComMascara
      })
    }
    this.contaBuscaBanco++;

  }

  private verificaExistencia(array1: any[], alvo) {
    var teste = array1.find(res => res.codigo == alvo);
    if (teste != undefined) {
      return true;
    } else {
      return false;
    }
  }

  async selectAll() {
    var teste;
    teste = await this.patrimoniosDao.selectAll(this.clienteSelecionado.banco)
    console.log('hsauhsuahush', teste);

  }
  async deletarDados() {
    await this.patrimoniosDao.deletarDados(this.clienteSelecionado.banco)
  }
  async criartabela() {
    await this.patrimoniosDao.CriaTabelaResultado(this.clienteSelecionado.banco)
  }

  public disconnect() {
    this.rfidLeitura = false;
    TestePlugin.disconnect(function (data) {
      console.log('disconect ', data)
    })
  }

  // tagsNaoEncontradas(){
  //   this.disconnect();
  //   this.navCtrl.push(PageTagsNaoEncontradasPage,{
  //     tagsNEncontradas: this.tabelaResultanteNaoEncontrados,
  //     local: this.localEscolhido 
  //   })
  // }

  tagsEncontradas() {
    this.navCtrl.push('PageTagsEncontradasPage', {
      tagsEncontradas: this.tagsIdentificadasNoLocal,
      localTagsEncontradas: this.localEscolhido
    })
  }
  tagsNaoEncontradas() {
    this.navCtrl.push('PageTagsNaoEncontradasPage', {
      tagsNaoEncontradas: this.tabelaResultanteNaoEncontrados,
      localTagsNaoEncontradas: this.localEscolhido,
      totalAusente: this.totalNaoEncontrado[0].qtde
    })
  }
  tagDesconhecida() {
    this.navCtrl.push('PageTagsDesconhecidasPage', {
      tagsDesconhecidas: this.tagsDesconhecidas
    })
  }
  tagExcedentes() {
    this.navCtrl.push('PageTagsExcedentesPage', {
      tagsExcedentes: this.tagsExcedentes,
      localTagsExcedentes: this.localEscolhido
    })
  }

  public clean() {
    this.rfidLeitura = false;
    this.tags = [];
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}