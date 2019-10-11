import { DatabaseProvider } from '../../database/database';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';

/*
  Generated class for the FilialDaoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CondicaoUsoDaoProvider {

  private condicaoQueryUpdate = 'UPDATE tb_CondicaoUso SET nome = ?, status = ?, usuarioPdaLogin = ?, dtAlteracao = ? WHERE codigo = ?'
  private condicaoQuerySelect = 'SELECT * FROM tb_CondicaoUso';

  constructor(public http: HttpClient, public dbProvider: DatabaseProvider) { }

  buscaCondicao(banco: string) {
    return this.dbProvider.getDB(banco).then((dataBase: SQLiteObject) => {
      return dataBase.executeSql(this.condicaoQuerySelect,[]).then((result: any) => {
        var filiais = [];
        for(var i = 0; i < result.rows.length; i++) {
          filiais.push(result.rows.item(i));
        }
        return filiais;
      }).catch(e => console.error('Erro ao consultar buscaCliente',e))
    }).catch(e => console.error('Erro ao obter instancia do DB',e))
  }

  editarCondicao(banco: string, nome: string, status: number, nomeLogin: string, dtAlteracao: string, codigo: number) {
    return this.dbProvider.getDB(banco).then((dataBase: SQLiteObject) => {
      return dataBase.executeSql(this.condicaoQueryUpdate,[nome,status,nomeLogin,dtAlteracao,codigo]).then((result: any) => {
        return true;
      }).catch(e => {
        console.error('Erro ao consultar editarFilial',e)
        return false;
      })
    }).catch(e => {console.error('Erro ao obter instancia do DB',e)
      return false;
    })
  }

}
