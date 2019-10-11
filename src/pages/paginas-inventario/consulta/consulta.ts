import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatePicker } from '@ionic-native/date-picker';
import { Session } from '../../../providers/session/session';
import { UsuarioDaoProvider } from '../../../providers/usuario-dao/usuario-dao';
import { ClienteDaoProvider } from '../../../providers/cliente-dao/cliente-dao';
import { ConsultaHelper } from '../../../helper/consulta/ConsultaHelper';
import { InventarioConsultaDaoProvider } from '../../../providers/inventario-consulta-dao/inventario-consulta-dao';
import { Util } from '../../../helper/Util';
import { ResultadoConsultaPage } from '../resultado-consulta/resultado-consulta';

@IonicPage()
@Component({
  selector: 'page-consulta',
  templateUrl: 'consulta.html',
})
export class ConsultaPage {
  public estaAgrupado: boolean = false;
  public grupo: string = "";
  public paginacao: boolean = false;
  public filialSelecionada: any;
  public especieSelecionada: any;
  public centroCustosSelecionado: any;
  public localSelecionado: any;
  public responsavelSelecionado: any;
  checked: boolean = false;
  public data: string = new Date().toISOString();
  selectedArray: any = [];
  public incluidos = false; revisados = false; alterados = false; baixados = false; desconhecidos = false;
  public cliente; marca; modelo; descricao; serie; obs; clienteSelecionado; camposConsulta; filtrosConsulta: string; gruposConsulta;
  retornoConsulta; retornoSelecionadoVar;

  constructor(public navCtrl: NavController,
    public usuarioDao: UsuarioDaoProvider,
    public session: Session,
    private _datePicker: DatePicker,
    public navParams: NavParams,
    public clienteDao: ClienteDaoProvider,
    public inventarioConsultaDao: InventarioConsultaDaoProvider
  ) { }

  async ngOnInit() {
    this.cliente = await this.usuarioDao.buscaUsuarioPorCliente();
    console.log(this.cliente);
  }

  ionViewWillEnter() {
    this.filialSelecionada = this.navParams.get('filialSelecionada');
    this.especieSelecionada = this.navParams.get('especieSelecionada');
    this.centroCustosSelecionado = this.navParams.get('centroCustosSelecionado');
    this.localSelecionado = this.navParams.get('localSelecionado');
    this.responsavelSelecionado = this.navParams.get('responsavelSelecionado');
    this.filtroPorStatus(0,true)
  }

  selecionaData() {
    this._datePicker.show({
      date: new Date(),
      mode: 'date',
      androidTheme: this._datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT
    }).then(data => this.data = data.toISOString());

  }
  buscarFilial() {
    this.navCtrl.push('BuscaFilaisPage');
  }

  buscarEspecie() {
    this.navCtrl.push('BuscaGrupoPage');
  }

  buscarCentroCustos() {
    this.navCtrl.push('BuscaCcustosPage');
  }

  buscarLocal() {
    this.navCtrl.push('BuscaLocalPage');
  }

  buscarResponsavel() {
    this.navCtrl.push('BuscaResponsaveisPage');
  }

