import { Util } from './../../helper/Util';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DatabaseProvider } from '../database/database';
import { SQLiteObject } from '@ionic-native/sqlite';
import * as Constants from '../database/sql';
import * as ConstantsConfig from '../database/sqlDbConfig';
import { SqlHelper } from '../../helper/sql-helper';
import { LoadingController, AlertController, Events, Loading } from 'ionic-angular';
import * as AppConstants from '../../app/app-constantes';
import 'rxjs/add/operator/timeout';
import { SqlUpdateHelper } from '../../helper/sqlUpdate-helper';

/*
  Generated class for the SyncServerToClientProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SyncServerToClientProvider {
  private API_URL = 'http://192.168.1.148:8080/famobileservice/api/v1/sync/receber/';
  public loading: Loading = null;
  public flagIp: boolean = false;

  constructor(public http: HttpClient, public dbProvider: DatabaseProvider,
    public loadingCtrl: LoadingController, public sqlHelper: SqlHelper, public sqlUpdateHelper: SqlUpdateHelper, public alertIp: AlertController,
    public event: Events) {
    this.flagIp = false;
  }

  public ipAtual(ip: any) {
    this.API_URL = 'http://' + ip + ':8080/famobileservice/api/v1/sync/receber/'
  }
  public async iniciarConfig() {
    this.flagIp = false;
    await this.dbProvider.createDatabase(AppConstants.dbConfigMobile);
    await this.dbProvider.verificaConfigDb().then((result: any) => {
      if (result == 0) {
        console.log('Iniciando sincronização do dbConfig_HML');
        this.executaSincronizacaoServerToClientConfigDb(false);
      }
    })
  }

  public listarPaginacao(banco: string, tabela: string, data: string, pular: number, trazer: number) {
    return new Promise((resolve, reject) => {

      let url = this.API_URL + 'paginacao/?banco=' + banco + '&nomeTabela=' + tabela + '&data=' + data + '&pular=' + pular + '&trazer=' + trazer;
      console.log(url);
      this.http.get(url)
        .subscribe(syncData => {
          resolve(syncData);
        },
          (err: HttpErrorResponse) => {
            if (err.error instanceof Error) {
              reject(new Error('Client-side error occured.'));
            } else {
              reject(new Error('Server-side error occured.'));
            }
          });
    });
  }

  public quantidadeLinhas(banco: string, tabela: string, data: string) {
    return new Promise((resolve, reject) => {

      let url = this.API_URL + 'quantidade/?banco=' + banco + '&nomeTabela=' + tabela + '&data=' + data;
      console.log(url);
      this.http.get(url).timeout(5000)
        .subscribe(syncData => {
          resolve(syncData);
        },
          (err: HttpErrorResponse) => {
            if (err.error instanceof Error) {
              reject(new Error("Client-side error occured."));
            } else {
              reject(new Error("Server-side error occured."));
            }
          });
    });
  }

  async executaSincronizacaoServerToClientConfigDb(insertOrUpdate: boolean) {
      await this.syncConfig(AppConstants.dbConfigServer, ConstantsConfig.tabelas, insertOrUpdate);
  }

  async executaSincronizacaoServerToClient(banco: string, insertOrUpdate: boolean) {
    await this.syncMobile(banco, Constants.tabelasPorData, insertOrUpdate);
  }

  async executaSincronizacaoServerToClientDeleted(banco: string) {
    await this.syncDeleted(banco)
    await this.syncDeleted(AppConstants.dbConfigServer)
  }

  async syncDeleted(banco: string) {
    let erroSync = false;
    let tabela = 'tb_ControleExclusao'

    this.loading = this.loadingCtrl.create({
      content: 'Sincronizando dados...'
    });
    await this.loading.present();

    await this.dbProvider.getDB(banco).then(async (dbObject: SQLiteObject) => {
      let qtdLinhas = Constants.qtdLinhas;
        var dataAtualizacao: string = await this.dbProvider.pesquisaDataMobile(banco, tabela);
        console.log('dataAtualizacao: '+ tabela + ' = '+ dataAtualizacao)
        await this.quantidadeLinhas(banco, tabela, dataAtualizacao).then(async data => {
          var dataResponseQtd: any = data;
          let quantidade = JSON.parse(dataResponseQtd.dados).quantidade;
          for (let inicioPaginacao = 0, i = 1; inicioPaginacao < quantidade; inicioPaginacao += qtdLinhas, i++) {
            this.loading.setContent(tabela + ' ' + Math.round((100 * i) / Math.ceil(quantidade / qtdLinhas)) + '%');
            console.log('Sync: ' + tabela + ' ' + i + ' de ' + Math.ceil(quantidade / qtdLinhas));
            try {
              const allData = await this.getAllData(banco, dataAtualizacao, tabela, inicioPaginacao, quantidade, qtdLinhas, dbObject);
              if (allData.length > 0)
                await this.deleteMobile(dbObject, tabela, allData);
            } catch (err) {
              throw new Error(err);
            }
          }
        })
          .catch(async error => {
            await this.loading.dismiss();
            console.error('Falha na sincronização', error);
            alert('Houve uma falha na sincronização da tabela ' + tabela + '. Por favor tente novamente!');
            erroSync = true;
            return;
          });
        if(!erroSync) {
          erroSync = false;
          const dataFormatada = Util.modifyDate(new Date());
          await this.dbProvider.gravarDataControleSyncIn(tabela, dbObject, dataFormatada);
        }
    })
    .catch(async error => {
      console.error('Erro ao obter instancia de DB', error)
    });
    await this.loading.dismiss();
  }

  async syncMobile(banco: string, listaDeTabelas: string[], insertOrUpdate: boolean) {
    let erroSync = false;
    this.loading = this.loadingCtrl.create({
      content: 'Sincronizando dados...'
    });
    await this.loading.present();

    await this.dbProvider.getDB(banco).then(async (dbObject: SQLiteObject) => {
      for (const tabela of listaDeTabelas) {
        let qtdLinhas = Constants.qtdLinhas;
        var dataAtualizacao: string = await this.dbProvider.pesquisaDataMobile(banco, tabela);
        console.log('dataAtualizacao: '+ tabela + ' = '+ dataAtualizacao)
        await this.quantidadeLinhas(banco, tabela, dataAtualizacao).then(async data => {
          var dataResponseQtd: any = data;
          let quantidade = JSON.parse(dataResponseQtd.dados).quantidade;
          for (let inicioPaginacao = 0, i = 1; inicioPaginacao < quantidade; inicioPaginacao += qtdLinhas, i++) {
            this.loading.setContent(tabela + ' ' + Math.round((100 * i) / Math.ceil(quantidade / qtdLinhas)) + '%');
            console.log('Sync: ' + tabela + ' ' + i + ' de ' + Math.ceil(quantidade / qtdLinhas));
            try {
              const allData = await this.getAllData(banco, dataAtualizacao, tabela, inicioPaginacao, quantidade, qtdLinhas, dbObject);
              if (allData.length > 0 && !insertOrUpdate) {
                await this.insertMobile(dbObject, tabela, allData);
              } else {
                await this.insertUpdateMobile(dbObject, tabela, allData);
              }
            } catch (err) {
              throw new Error(err);
            }
          }
        })
          .catch(async error => {
            //await this.loading.dismiss();
            console.error('Falha na sincronização', error);
            alert('Houve uma falha na sincronização da tabela ' + tabela + '. Por favor tente novamente!');
            erroSync = true;
            return;
          });
        if(!erroSync) {
          erroSync = false;
          const dataFormatada = Util.modifyDate(new Date());
          await this.dbProvider.gravarDataControleSyncIn(tabela, dbObject, dataFormatada);
        }
      }
    })
      .catch(async error => {
        //await this.loading.dismiss();
        console.error('Erro ao obter instancia de DB', error)
      });
    await this.loading.dismiss();
  }

  async syncConfig(banco: string, listaDeTabelas: string[], insertOrUpdate: boolean) {
    let erroSync = false;
    this.loading = this.loadingCtrl.create({
      content: 'Sincronizando dados...'
    });
    await this.loading.present();

    await this.dbProvider.getDB(banco).then(async (dbObject: SQLiteObject) => {
      for (const tabela of listaDeTabelas) {
        let qtdLinhas = Constants.qtdLinhas;
        var dataAtualizacao: string = await this.dbProvider.pesquisaDataConfig(banco, tabela);
        console.log('dataAtualizacao: '+ tabela + ' = '+ dataAtualizacao)
        await this.quantidadeLinhas(banco, tabela, dataAtualizacao).then(async data => {
          this.flagIp = true;
          var dataResponseQtd: any = data;
          let quantidade = JSON.parse(dataResponseQtd.dados).quantidade;
          for (let inicioPaginacao = 0, i = 1; inicioPaginacao < quantidade; inicioPaginacao += qtdLinhas, i++) {
            this.loading.setContent(tabela + ' ' + Math.round((100 * i) / Math.ceil(quantidade / qtdLinhas)) + '%');
            console.log('Sync: ' + tabela + ' ' + i + ' de ' + Math.ceil(quantidade / qtdLinhas));
            try {
              const allData = await this.getAllData(banco, dataAtualizacao, tabela, inicioPaginacao, quantidade, qtdLinhas, dbObject);
              if (allData.length > 0 && !insertOrUpdate) {
                await this.insertMobile(dbObject, tabela, allData);
              } else {
                await this.insertUpdateConfig(dbObject, tabela, allData);
              }
            } catch (err) {
              throw new Error('erro');
            }
          }
        })
          .catch(error => {
            erroSync = true;
            if (!this.flagIp) {
              this.loading.dismiss();

              console.error('Endereço de IP inválido', error);

              this.alertIp.create({
                title: 'Para sincronizar digite um IP válido',
                buttons: [
                  {
                    text: 'Confirmar',
                    handler: () => {
                      this.event.publish('mudarIp');
                    }
                  }
                ]
              }).present();
              
            } else {
              alert('Houve uma falha na sincronização da tabela ' + tabela + '. Por favor tente novamente!');
              return;
            }
          });
        if(!erroSync) {
          erroSync = false;
          const dataFormatada = Util.modifyDate(new Date());
          await this.dbProvider.gravarDataControleSyncIn(tabela, dbObject, dataFormatada);
        }
        if (!this.flagIp) {
          return;
        }
      }
    })
      .catch(async error => {
        //await this.loading.dismiss();
        console.error('Erro ao obter instancia de DB', error)
      });
    await this.loading.dismiss();
  }

  async syncConfigInside(banco: string, listaDeTabelas: string[], insertOrUpdate: boolean) {
    this.loading = this.loadingCtrl.create({
      content: 'Sincronizando dados...'
    });
    await this.loading.present();

    await this.dbProvider.getDB(banco).then(async (dbObject: SQLiteObject) => {
      let erroSync = false;
      for (const tabela of listaDeTabelas) {
        let qtdLinhas = Constants.qtdLinhas;
        var dataAtualizacao: string = await this.dbProvider.pesquisaDataConfig(banco, tabela);
        console.log('dataAtualizacao: '+ tabela + ' = '+ dataAtualizacao)
        await this.quantidadeLinhas(banco, tabela, dataAtualizacao).then(async data => {
          var dataResponseQtd: any = data;
          let quantidade = JSON.parse(dataResponseQtd.dados).quantidade;
          for (let inicioPaginacao = 0, i = 1; inicioPaginacao < quantidade; inicioPaginacao += qtdLinhas, i++) {
            this.loading.setContent(tabela + ' ' + Math.round((100 * i) / Math.ceil(quantidade / qtdLinhas)) + '%');
            console.log('Sync: ' + tabela + ' ' + i + ' de ' + Math.ceil(quantidade / qtdLinhas));
            try {
              const allData = await this.getAllData(banco, dataAtualizacao, tabela, inicioPaginacao, quantidade, qtdLinhas, dbObject);
              if (allData.length > 0 && !insertOrUpdate) {
                await this.insertMobile(dbObject, tabela, allData);
              } else {
                await this.insertUpdateConfig(dbObject, tabela, allData);
              }
            } catch (err) {
              throw new Error('erro');
            }
          }
        })
          .catch(async error => {
            //await this.loading.dismiss();
            console.error('Falha na sincronização', error);
            alert('Houve uma falha na sincronização da tabela ' + tabela + '. Por favor tente novamente!');
            erroSync = true;
            return;
          });
        if(!erroSync) {
          erroSync = false;
          const dataFormatada = Util.modifyDate(new Date());
          await this.dbProvider.gravarDataControleSyncIn(tabela, dbObject, dataFormatada);
        }
      }
    })
      .catch(async error => {
        //await this.loading.dismiss();
        console.error('Erro ao obter instancia de DB', error)
      });
    await this.loading.dismiss();
  }

  async getAllData(banco: string, ultimaAtualizacao: string, tabela: string, inicioPaginacao: number, quantidade: number, qtdLinhas: number, db: SQLiteObject) {
    return this.listarPaginacao(banco, tabela, ultimaAtualizacao, inicioPaginacao, qtdLinhas).then((data: any) => {
      return data.dados;
    })
      .catch(error => {
        console.error('Erro ao consumir lista com paginação', error)
        throw new Error('Erro ao consumir lista com paginação ' + tabela);
      });
  }

  /**
   * Metodo que recebe insere ou atualiza os dados no mobile.
   * Este metodo deve ser usado apenas se o banco existir e ainda contiver dados.
   * 
   * 
   * @param db 
   * @param tabela 
   * @param dados 
   */
  async insertUpdateMobile(db: SQLiteObject, tabela: string, dados: any[]) {
    let queries = [];
    for (const item of dados) {
      var elem = JSON.parse(item);
      var busca: any = 0;
      if (tabela == Constants.tb_FotoDoBem) {
        busca = await this.dbProvider.existeNoBancoLocal(db, tabela, elem.NomeFoto, 'nomeFoto');
      } else if (tabela == Constants.tb_Patrimonio) {
        busca = await this.dbProvider.existePatrimonioNoBancoLocal(db, elem.id_Filial ,elem.Codigo, elem.Incorporacao);
        if(busca > 0) {
          if(busca != elem.ID) {//ids diferente remove local e insere o do servidor
            await this.deleteIdLocal(db, Constants.tb_Patrimonio, busca)
            busca = 0 // agora irá inserir o mesmo dado do servidor com o id correto 
          }
        }
      } else if (tabela == Constants.tb_AtributosDoBem) {
        busca = await this.dbProvider.existePropriedadeNoBancoLocal(db, elem.ID_Patrimonio , elem.ID_Propriedade);
        if(busca > 0) {
          if(busca != elem.ID) {//ids diferente remove local e insere o do servidor
            await this.deleteIdLocal(db, Constants.tb_AtributosDoBem, busca)
            busca = 0 // agora irá inserir o mesmo dado do servidor com o id correto 
          }
        }
      } else if (tabela == Constants.tb_Inventario) {
        busca = await this.dbProvider.existeInventarioNoBancoLocal(db, Util.modifyDate(elem.DataDeGravacao) , elem.id_Patrimonio);
        if(busca > 0) {
          if(busca != elem.ID) {//ids diferente remove local e insere o do servidor
            await this.deleteIdLocal(db, Constants.tb_Inventario, busca)
            busca = 0 // agora irá inserir o mesmo dado do servidor com o id correto 
          }
        }
      } else {
        busca = await this.dbProvider.existeNoBancoLocal(db, tabela, elem.ID, 'id');
      }
      if (busca === 0) {
        queries.push(this.sqlHelper.buildInsert(tabela, elem));
      } else {
          console.log('existe! logo Update '+tabela);
          queries.push(this.sqlUpdateHelper.buildUpdate(tabela, elem));
      }
    }
    return db.sqlBatch(queries)
      .then(() => {
        console.log('Batch na tabela ' + tabela + ' executada com sucesso. Em ' + queries.length + ' linhas !');
      })
      .catch(e => {
        console.error('Erro ao executar Batch na tabela ' + tabela, e)
        throw new Error('Erro ao executar Batch na tabela ' + tabela);
      })
  }

  async insertUpdateConfig(db: SQLiteObject, tabela: string, dados: any[]) {
    let queries = [];
    let busca: any;
    for (const item of dados) {
      var elem = JSON.parse(item);
      if (tabela === ConstantsConfig.tb_ConfiguracoesEquipamento) {
        busca = await this.dbProvider.existeNoBancoLocal(db, tabela, elem.idConfig, 'id');
      } else if (tabela === ConstantsConfig.tb_TipoServidor) {
        busca = await this.dbProvider.existeNoBancoLocal(db, tabela, elem.id_TipoServidor, 'id');
      } else {
        busca = await this.dbProvider.existeNoBancoLocal(db, tabela, elem.ID, 'id');
      }
      if (busca === 0) {
        console.log('Fazendo insercao de novo dado ' + tabela + ' ');
        queries.push(this.sqlHelper.buildInsert(tabela, elem));
      } else {
        console.log('codigo: ' + elem.ID + ' existe! logo Update');
        queries.push(this.sqlUpdateHelper.buildUpdate(tabela, elem));
      }
    }
    return db.sqlBatch(queries)
      .then(() => {
        console.log('Batch na tabela ' + tabela + ' executada com sucesso. Em ' + queries.length + ' linhas !');
      })
      .catch(e => {
        console.error('Erro ao executar Batch na tabela ' + tabela, e)
        throw new Error('Erro ao executar Batch na tabela ' + tabela);
      })
  }

  async insertMobile(db: SQLiteObject, tabela: string, dados: any[]) {
    let queries = [];
    for (const item of dados) {
      var elem = JSON.parse(item);
      queries.push(this.sqlHelper.buildInsert(tabela, elem));
    }
    return db.sqlBatch(queries)
      .then(() => {
        console.log('Batch na tabela ' + tabela + ' executada com sucesso. Foi inserido ' + queries.length + ' linhas !');
      })
      .catch(e => {
        console.error('Erro ao executar Batch na tabela ' + tabela, e)
        throw new Error('Erro ao executar Batch na tabela ' + tabela);
      })
  }

  async deleteMobile(db: SQLiteObject, tabela: string, dados: any[]) {
    let queries = [];
    for (const item of dados) {
      var elem = JSON.parse(item);
      if(elem.Id != undefined && elem.Tabela != undefined) {
        queries.push("DELETE FROM "+ elem.Tabela + " WHERE id = " + elem.Id);
      }
    }
    await db.sqlBatch(queries)
      .then(() => {
        console.log('Batch na tabela ' + tabela + ' executada com sucesso. Foi deletado ' + queries.length + ' linhas !');
      })
      .catch(e => {
        console.error('Erro ao executar Batch(Delete) na tabela ' + tabela, e)
        throw new Error('Erro ao executar Batch(Delete) na tabela ' + tabela);
      })
  }

  async deleteIdLocal(db: SQLiteObject, tabela: string, id: number) {
    await db.executeSql('DELETE FROM '+tabela+' WHERE id =' + id,[])
      .then(() => {
        console.log(tabela+'excluido com sucesso id '+ id);
      })
      .catch(e => {
        console.error('Erro ao excluir '+tabela+' id ' + id, e)
        throw new Error('Erro ao excluir '+tabela+' id ' + id);
      })

  }

}
