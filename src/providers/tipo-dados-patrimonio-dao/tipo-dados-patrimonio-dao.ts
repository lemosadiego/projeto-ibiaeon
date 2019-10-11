import { Injectable } from '@angular/core';
import { DatabaseProvider } from '../database/database';
import { SQLiteObject } from '@ionic-native/sqlite';

/*
  Generated class for the TipoDadosPatrimonioDaoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TipoDadosPatrimonioDaoProvider {

  private tipoDadosPatrimonioQuerySelect = `SELECT codigo, descricao FROM tb_TipoDadosPatrimonio`

  constructor(public dbProvider: DatabaseProvider) { }

  public retornaRegistros(banco: string) {
    return this.dbProvider.getDB(banco).then((dataBase: SQLiteObject) => {
      return dataBase.executeSql(this.tipoDadosPatrimonioQuerySelect,[]).then((result: any) => {
        var tipoDadosPatrimonio = [];
        for(var i = 0; i < result.rows.length; i++) {
          tipoDadosPatrimonio.push(result.rows.item(i));
        }
        return tipoDadosPatrimonio;
      }).catch(e =>{
        console.error('Erro ao consultar Tipo Dados Patrimonio',e);
        return -1;
      })
    }).catch(e => {
      console.error('Erro ao obter instancia do DB',e)
      return -1;
    })
  }

}