  retornoSelecionado(retorno) {
    this.retornoSelecionadoVar = retorno;
    if (retorno == "naoagrupar") {
      this.camposConsulta = ` Patrimonio.id,
                              Patrimonio.codigo,
                              Patrimonio.incorporacao,
                              Especie.nome AS Especie,
                              Filial.nome AS Filial,
                              Local.nome AS Local,
                              CentroDeCusto.nome AS 'CCusto',
                              CentroDeResponsabilidade.nome AS 'Responsavel',
                              CASE
                                  WHEN Patrimonio.status = 'I' THEN 'Incluido'
                                  WHEN Patrimonio.status = 'A' THEN 'Alterado'
                                  WHEN Patrimonio.status = 'R' THEN 'Revisado'
                                  WHEN Patrimonio.status = 'B' THEN 'Baixado'
                                  WHEN Patrimonio.status = '?' THEN 'Desconhecido'
                              END AS status`;
      this.paginacao = true;
    }

    if (retorno == "especie") {
      this.camposConsulta = ` Especie.Nome AS nome, 
                            COUNT(*) AS Qtd`;
    }

    if (retorno == "filial") {
      this.camposConsulta = ` Filial.Nome AS nome, 
                            COUNT(*) AS Qtd`;
    }

    if (retorno == "ccusto") {
      this.camposConsulta = ` CentroDeCusto.Nome AS nome, 
                            COUNT(*) AS Qtd`;
    }

    if (retorno == "local") {
      this.camposConsulta = ` Local.Nome AS nome, 
                            COUNT(*) AS Qtd`;
    }

    if (retorno == "responsavel") {
      this.camposConsulta = ` CentroDeResponsabilidade.Nome AS nome, 
                            COUNT(*) AS Qtd`;
    }

    if (retorno == "status") {
      this.camposConsulta = ` CASE
                               WHEN Patrimonio.status = 'I' THEN 'Incluido'
                               WHEN Patrimonio.status = 'A' THEN 'Alterado'
                               WHEN Patrimonio.status = 'R' THEN 'Revisado'
                               WHEN Patrimonio.status = 'B' THEN 'Baixado'
                               WHEN Patrimonio.status = '?' THEN 'Desconhecido'
                            END AS nome,
                            COUNT(*) AS Qtd`;
    }
  }

  filtroPorStatus(status, checked) {
    if(this.filtrosConsulta == undefined)
      this.filtrosConsulta = ` WHERE 1=1`
    if (checked == true) {
      if (status == 1) {
        this.filtrosConsulta += ` OR Patrimonio.status = 'I'`;
      }
      if (status == 2) {
        this.filtrosConsulta += ` OR Patrimonio.status = 'R'`;
      }
      if (status == 3) {
        this.filtrosConsulta += ` OR Patrimonio.status = 'A'`;
      }
      if (status == 4) {
        this.filtrosConsulta += ` OR Patrimonio.status = 'B'`;
      }
      if (status == 5) {
        this.filtrosConsulta += ` OR Patrimonio.status = '?'`;
      }
      if (this.filialSelecionada != undefined) {
        this.filtrosConsulta += ` AND Patrimonio.id_Filial = ` + this.filialSelecionada.id;
      }
      if (this.centroCustosSelecionado != undefined) {
        this.filtrosConsulta += ` AND Patrimonio.id_CentroCusto = ` + this.centroCustosSelecionado.id;
      }
      if (this.localSelecionado != undefined) {
        this.filtrosConsulta += ` AND Patrimonio.id_Local = ` + this.localSelecionado.id;
      }
      if (this.responsavelSelecionado != undefined) {
        this.filtrosConsulta += ` AND Patrimonio.id_Responsavel = ` + this.responsavelSelecionado.id;
      }
      if (this.especieSelecionada != undefined) {
        this.filtrosConsulta += ` AND Patrimonio.id_Especie = ` + this.especieSelecionada.id;
      }
      if (this.descricao != undefined && "") {
        this.filtrosConsulta += ` AND Patrimonio.descricao = LIKE '%` + this.descricao + `%' COLLATE NOCASE `;
      }
      if (this.serie != undefined && "") {
        this.filtrosConsulta += ` AND Patrimonio.serie = LIKE '%` + this.serie + `%' COLLATE NOCASE `;
      }
      if (this.marca != undefined && "") {
        this.filtrosConsulta += ` AND Patrimonio.observacao = LIKE '%` + this.marca + `%' COLLATE NOCASE `;
      }
      if (this.modelo != undefined && "") {
        this.filtrosConsulta += ` AND Patrimonio.modelo = LIKE '%` + this.modelo + `%' COLLATE NOCASE `;
      }
      if (this.clienteSelecionado != undefined && "") {
        this.filtrosConsulta += ` AND Patrimonio.ultimoUsuario = LIKE '%` + this.clienteSelecionado + `%' COLLATE NOCASE `;
      }
      this.filtrosConsulta = this.filtrosConsulta.replace("WHERE 1=1 OR Patrimonio.status", "WHERE 1=1 AND Patrimonio.status");
    } else {
      if (status == 1) {
        this.filtrosConsulta = this.filtrosConsulta.replace(` OR Patrimonio.status = 'I'`," ");
        this.filtrosConsulta = this.filtrosConsulta.replace(` AND Patrimonio.status = 'I'`," ");
      }
      if (status == 2) {
        this.filtrosConsulta = this.filtrosConsulta.replace(` OR Patrimonio.status = 'R'`," ");
        this.filtrosConsulta = this.filtrosConsulta.replace(` AND Patrimonio.status = 'R'`," ");
      }
      if (status == 3) {
        this.filtrosConsulta = this.filtrosConsulta.replace(` OR Patrimonio.status = 'A'`," ");
        this.filtrosConsulta = this.filtrosConsulta.replace(` AND Patrimonio.status = 'A'`," ");
      }
      if (status == 4) {
        this.filtrosConsulta = this.filtrosConsulta.replace(` OR Patrimonio.status = 'B'`," ");
        this.filtrosConsulta = this.filtrosConsulta.replace(` AND Patrimonio.status = 'B'`," ");
      }
      if (status == 5) {
        this.filtrosConsulta = this.filtrosConsulta.replace(` OR Patrimonio.status = '?'`," ");
        this.filtrosConsulta = this.filtrosConsulta.replace(` AND Patrimonio.status = '?'`," ");
      }
    }

  }

