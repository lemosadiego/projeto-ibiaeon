import { Injectable } from '@angular/core';
import { DatabaseProvider } from '../database/database';
import { SQLiteObject } from '@ionic-native/sqlite';

/*
  Generated class for the LookUpDaoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LookUpDaoProvider {

  private lookUpSelectQuery = `SELECT id_propriedade, 
                                  valor 
                                FROM tb_PropriedadeLookUp 
                                WHERE id_propriedade = ? ORDER BY valor`

  constructor(public dbProvider: DatabaseProvider) { }

  public retornaValorLookUpPorPropriedade(banco: string, idPropriedade: number) {
    return this.dbProvider.getDB(banco).then((dataBase: SQLiteObject) => {
      return dataBase.executeSql(this.lookUpSelectQuery,[idPropriedade]).then((result: any) => {
        var lookUp = [];
        for(var i = 0; i < result.rows.length; i++) {
          lookUp.push(result.rows.item(i));
        }
        return lookUp;
      }).catch(e =>{
        console.error('Erro ao consultar Propriedade LookUp',e);
        return -1;
      })
    }).catch(e => {
      console.error('Erro ao obter instancia do DB',e)
      return -1;
    })
  }
}
