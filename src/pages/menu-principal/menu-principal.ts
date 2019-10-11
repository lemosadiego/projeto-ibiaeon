import { ConfiguracaoEquipamento } from '../../modelos/ConfiguracaoEquipamento';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, AlertController, LoadingController } from 'ionic-angular';
import { Session } from '../../providers/session/session';
import { Storage } from "@ionic/storage";
import { DatabaseProvider } from '../../providers/database/database';
import { SyncServerToClientProvider } from '../../providers/sync-server-to-client/sync-server-to-client';
import { ConfiguracoesEquipamentoDaoProvider } from '../../providers/configuracoes-equipamento-dao/configuracoes-equipamento-dao';
import * as $ from "jquery";
import { SyncClientToServerProvider } from '../../providers/sync-client-to-server/sync-client-to-server';
import * as ConstantsConfig from '../../providers/database/sqlDbConfig';
import * as AppConstants from '../../app/app-constantes';
import { FotosDaoProvider } from '../../providers/fotos-dao/fotos-dao';
import { FotosPage } from '../paginas-inventario/fotos/fotos';
import { Util } from '../../helper/Util';
import { SQLiteObject } from '@ionic-native/sqlite';
import { LocalLeituraRfidPage } from '../local-leitura-rfid/local-leitura-rfid';

const tabela = 'fotos';

@IonicPage()
@Component({
  selector: 'page-menu-principal',
  templateUrl: 'menu-principal.html'
})

export class MenuPrincipalPage implements OnInit {

  clientesRetornados: any;
  clienteSelecionado: any;

  constructor(public navCtrl: NavController, public session: Session, public storage: Storage,
    public dbProvider: DatabaseProvider, public syncClient: SyncServerToClientProvider,
    public configDao: ConfiguracoesEquipamentoDaoProvider, public loadingCtrl: LoadingController,
    public alert: AlertController, public syncServer: SyncClientToServerProvider,
    public fotosDao: FotosDaoProvider, public fotos: FotosPage) {
  }

  async ngOnInit() {
    this.session.isMenuPrincipal = true;
    this.session.getClienteSelecionado().then((res) => {
      this.clientesRetornados = res;
    })

    var usuario = await this.session.getUsuario();
    var cliente = await this.session.getClienteSelecionado();
    $('#usuarioLogado').html('Usuário: ' + usuario.nome);
    $('#clienteLogado').html('Cliente: ' + cliente.nome);

    var config = await this.configDao.buscarConfiguracoesEquipamento(cliente.id);
    this.criaSessionConfig(config);
    console.log('SESSION', this.clientesRetornados);

  }

  goToCadastros() {
    this.navCtrl.push('CadastrosPage');
  }
  goToInventario() {
    this.navCtrl.push('ConjutoInventarioPage');
  }
  goToConfig() {
    this.navCtrl.push('ConfiguracoesPage');
  }

  criaSessionConfig(dado: any) {
    var config: ConfiguracaoEquipamento = this.configDao.populaObjetoConfig(dado);
    this.session.createConfiguracao(config);
  }

  async ultimaAtualizacao() {
    this.clienteSelecionado = await this.session.getClienteSelecionado();
    var retorno = await this.dbProvider.pesquisaData(this.clienteSelecionado.banco, tabela);
    return retorno.clientToServer;
  }

  async uploadFotos() {
    let erroSync = false;
    let loader = this.loadingCtrl.create({
      content: "Uploading..."
    });
    var ultimaAtualizacao = await this.ultimaAtualizacao();
    var teste: any;
    var primeiraFoto = true;
    teste = await this.fotosDao.retornaRegistrosPorData(this.clientesRetornados.banco, ultimaAtualizacao);
    if (teste.length == 0) {
      alert('Não há fotos para upload');
    } else {
      for (let i = 0; i < teste.length; i++) {
        if (i > 0) {
          primeiraFoto = false;
        }
        try {
          await this.fotos.uploadFile(teste[i], primeiraFoto, loader);
        } catch(err) {
          alert('Falha ao realizar o upload.')
          i = teste.length
          erroSync = true;
        }
      }
      if(!erroSync) {
        erroSync = false;
        await this.dbProvider.getDB(this.clienteSelecionado.banco).then(async (dbObject: SQLiteObject) => {
          const dataFormatada = Util.modifyDate(new Date());
          await this.dbProvider.gravarDataControleSyncOut(tabela, dbObject, dataFormatada);
        }).catch(error => {
          console.error('Erro ao obter instancia de DB', error)
        });
      }
      await loader.dismiss();
    }

  }
  inventarioRFID(){
    this.navCtrl.push('LocalLeituraRfidPage')
  }

  async sincronizacao() {
    //Iniciando iniciando sincronizacao do banco local config
    await this.syncClient.syncConfigInside(AppConstants.dbConfigServer, ConstantsConfig.tabelas,true);
    //Criando banco de dados do cliente caso nao exista
    await this.dbProvider.createDatabase(this.clientesRetornados.banco);
    //dando carga de dados inicil na tabela de sincronização cliente para servidor
    await this.dbProvider.insertDateTimeInicialOut(this.clientesRetornados.banco);
    //Iniciando sincronização do cliente para o servidor
    await this.syncServer.executaSincronizacaoClientToServer();
    //verificando se existe dados no banco do cliente local
    const result = await this.dbProvider.verificaMobileDb(this.clientesRetornados.banco)
    if (result == 1) {
      console.log('Atualizando o banco Mobile, pois este banco ja contem dados.');
      await this.syncClient.executaSincronizacaoServerToClient(this.clientesRetornados.banco, true);
    } else {
      console.log('Não existe data de atualização para trazer dados, Agora vamos trazer tudo !');
      await this.syncClient.executaSincronizacaoServerToClient(this.clientesRetornados.banco, false);
    }
    //Iniciando sincronização do servidor para cliente de registros excluidos
    await this.syncClient.executaSincronizacaoServerToClientDeleted(this.clientesRetornados.banco);
    //upload de fotos
    await this.uploadFotos();
  }

}
