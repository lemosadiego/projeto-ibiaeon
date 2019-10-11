import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DatabaseProvider } from '../database/database';
import { SQLiteObject } from '@ionic-native/sqlite';
import * as AppConstants from '../../app/app-constantes';

@Injectable()
export class UsuarioDaoProvider {

  constructor(public http: HttpClient, public dbProvider: DatabaseProvider) { }

  public buscaUsuario(login: string) {
    return this.dbProvider.getDB(AppConstants.dbConfigMobile).then((db: SQLiteObject) => {
      return db.executeSql('SELECT * FROM tb_UsuarioEquipamento WHERE login = \''+login+'\' COLLATE NOCASE',[]).then((result: any) => {
        return result.rows.item(0);
      }).catch(e => console.error('Erro ao consultar buscaUsuario',e))
    }).catch(e => console.error('Erro ao obter instancia do DB',e));
  }

  public buscaUsuarioPorCliente() {
    return this.dbProvider.getDB(AppConstants.dbConfigMobile).then((db: SQLiteObject) => {
      return db.executeSql('SELECT Upper(Login) as cliente FROM tb_UsuarioEquipamento',[]).then((result: any) => {
        var clientes: any = [];
        for (let index = 0; index < result.rows.length; index++) {
          clientes.push(result.rows.item(index));
        }
        return clientes;
      }).catch(e => console.error('Erro ao consultar buscaUsuario',e))
    }).catch(e => console.error('Erro ao obter instancia do DB',e));
  }

  public alterarSenha(senha, dataHora, idUsuario) {
    return this.dbProvider.getDB(AppConstants.dbConfigMobile).then((db: SQLiteObject) => {
      return db.executeSql('UPDATE tb_UsuarioEquipamento SET senha = ?, dtAlteracao = ? WHERE id = ?',[senha, dataHora, idUsuario]).then(() => {
        return 1;
      }).catch(e => {
        console.error('Erro ao alterar senha',e)
        return -1;
      })
    }).catch(e => console.error('Erro ao obter instancia do DB',e));
  }

}
