import { Injectable } from '@angular/core';
import { DatabaseProvider } from '../database/database';
import { FotoDoBem } from '../../modelos/FotoDoBem';
import { SQLiteObject } from '@ionic-native/sqlite';

/*
  Generated class for the FotosDaoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
const fotoSincronizada = 1;

@Injectable()
export class FotosDaoProvider {

  private fotosQueryInsert = `INSERT INTO tb_FotoDoBem (codigoFilial,codigoPatrimonio,incorporacao,nomeFoto,dtInsercao,syncToServer) VALUES (?,?,?,?,?,?) `;
  private fotosQuerySelectRegistros = `SELECT nomeFoto FROM tb_FotoDoBem WHERE codigoPatrimonio = ? ORDER BY nomeFoto`;
  private fotosQueryUpdate = `UPDATE tb_FotoDoBem SET dtInsercao = ?,syncToServer = 0 WHERE nomeFoto = ?`
  private fotosQueryUpdateSync = `UPDATE tb_FotoDoBem SET syncToServer = ? WHERE nomeFoto = ?`
  private fotosQuerySelectRegistrosPorData = `SELECT nomeFoto FROM tb_FotoDoBem WHERE dtInsercao >= ? AND syncToServer = 0 ORDER BY nomeFoto`;

  constructor(public dbProvider: DatabaseProvider) { }

  public inserirRegistro(banco: string, fotoDoBem: FotoDoBem) {
    var arrayDados = fotoDoBem.getAtributosToArray();
    return this.dbProvider.getDB(banco).then((dataBase: SQLiteObject) => {
      return dataBase.executeSql(this.fotosQueryInsert, arrayDados).then((result: any) => {
        return result.insertId;
      }).catch(e =>{
        console.error('Erro ao inserir Foto do Bem',e);
        return -1;
      })
    }).catch(e => {
      console.error('Erro ao obter instancia do DB',e)
      return -1;
    })
  }

  public alterarRegistro(banco: string, fotoDoBem: FotoDoBem) {
    return this.dbProvider.getDB(banco).then((dataBase: SQLiteObject) => {
      return dataBase.executeSql(this.fotosQueryUpdate, [fotoDoBem.dtInsercao, fotoDoBem.nomeFoto]).then((result: any) => {
        return 1;
      }).catch(e =>{
        console.error('Erro ao inserir Foto do Bem',e);
        return -1;
      })
    }).catch(e => {
      console.error('Erro ao obter instancia do DB',e)
      return -1;
    })
  }
  public alterarRegistroSync(banco: string, fotoDoBem: string) {
    return this.dbProvider.getDB(banco).then((dataBase: SQLiteObject) => {
      return dataBase.executeSql(this.fotosQueryUpdateSync, [fotoSincronizada, fotoDoBem]).then((result: any) => {
        return 1;
      }).catch(e =>{
        console.error('Erro ao inserir Foto do Bem',e);
        return -1;
      })
    }).catch(e => {
      console.error('Erro ao obter instancia do DB',e)
      return -1;
    })
  }

  public retornaRegistros(banco: string, codigoPatrimonio: string) {
    //var sql = this.fotosQuerySelectRegistros + "'"+codigoPatrimonio+"'";
    return this.dbProvider.getDB(banco).then((dataBase: SQLiteObject) => {
      return dataBase.executeSql(this.fotosQuerySelectRegistros, [codigoPatrimonio]).then((result: any) => {
        var fotos = [];
        for(var i = 0; i < result.rows.length; i++) {
          fotos.push(result.rows.item(i).nomeFoto);
        }
        return fotos;
      }).catch(e => console.error('Erro ao consultar Foto do Bem',e))
    }).catch(e => console.error('Erro ao obter instancia do DB',e))
  }

  public retornaRegistrosPorData(banco: string, data: string) {
    //var sql = this.fotosQuerySelectRegistros + "'"+codigoPatrimonio+"'";
    return this.dbProvider.getDB(banco).then((dataBase: SQLiteObject) => {
      return dataBase.executeSql(this.fotosQuerySelectRegistrosPorData, [data]).then((result: any) => {
        var fotos = [];
        for(var i = 0; i < result.rows.length; i++) {
          fotos.push(result.rows.item(i).nomeFoto);
        }
        return fotos;
      }).catch(e => console.error('Erro ao consultar Foto do Bem',e))
    }).catch(e => console.error('Erro ao obter instancia do DB',e))
  }

}
