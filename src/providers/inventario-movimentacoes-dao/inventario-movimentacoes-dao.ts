import { Injectable } from '@angular/core';
import { DatabaseProvider } from '../database/database';
import { InventarioMovimentacoes } from '../../modelos/InventarioMovimentacoes';
import { SQLiteObject } from '@ionic-native/sqlite';

/*
  Generated class for the InventarioMovimentacoesDaoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class InventarioMovimentacoesDaoProvider {

  private movimentacoesQueryInsert = `INSERT INTO tb_InventarioMovimentacoes (id_inventario, id_propriedade, valorAntigo, valorNovo, nome, dtInsercao) 
  VALUES (?,?,?,?,?,?)`;
  private movimentacoesQuerySelect = `SELECT id,
                                        id_inventario,
                                        valorAntigo,
                                        valorNovo
                                      FROM tb_InventarioMovimentacoes`

  private movimentacoesQuerySeAlteradaFilial = `SELECT InventarioMovimentacoes.id_inventario,
                                                        InventarioMovimentacoes.id,
                                                        InventarioMovimentacoes.id_propriedade,
                                                        Inventario.id_patrimonio,
                                                        InventarioMovimentacoes.valorAntigo,
                                                        InventarioMovimentacoes.valorNovo
                                                FROM  tb_InventarioMovimentacoes as InventarioMovimentacoes
                                                INNER JOIN  tb_Inventario as Inventario ON Inventario.id = InventarioMovimentacoes.id_inventario
                                                WHERE  Inventario.id_patrimonio = ? and inventarioMovimentacoes.id_propriedade = '-1'
                                                ORDER BY  InventarioMovimentacoes.id_inventario DESC`

  constructor(public dbProvider: DatabaseProvider) { }

  public inserirRegistro(banco: string, inventarioMovimentacoes: InventarioMovimentacoes) {
    var arrayDados = inventarioMovimentacoes.getAtributosToArray();
    return this.dbProvider.getDB(banco).then((dataBase: SQLiteObject) => {
      return dataBase.executeSql(this.movimentacoesQueryInsert,arrayDados).then((result: any) => {
        return result.insertId;
      }).catch(e =>{
        console.error('Erro ao inserir Inventario Movimentações',e);
        return -1;
      })
    }).catch(e => {
      console.error('Erro ao obter instancia do DB',e)
      return -1;
    })
  }

  public retornaRegistros(banco: string, filtro: string) {
    var query = this.movimentacoesQuerySelect;
    query += filtro;
    return this.dbProvider.getDB(banco).then((dataBase: SQLiteObject) => {
      return dataBase.executeSql(query,[]).then((result: any) => {
        var movimentacoes = [];
        for(var i = 0; i < result.rows.length; i++) {
          movimentacoes.push(result.rows.item(i));
        }
        return movimentacoes;
      }).catch(e =>{
        console.error('Erro ao consultar Inventario Movimentações',e);
        return -1;
      })
    }).catch(e => {
      console.error('Erro ao obter instancia do DB',e)
      return -1;
    })
  }

  public retornaRegistrosSeAlterouFilial(banco: string, idPatrimonio: number) {
    return this.dbProvider.getDB(banco).then((dataBase: SQLiteObject) => {
      return dataBase.executeSql(this.movimentacoesQuerySeAlteradaFilial,[idPatrimonio]).then((result: any) => {
        var movimentacoes = [];
        for(var i = 0; i < result.rows.length; i++) {
          movimentacoes.push(result.rows.item(i));
        }
        return movimentacoes;
      }).catch(e =>{
        console.error('Erro ao consultar Inventario Movimentações',e);
        return -1;
      })
    }).catch(e => {
      console.error('Erro ao obter instancia do DB',e)
      return -1;
    })
  }

}
