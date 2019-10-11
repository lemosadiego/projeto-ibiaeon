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
export class CentroCustosDaoProvider {

  private ccustosQueryUpdate = 'UPDATE tb_CentroCusto SET nome = ?, status = ?, UsuarioPdaLogin = ?, dtAlteracao = ? WHERE codigo = ?'
  private ccustosQuerySelect = 'SELECT * FROM tb_CentroCusto';

  constructor(public http: HttpClient, public dbProvider: DatabaseProvider) { }

  buscaCentro(banco: string) {
    return this.dbProvider.getDB(banco).then((dataBase: SQLiteObject) => {
      return dataBase.executeSql(this.ccustosQuerySelect,[]).then((result: any) => {
        var filiais = [];
        for(var i = 0; i < result.rows.length; i++) {
          filiais.push(result.rows.item(i));
        }
        return filiais;
      }).catch(e => console.error('Erro ao consultar buscaCliente',e))
    }).catch(e => console.error('Erro ao obter instancia do DB',e))
  }

  editarCentro(banco: string, nome: string, status: number, nomeLogin: string, dtAlteracao: string, codigo: number) {
    return this.dbProvider.getDB(banco).then((dataBase: SQLiteObject) => {
      return dataBase.executeSql(this.ccustosQueryUpdate,[nome,status,nomeLogin,dtAlteracao,codigo]).then((result: any) => {
        return true;
      }).catch(e => {
        console.error('Erro ao consultar editarCentrodeCustos',e)
        return false;
      })
    }).catch(e => {console.error('Erro ao obter instancia do DB',e)
      return false;
    })
  }

}
