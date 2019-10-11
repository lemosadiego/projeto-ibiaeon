import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ConfiguracoesEquipamentoDaoProvider } from '../../providers/configuracoes-equipamento-dao/configuracoes-equipamento-dao';
import { Session } from '../../providers/session/session';
import * as $ from "jquery";
import { ConfiguracaoEquipamento } from '../../modelos/ConfiguracaoEquipamento';

/**
 * Generated class for the ConfiguracoesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-configuracoes',
  templateUrl: 'configuracoes.html',
})
export class ConfiguracoesPage {

  public numFotos: number;
  public status: any = "Ativo";
  public mascara: string;
  public ativo: boolean = true;
  public ativado: boolean = true;
  public itemObrigatorio: any;
  public avisaAlteracao: any;
  public bloqueiaAlteracao: any;
  public config: any;
  public tipoRevisao: any;
  public aux1: any = null;
  public aux2: any = null;
  public aux3: any = null;
  public aux4: any = null;
  public aux5: any = null;
  public aux6: any = null;
  public aux7: any = null;
  public aux8: any = null;
  public cliente: any;
  public paginaInventario;
  objConfig: any;
  nomeDoCampoAux: any;

  async ionViewWillEnter() {
    this.paginaInventario = this.navParams.get('paginaInventario');
    var loading = this.loadingCtrl.create({
      content: 'Carregando Configurações...'
    });
    loading.present();
    await this.carregaConfiguracoesEquipamento();
    await this.popularTela();
    loading.dismiss();
  }

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public session: Session,
    public configDao: ConfiguracoesEquipamentoDaoProvider,
    public loadingCtrl: LoadingController) {
    this.itemObrigatorio = [
      'LOCAL', 'C. CUSTOS', 'CONDIÇÃO', 'C. RESPONS.', 'DESCRIÇÃO', 'MARCA', 'MODELO',
      'N. SÉRIE', 'COD. ANT.', 'TAG', 'AUX1', 'AUX2', 'AUX3', 'AUX4', 'AUX5', 'AUX6',
      'AUX7', 'AUX8', 'OBSERVAÇÃO', 'COORDENADA'
    ],
      this.avisaAlteracao = [
        'LOCAL', 'C. CUSTOS', 'CONDIÇÃO', 'C. RESPONS.', 'DESCRIÇÃO', 'MARCA', 'MODELO',
        'N. SÉRIE', 'ESPÉCIE', 'TAG', 'AUX1', 'AUX2', 'AUX3', 'AUX4', 'AUX5', 'AUX6',
        'AUX7', 'AUX8', 'OBSERVAÇÃO'
      ],
      this.bloqueiaAlteracao = [
        'LOCAL', 'C. CUSTOS', 'CONDIÇÃO', 'C. RESPONS.', 'DESCRIÇÃO', 'MARCA', 'MODELO',
        'N. SÉRIE', 'ESPÉCIE', 'TAG', 'AUX1', 'AUX2', 'AUX3', 'AUX4', 'AUX5', 'AUX6',
        'AUX7', 'AUX8', 'OBSERVAÇÃO'
      ],
      this.nomeDoCampoAux = [
        'tbxAux01', 'tbxAux02', 'tbxAux03', 'tbxAux04', 'tbxAux05', 'tbxAux06', 'tbxAux07', 'tbxAux08'
      ]

  }

  async carregaConfiguracoesEquipamento() {
    this.cliente = await this.session.getClienteSelecionado();
    this.config = await this.session.getConfiguracao();
    this.objConfig = new ConfiguracaoEquipamento(this.config);
    //console.log(this.config);
  }

  checkbox(itens: string, item) {
    for (let i = 0; i < this.objConfig.campoObrigatorio.length; i++) {
      if (this.objConfig.campoObrigatorio[i].nome.toLowerCase() == itens.toLowerCase()) {
        if (item) {
          this.objConfig.campoObrigatorio[i].valor = "1";
        } else {
          this.objConfig.campoObrigatorio[i].valor = "0";
        }
      }
    }


  }

  pegaSelecionado(ativado: boolean) {
    ativado ? this.status = "Ativo" : this.status = "Inativo";
    return this.ativo = ativado;
  }
  voltarInventario() {
    this.navCtrl.setRoot('InventarioPage');
  }

  popularTela() {
    this.numFotos = this.objConfig.numeroFotos;
    if (this.objConfig.revisaoRapida == 0) {
      $('#rev-completa').addClass('item-radio-checked');
      $('#rev-completa .radio-icon').addClass('radio-checked');
    } else {
      $('#rev-rapida').addClass('item-radio-checked');
      $('#rev-rapida .radio-icon').addClass('radio-checked');
    }
    for (let i = 0; i < this.objConfig.campoAuxiliar.length; i++) {
      if (this.objConfig.campoAuxiliar[i].aux1 != undefined && this.objConfig.campoAuxiliar[i].aux1 != 'AUX 1' && this.objConfig.campoAuxiliar[i].aux1 != 'N' && this.objConfig.campoAuxiliar[i].aux1 != '') {
        this.aux1 = this.objConfig.campoAuxiliar[i].aux1;
      }
      else if (this.objConfig.campoAuxiliar[i].aux2 != undefined && this.objConfig.campoAuxiliar[i].aux2 != 'AUX 2' && this.objConfig.campoAuxiliar[i].aux2 != 'N' && this.objConfig.campoAuxiliar[i].aux2 != '') {
        this.aux2 = this.objConfig.campoAuxiliar[i].aux2;
      }
      else if (this.objConfig.campoAuxiliar[i].aux3 != undefined && this.objConfig.campoAuxiliar[i].aux3 != 'AUX 3' && this.objConfig.campoAuxiliar[i].aux3 != 'N' && this.objConfig.campoAuxiliar[i].aux3 != '') {
        this.aux3 = this.objConfig.campoAuxiliar[i].aux3;
      }
      else if (this.objConfig.campoAuxiliar[i].aux4 != undefined && this.objConfig.campoAuxiliar[i].aux4 != 'AUX 4' && this.objConfig.campoAuxiliar[i].aux4 != 'N' && this.objConfig.campoAuxiliar[i].aux4 != '') {
        this.aux4 = this.objConfig.campoAuxiliar[i].aux4;
      }
      else if (this.objConfig.campoAuxiliar[i].aux5 != undefined && this.objConfig.campoAuxiliar[i].aux5 != 'AUX 5' && this.objConfig.campoAuxiliar[i].aux5 != 'N' && this.objConfig.campoAuxiliar[i].aux5 != '') {
        this.aux5 = this.objConfig.campoAuxiliar[i].aux5;
      }
      else if (this.objConfig.campoAuxiliar[i].aux6 != undefined && this.objConfig.campoAuxiliar[i].aux6 != 'AUX 6' && this.objConfig.campoAuxiliar[i].aux6 != 'N' && this.objConfig.campoAuxiliar[i].aux6 != '') {
        this.aux6 = this.objConfig.campoAuxiliar[i].aux6;
      }
      else if (this.objConfig.campoAuxiliar[i].aux7 != undefined && this.objConfig.campoAuxiliar[i].aux7 != 'AUX 7' && this.objConfig.campoAuxiliar[i].aux7 != 'N' && this.objConfig.campoAuxiliar[i].aux7 != '') {
        this.aux7 = this.objConfig.campoAuxiliar[i].aux7;
      }
      else if (this.objConfig.campoAuxiliar[i].aux8 != undefined && this.objConfig.campoAuxiliar[i].aux8 != 'AUX 8' && this.objConfig.campoAuxiliar[i].aux8 != 'N' && this.objConfig.campoAuxiliar[i].aux8 != '') {
        this.aux8 = this.objConfig.campoAuxiliar[i].aux8;
      }
    }
    this.mascara = this.objConfig.mascara;
    var status = this.objConfig.usarMascara === '1' ? 'Ativo' : 'Inativo';
    this.status = status;
    for (let i = 0; i < this.objConfig.campoObrigatorio.length; i++) {
      if (this.objConfig.campoObrigatorio[i].valor === '1') {
        $('#clientes-checkbox-obg' + i).addClass('item-checkbox-checked');
        $('#clientes-checkbox-obg' + i + ' .checkbox div').addClass('checkbox-checked');
      }
    }
    for (let i = 0; i < this.objConfig.campoRevisar.length; i++) {
      if (this.objConfig.campoRevisar[i].valor === '1') {
        $('#clientes-checkbox-aviso' + i).addClass('item-checkbox-checked');
        $('#clientes-checkbox-aviso' + i + ' .checkbox div').addClass('checkbox-checked');
      }
    }
    for (let i = 0; i < this.objConfig.campoFixado.length; i++) {
      if (this.objConfig.campoFixado[i].valor === '1') {
        $('#clientes-checkbox-bloq' + i).addClass('item-checkbox-checked');
        $('#clientes-checkbox-bloq' + i + ' .checkbox div').addClass('checkbox-checked');
      }
    }
  }

  revSelecionada(teste) {

    if (teste === 'completa') {
      this.tipoRevisao = 0;
      console.log(teste);
      $('#rev-rapida').removeClass('item-radio-checked');
      $('#rev-rapida .radio-icon').removeClass('radio-checked');
    } else {
      this.tipoRevisao = 1;
      console.log(teste);
      $('#rev-completa').removeClass('item-radio-checked');
      $('#rev-completa .radio-icon').removeClass('radio-checked');
    }

    console.log('Revisão selecionada ', teste);


  }
  pegaValorAux(i): string {
    let auxRetornado;
    if (this.objConfig.campoAuxiliar[i] != null) {
      auxRetornado = this.objConfig.campoAuxiliar[i]
      if (i == 0) {
        return auxRetornado.aux1;
      }
      if (i == 1) {
        return auxRetornado.aux2;
      }
      if (i == 2) {
        return auxRetornado.aux3;
      }
      if (i == 3) {
        return auxRetornado.aux4;
      }
      if (i == 4) {
        return auxRetornado.aux5;
      }
      if (i == 5) {
        return auxRetornado.aux6;
      }
      if (i == 6) {
        return auxRetornado.aux7;
      }
      if (i == 7) {
        return auxRetornado.aux8;
      }
    }
  }

  async alterarConfig() {
    var resFoto = await this.configDao.alterarConfiguracoesEquipamentoFotos(this.numFotos, this.cliente.id);
    //checar mascara antes de gravar
    var resMasc = await this.configDao.alterarConfiguracoesEquipamentoMascara(this.mascara, this.cliente.id);

    //Atualizando a sessao
    this.pegaAuxiliares();
    for (let i = 0; i < this.objConfig.campoAuxiliar.length; i++) {
      var resAux = await this.configDao.alterarConfiguracoesEquipamentoCamposAux(this.pegaValorAux(i), this.cliente.id, this.nomeDoCampoAux[i]);
    }
    if (resFoto > 0 && resMasc > 0 && resAux > 0)
      alert('Configurações alteradas com sucesso');
    else
      alert('Falha ao alterar configurações');
    this.objConfig._mascara = this.mascara;
    this.objConfig._numeroFotos = this.numFotos;
    this.objConfig._revisaoRapida = this.tipoRevisao;
    this.session.createConfiguracao(this.objConfig);
  }
  async pegaAuxiliares() {

    if (this.aux1 != null) {
      this.objConfig._campoAuxiliar[0] = { aux1: this.aux1 }
    }
    if (this.aux2 != null) {
      this.objConfig._campoAuxiliar[1] = { aux2: this.aux2 }
    }
    if (this.aux3 != null) {
      this.objConfig._campoAuxiliar[2] = { aux3: this.aux3 }
    }
    if (this.aux4 != null) {
      this.objConfig._campoAuxiliar[3] = { aux4: this.aux4 }
    }
    if (this.aux5 != null) {
      this.objConfig._campoAuxiliar[4] = { aux5: this.aux5 }
    }
    if (this.aux6 != null) {
      this.objConfig._campoAuxiliar[5] = { aux6: this.aux6 }
    }
    if (this.aux7 != null) {
      this.objConfig._campoAuxiliar[6] = { aux7: this.aux7 }
    }
    if (this.aux8 != null) {
      this.objConfig._campoAuxiliar[7] = { aux8: this.aux8 }
    }
  }
}