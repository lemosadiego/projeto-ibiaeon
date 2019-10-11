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
export class FilialDaoProvider {

  private filialQueryUpdate = 'UPDATE tb_Filial SET nome = ?, status = ?, UsuarioPdaLogin = ?, dtAlteracao = ? WHERE codigo = ?'
  private filialQuerySelect = 'SELECT * FROM tb_Filial';
  private filialQuerySelectNome = 'SELECT * FROM tb_Filial where nome = ?';

  constructor(public http: HttpClient, public dbProvider: DatabaseProvider) { }

  buscaFiliais(banco: string) {
    return this.dbProvider.getDB(banco).then((dataBase: SQLiteObject) => {
      return dataBase.executeSql(this.filialQuerySelect,[]).then((result: any) => {
        var filiais = [];
        for(var i = 0; i < result.rows.length; i++) {
          filiais.push(result.rows.item(i));
        }
        return filiais;
      }).catch(e => console.error('Erro ao consultar buscaCliente',e))
    }).catch(e => console.error('Erro ao obter instancia do DB',e))
  }

  editarFilial(banco: string, nome: string, status: number, nomeLogin: string, dtAlteracao: string, codigo: number) {
    return this.dbProvider.getDB(banco).then((dataBase: SQLiteObject) => {
      return dataBase.executeSql(this.filialQueryUpdate,[nome,status,nomeLogin,dtAlteracao,codigo]).then((result: any) => {
        return true;
      }).catch(e => {
        console.error('Erro ao consultar editarFilial',e)
        return false;
      })
    }).catch(e => {console.error('Erro ao obter instancia do DB',e)
      return false;
    })
  }

  selecionaFilialPorNome(banco: string, nome: string){
    return this.dbProvider.getDB(banco).then((dataBase: SQLiteObject) => {
      return dataBase.executeSql(this.filialQuerySelectNome,[nome]).then((result: any) => {
        var filial = [];
        if(result.rows.length > 0)
          filial.push(result.rows.item(0));
        return filial

      }).catch(e => {
        console.error('Erro ao consultar nome filial',e)
        return undefined;
      })
    }).catch(e => {console.error('Erro ao obter instancia do DB',e)
      return undefined;
    })
  }

}
