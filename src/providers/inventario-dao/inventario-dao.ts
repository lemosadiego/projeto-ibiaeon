import { Injectable } from '@angular/core';
import { DatabaseProvider } from '../database/database';
import { SQLiteObject } from '@ionic-native/sqlite';
import { Inventario } from '../../modelos/Inventario';

/*
  Generated class for the InventarioDaoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class InventarioDaoProvider {

  private historicoQuerySelect = `SELECT id,
                                    id_patrimonio,
                                    CASE 
                                    WHEN usuarioPdaLogin IS NULL 
                                      THEN usuarioConfigLogin 
                                      ELSE usuarioPdaLogin 
                                    END AS usuario, 
                                    CASE
                                    WHEN situacao = 'I' THEN 'Incluido'
                                        WHEN situacao = 'A' THEN 'Alterado'
                                        WHEN situacao = 'R' THEN 'Revisado'
                                        WHEN situacao = 'B' THEN 'Baixado'
                                    END AS acao,
                                    strftime('%d-%m-%Y %H:%M:%S', dtInsercao) as dataHora
                                    FROM tb_Inventario  
                                    WHERE id_patrimonio = ? ORDER BY id DESC`;

  private inventaioInsertQuery = `INSERT INTO tb_Inventario (id_patrimonio,dtInsercao,situacao,usuarioPdaLogin,usuarioConfigLogin) VALUES (?,?,?,?,?)`
  private inventarioUpdateIdPatrimonio = `UPDATE tb_Inventario SET id_patrimonio = ? WHERE id_patrimonio = ?`;
  private inventarioUpdateData = `UPDATE tb_Inventario SET dtInsercao = ? WHERE id = ?`;

  constructor(public dbProvider: DatabaseProvider) { }
  
  buscaHistorico(banco: string, idPatrimonio: any) {
    return this.dbProvider.getDB(banco).then((dataBase: SQLiteObject) => {
      return dataBase.executeSql(this.historicoQuerySelect,[idPatrimonio]).then((result: any) => {
        var historico = [];
        for(var i = 0; i < result.rows.length; i++) {
          historico.push(result.rows.item(i));
        }
        return historico;
      }).catch(e => console.error('Erro ao consultar buscaHistorico',e))
    }).catch(e => console.error('Erro ao obter instancia do DB',e))
  }

  inserirRegistro(banco: string, inventario: Inventario) {
    var arrayDados = inventario.getAtributosToArray();
    return this.dbProvider.getDB(banco).then((dataBase: SQLiteObject) => {
      return dataBase.executeSql(this.inventaioInsertQuery,arrayDados).then((result: any) => {
        return result.insertId;
      }).catch(e =>{
        console.error('Erro ao inserir Inventario',e);
        return -1;
      })
    }).catch(e => {
      console.error('Erro ao obter instancia do DB',e)
      return -1;
    })
  }

  public alterarIdPatrimonio(banco: string, idPatrimonio: number, idPatrimonioWhere: number) {
    return this.dbProvider.getDB(banco).then((dataBase: SQLiteObject) => {
      return dataBase.executeSql(this.inventarioUpdateIdPatrimonio,[idPatrimonio,idPatrimonioWhere]).then((result: any) => {
        return 1;
      }).catch(e =>{
        console.error('Erro ao alterar idPatrimonio',e);
        return -1;
      })
    }).catch(e => {
      console.error('Erro ao obter instancia do DB',e)
      return -1;
    })
  }

  public alterarData(banco: string, data: string, id: number) {
    return this.dbProvider.getDB(banco).then((dataBase: SQLiteObject) => {
      return dataBase.executeSql(this.inventarioUpdateData,[data,id]).then((result: any) => {
        return 1;
      }).catch(e =>{
        console.error('Erro ao alterar data',e);
        return -1;
      })
    }).catch(e => {
      console.error('Erro ao obter instancia do DB',e)
      return -1;
    })
  }

}
