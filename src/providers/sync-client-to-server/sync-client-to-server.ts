import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import { Loading, LoadingController } from 'ionic-angular';
import { Util } from '../../helper/Util';
import { FilialDaoProvider } from '../cadastro-dao/filial-dao/filial-dao';
import { DatabaseProvider } from '../database/database';
import { InventarioMovimentacoesDaoProvider } from '../inventario-movimentacoes-dao/inventario-movimentacoes-dao';
import { Session } from '../session/session';
import { SyncClientToServerDaoProvider } from '../sync-client-to-server-dao/sync-client-to-server-dao';
import { AtributosDoBemDaoProvider } from '../atributos-do-bem-dao/atributos-do-bem-dao';
import { InventarioDaoProvider } from '../inventario-dao/inventario-dao';

/*
  Generated class for the SyncClientToServerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SyncClientToServerProvider {

  private SERVER_URL = 'http://177.94.219.199:8080/famobileservice/api/v1/'

  private API_URL_PATRIMONIO = this.SERVER_URL + 'patrimonio/';
  private API_URL_INVENTARIO = this.SERVER_URL + 'inventario/';
  private API_URL_FOTO_DO_BEM = this.SERVER_URL + 'armazenamentoimagem/';
  private API_URL_MOVIMENTACAO = this.SERVER_URL + 'movimentacoes/';
  private API_URL_ATRIBUTOS_DO_BEM = this.SERVER_URL + 'propriedades/';
  private API_URL_USUARIO = this.SERVER_URL + 'usuario/';
  private API_URL_CONFIGURACAO = this.SERVER_URL + 'configuracao/';
  private API_URL_FILIAL = this.SERVER_URL + 'filial/';
  private API_URL_LOCAL = this.SERVER_URL + 'local/';
  private API_URL_CENTRO_CUSTO = this.SERVER_URL + 'centrocusto/';
  private API_URL_RESPONSAVEL = this.SERVER_URL + 'responsavel/';

  public loading: Loading = null;
  public clienteSelecionado;
  private tabelas = ['tb_Patrimonio', 'tb_AtributosDoBem', 'tb_FotoDoBem', 'tb_Inventario', 'tb_InventarioMovimentacoes', 'tb_UsuarioEquipamento', 'tb_ConfiguracoesEquipamento', 'tb_Filial', 'tb_Local', 'tb_CentroCusto', 'tb_CentroResponsabilidade'];

  constructor(public http: HttpClient,
    public dbProvider: DatabaseProvider,
    public session: Session,
    public syncClientToServerDao: SyncClientToServerDaoProvider,
    public inventarioMovimentacoesDao: InventarioMovimentacoesDaoProvider,
    public loadingCtrl: LoadingController,
    public filialDao: FilialDaoProvider,
    public atributosDoBemDao: AtributosDoBemDaoProvider,
    public inventarioDao: InventarioDaoProvider) { }

  async ultimaAtualizacao(tabela: string) {
    this.clienteSelecionado = await this.session.getClienteSelecionado();
    var retorno = await this.dbProvider.pesquisaData(this.clienteSelecionado.banco, tabela);
    return retorno.clientToServer;
  }

  async executaSincronizacaoClientToServer() {
    let erroSync = false;
    this.loading = this.loadingCtrl.create({
      content: 'Sincronizando dados...'
    });
    await this.loading.present();
    for (let i = 0; i < this.tabelas.length; i++) {
      const ultimaAtualizacao = await this.ultimaAtualizacao(this.tabelas[i]);
      var listaDeDados: any = await this.syncClientToServerDao.retornaRegistros(this.clienteSelecionado.banco, this.tabelas[i], ultimaAtualizacao);
      console.log('listaDeDados ' +this.tabelas[i] , listaDeDados);
      for (var j = 0; j < listaDeDados.length; j++) {
        this.loading.setContent(this.tabelas[i] + ' ' + Math.round((100 * j) / listaDeDados.length) + '%');
        try {
          listaDeDados[j].banco = this.clienteSelecionado.banco;
          var url = this.retornaUrl(this.tabelas[i]);
          if (this.tabelas[i] != 'tb_Inventario' && this.tabelas[i] != 'tb_InventarioMovimentacoes' && this.tabelas[i] != 'tb_AtributosDoBem') {
            var busca: any = await this.consultar(listaDeDados[j], url);
            console.log(busca);
            if (busca.codigoRetorno === 0) {
              if(this.tabelas[i] == 'tb_Patrimonio') {
                var movimentacoes: any = await this.inventarioMovimentacoesDao.retornaRegistrosSeAlterouFilial(this.clienteSelecionado.banco, listaDeDados[j].id)
                if(movimentacoes != undefined && movimentacoes.length > 0) {
                  var filialRes = await this.filialDao.selecionaFilialPorNome(this.clienteSelecionado.banco, movimentacoes[0].valorAntigo) 
                  if(filialRes != undefined && filialRes.length > 0) {
                    listaDeDados[j].filialAntigaCodigo = filialRes[0].codigo
                    listaDeDados[j].filialAntigaId = filialRes[0].id
                    listaDeDados[j].filialAntigaNome = filialRes[0].nome
                  }
                }

              }
              const retorno: any = await this.alterar(listaDeDados[j], url)
              if(retorno.codigoRetorno === 1)
                erroSync = true;
              console.log('retorno ', retorno);
            } else if (busca.codigoRetorno === 2) {
              const id:any = await this.incluir(listaDeDados[j], url)
              if(this.tabelas[i] == 'tb_Patrimonio') {
                if(id.codigoRetorno != listaDeDados[j].id) {
                  await this.atributosDoBemDao.alterarIdPatrimonio(this.clienteSelecionado.banco, id.codigoRetorno, listaDeDados[j].id)
                  await this.inventarioDao.alterarIdPatrimonio(this.clienteSelecionado.banco, id.codigoRetorno, listaDeDados[j].id)
                }
              }
            }
          } else {
            //Antes de iniciar exclui todos atributosDoBem
            if (j == 0 && this.tabelas[i] == 'tb_AtributosDoBem') { 
              var exclusao = await this.excluir(listaDeDados[j], url);
              console.log('Exclusao: ', exclusao);
            }
            const id:any = await this.incluir(listaDeDados[j], url)
            console.log('id inserido ', id);
            if(this.tabelas[i] == 'tb_Inventario') {
              await this.inventarioDao.alterarData(this.clienteSelecionado.banco, id.mensagem, listaDeDados[j].id)
            }
          }
        } catch (err) {
          await this.loading.dismiss();
          console.error(err);
          alert('Houve uma falha na sincronização da tabela ' + this.tabelas[i] + '. Por favor tente novamente!');
          erroSync = true;
          return;
        }
      }
      if(!erroSync) {
        erroSync = false;
        await this.dbProvider.getDB(this.clienteSelecionado.banco).then(async (dbObject: SQLiteObject) => {
          const dataFormatada = Util.modifyDate(new Date());
          await this.dbProvider.gravarDataControleSyncOut(this.tabelas[i], dbObject, dataFormatada);
        }).catch(error => {
          console.error('Erro ao obter instancia de DB', error)
        });
      }
    }
    await this.loading.dismiss();
  }

  incluir(dados: any, apiUrl: string) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders().append('Content-Type', 'application/json')

      this.http.post(apiUrl + 'gravar', JSON.stringify(dados), { headers: headers })
        .subscribe(result => {
          resolve(result);
        },
          (err: HttpErrorResponse) => {
            reject(err)
          });
    });
  }

  excluir(dados: any, apiUrl: string) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders().append('Content-Type', 'application/json')

      this.http.post(apiUrl + 'excluir', JSON.stringify(dados), { headers: headers })
        .subscribe(result => {
          resolve(result);
        },
          (err: HttpErrorResponse) => {
            reject(err)
          });
    });
  }

  alterar(dados: any, apiUrl: string) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders().append('Content-Type', 'application/json')

      this.http.post(apiUrl + 'alterar', JSON.stringify(dados), { headers: headers })
        .subscribe(result => {
          resolve(result);
        },
          (err: HttpErrorResponse) => {
            reject(err)
          });
    });
  }

  consultar(dados: any, apiUrl: string) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders().append('Content-Type', 'application/json')

      this.http.post(apiUrl + 'consultar', JSON.stringify(dados), { headers: headers })
        .subscribe(result => {
          resolve(result);
        },
          (err: HttpErrorResponse) => {
            reject(err)
          });
    });
  }

  retornaUrl(tabela: string): string {
    var url = '';
    switch (tabela) {
      case 'tb_Inventario':
        url = this.API_URL_INVENTARIO;
        break;
      case 'tb_Patrimonio':
        url = this.API_URL_PATRIMONIO;
        break;
      case 'tb_FotoDoBem':
        url = this.API_URL_FOTO_DO_BEM;
        break;
      case 'tb_InventarioMovimentacoes':
        url = this.API_URL_MOVIMENTACAO;
        break;
      case 'tb_AtributosDoBem':
        url = this.API_URL_ATRIBUTOS_DO_BEM;
        break;
      case 'tb_UsuarioEquipamento':
        url = this.API_URL_USUARIO;
        break;
      case 'tb_ConfiguracoesEquipamento':
        url = this.API_URL_CONFIGURACAO;
        break;
      case 'tb_Filial':
        url = this.API_URL_FILIAL;
        break;
      case 'tb_Local':
        url = this.API_URL_LOCAL;
        break;
      case 'tb_CentroCusto':
        url = this.API_URL_CENTRO_CUSTO;
        break;
      case 'tb_CentroResponsabilidade':
        url = this.API_URL_RESPONSAVEL;
        break;
      default:
        break;
    }
    return url;
  }
}
