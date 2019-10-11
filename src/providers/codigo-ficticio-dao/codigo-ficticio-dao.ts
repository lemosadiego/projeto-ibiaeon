import { Injectable } from '@angular/core';
import { DatabaseProvider } from '../database/database';
import * as AppConstants from '../../app/app-constantes';
import { SQLiteObject } from '@ionic-native/sqlite';

/*
  Generated class for the CodigoFicticioDaoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CodigoFicticioDaoProvider {
  //ATENCAO id_usuario nao existe na tabela do servidor isso pode nao atualizar nada aqui. 
  private codigoFicticioQueryUpdate = `UPDATE tb_CodigoFicticio    
                                       SET      de = ?,
                                                ate = ?,
                                                ultimoUtilizado = ?,
                                                validado = ?
                                       WHERE id_cliente = ? AND id_usuarioEquipamento = ?`;

  private codigoFicticioQuerySelect = `SELECT CF.id, UE.login, CF.de, CF.ate, CF.ultimoUtilizado, CF.validado, CF.id_usuarioEquipamento
                                       FROM tb_CodigoFicticio CF
                                       INNER JOIN tb_UsuarioEquipamento UE on UE.id = CF.id_usuarioEquipamento
                                       WHERE UE.id = ? AND CF.id_cliente = ?`;                                      
  
  constructor(public dbProvider: DatabaseProvider) { }

  atualizaCodigoFicticio(objFicticio: any) {
    return this.dbProvider.getDB(AppConstants.dbConfigMobile).then((dataBase: SQLiteObject) => {
      return dataBase.executeSql(this.codigoFicticioQueryUpdate,[objFicticio.de,objFicticio.ate,
        objFicticio.ultimoUtilizado,objFicticio.validado,objFicticio.id_cliente,
        objFicticio.id_usuarioEquipamento]).then((result: any) => {
        return 1
      }).catch(e =>{
        console.error('Erro ao atualizar codigo ficticio',e);
        return -1;
      })
    }).catch(e => {
      console.error('Erro ao obter instancia do DB',e)
      return -1;
    })
  }

  retornaIntervalo(idUsuarioLogado: number, idClienteSelecionado: number) {
    return this.dbProvider.getDB(AppConstants.dbConfigMobile).then((dataBase: SQLiteObject) => {
      return dataBase.executeSql(this.codigoFicticioQuerySelect,[idUsuarioLogado,idClienteSelecionado]).then((result: any) => {
        return result.rows.item(0);
      }).catch(e =>{
        console.error('Erro ao atualizar codigo ficticio',e);
        return -1;
      })
    }).catch(e => {
      console.error('Erro ao obter instancia do DB',e)
      return -1;
    })
  }

}
