import { DatabaseProvider } from './../database/database';
import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import * as AppConstants from '../../app/app-constantes';
/*
  Generated class for the SyncClientToServerDaoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SyncClientToServerDaoProvider {

  constructor(public dbProvider: DatabaseProvider) { }

  public retornaRegistros(banco: string, tabela: string, dataHora: string ) {
    var sql = '';

    if(tabela == 'tb_UsuarioEquipamento' || tabela == 'tb_ConfiguracoesEquipamento')
      banco = AppConstants.dbConfigMobile;

    if(tabela == 'tb_UsuarioEquipamento' || tabela == 'tb_Patrimonio' || tabela == 'tb_ConfiguracoesEquipamento' || tabela == 'tb_Filial' || tabela == 'tb_Local' || tabela == 'tb_CentroCusto' || tabela == 'tb_CentroResponsabilidade') {
      sql = "SELECT * FROM "+tabela+" WHERE dtAlteracao >= '"+dataHora+"'"
    } else {
      sql = "SELECT * FROM "+tabela+" WHERE dtInsercao >= '"+dataHora+"'"
    }

    return this.dbProvider.getDB(banco).then((dataBase: SQLiteObject) => {
      return dataBase.executeSql(sql,[]).then((result: any) => {
        var dados = [];
        for(var i = 0; i < result.rows.length; i++) {
          dados.push(result.rows.item(i));
        }
        return dados;
      }).catch(e => console.error('Erro ao consultar tabela '+tabela, e))
    }).catch(e => console.error('Erro ao obter instancia do DB',e))
  }

}
