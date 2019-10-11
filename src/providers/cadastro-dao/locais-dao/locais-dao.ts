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
export class LocaisDaoProvider {

  private locaisQueryUpdate = 'UPDATE tb_local SET nome = ?, status = ?, usuarioPdaLogin = ?, dtAlteracao = ? WHERE codigo = ?'
  private locaisQuerySelect = 'SELECT * FROM tb_local';

  constructor(public http: HttpClient, public dbProvider: DatabaseProvider) { }

  buscaLocais(banco: string) {
    return this.dbProvider.getDB(banco).then((dataBase: SQLiteObject) => {
      return dataBase.executeSql(this.locaisQuerySelect,[]).then((result: any) => {
        var filiais = [];
        for(var i = 0; i < result.rows.length; i++) {
          filiais.push(result.rows.item(i));
        }
        return filiais;
      }).catch(e => console.error('Erro ao consultar buscaCliente',e))
    }).catch(e => console.error('Erro ao obter instancia do DB',e))
  }

  editarLocal(banco: string, nome: string, status: number, nomeLogin: string, dtAlteracao: string, codigo: number) {
    return this.dbProvider.getDB(banco).then((dataBase: SQLiteObject) => {
      return dataBase.executeSql(this.locaisQueryUpdate,[nome,status,nomeLogin,dtAlteracao,codigo]).then((result: any) => {
        return true;
      }).catch(e => {
        console.error('Erro ao consultar editarLocal',e)
        return false;
      })
    }).catch(e => {console.error('Erro ao obter instancia do DB',e)
      return false;
    })
  }

}
