import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DatabaseProvider } from '../database/database';
import { SQLiteObject } from '@ionic-native/sqlite';
import * as AppConstants from '../../app/app-constantes';


@Injectable()
export class ClienteDaoProvider {

  constructor(public http: HttpClient, public dbProvider: DatabaseProvider) { }

  buscaCliente(idUsuario: number) {
    return this.dbProvider.getDB(AppConstants.dbConfigMobile).then((dataBase: SQLiteObject) => {
      return dataBase.executeSql('SELECT * FROM tb_Cliente WHERE status = 1 ORDER BY nome',[]).then((result: any) => {
        var clientes = [];
        for(var i = 0; i < result.rows.length; i++) {
          clientes.push(result.rows.item(i));
        }
        return clientes;
      }).catch(e => console.error('Erro ao consultar buscaCliente',e))
    }).catch(e => console.error('Erro ao obter instancia do DB',e))
  
  }

 
}