  private preencheGruposConsulta() {
    this.gruposConsulta = " GROUP BY ";

    if (this.retornoSelecionadoVar == "naoagrupar") {
      this.gruposConsulta = " LIMIT 5000";
      this.estaAgrupado = false
    } else {
      this.estaAgrupado = true
    }

    if (this.retornoSelecionadoVar == "especie") {
      this.gruposConsulta += "Especie.nome";
      this.grupo = "Especie";
    }

    if (this.retornoSelecionadoVar == "filial") {
      this.gruposConsulta += "Filial.nome";
      this.grupo = "Filial";
    }

    if (this.retornoSelecionadoVar == "ccusto") {
      this.gruposConsulta += "CentroDeCusto.nome";
      this.grupo = "CentroCusto";
    }

    if (this.retornoSelecionadoVar == "local") {
      this.gruposConsulta += "Local.nome";
      this.grupo = "Local";
    }

    if (this.retornoSelecionadoVar == "responsavel") {
      this.gruposConsulta += "CentroDeResponsabilidade.nome";
      this.grupo = "Responsavel";
    }

    if (this.retornoSelecionadoVar == "status") {
      this.gruposConsulta += "Patrimonio.status";
      this.grupo = "Status";
    }

    if(this.gruposConsulta === " GROUP BY ")
      return false
    else 
      return true
    
  }

  async fazerConsulta() {
    var cliente = await this.session.getClienteSelecionado();
    var consultaHelper = new ConsultaHelper(this.inventarioConsultaDao);
    var dataHora: string = null
    if(this.checked === true)
       dataHora = Util.modifyDateddmmyy(this.data); // pegar no formato dd-MM-yyyy null caso nao use filtro dataHora

    if(!this.preencheGruposConsulta()) {
      alert('Pro favor preencha um Agrupamento!')
      return;
    }
    this.retornoConsulta = await consultaHelper.retornaRegistros(cliente.banco, this.camposConsulta, this.filtrosConsulta, this.gruposConsulta, dataHora);
    this.navCtrl.push('ResultadoConsultaPage', {
      resultadosConsulta: this.retornoConsulta,
      estaAgrupado: this.estaAgrupado,
      grupo: this.grupo

    })

  }

  usuarioSelecionado(cliente) {
    this.clienteSelecionado = cliente;
    this.filtroPorStatus(null, true);
  }

  addValue(): void {
    console.log('HSUHUSAHU', Util.modifyDateddmmyy(this.data));

    this.checked = !this.checked;
  }

}
