import { Util } from './../../helper/Util';
import { SqlHelper } from '../../helper/sql-helper';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import * as Constants from './sql';
import * as ConstantsConfig from './sqlDbConfig';
import * as AppConstants from '../../app/app-constantes';
/*
  Generated class for the DatabaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DatabaseProvider {

  constructor(public sqlite: SQLite, public sqlHelper: SqlHelper) { }

  public createDatabase(banco: string) {
    return this.getDB(banco)
      .then(async (db: SQLiteObject) => {
        if(banco === AppConstants.dbConfigMobile) {
          await this.createTableBulk(db,ConstantsConfig.createTableConfig);
        }
        else {
          await this.createTableBulk(db,Constants.createTable);
        }
      })
      .catch(e => console.log('error: '+e));
  }

  public getDB(banco: string) {
    return this.sqlite.create({
      name: banco+'.db',
      location: 'default'
    });
  }

  pesquisaData(banco: string, campo:string) {
    return this.getDB(banco).then((db: SQLiteObject) => {
      return db.executeSql('SELECT '+campo+' as clientToServer FROM tb_ControleSyncOut ', [])
        .then((result: any) => {
          return result.rows.item(0);
      }).catch(e => console.error('Erro ao consultar tb_ControleSyncOut campo '+campo,e))
    }).catch(err => console.error('Erro ao obter instancia de DB',err))
  }

  pesquisaDataConfig(banco: string, campo:string) {
    return this.getDB(banco).then((db: SQLiteObject) => {
      return db.executeSql('SELECT '+campo+' as serverToClient FROM tb_ControleSyncIn ', [])
        .then((result: any) => {
          if(result.rows.item(0).serverToClient != undefined && result.rows.item(0).serverToClient != null)
            return result.rows.item(0).serverToClient;
          else
            return ''
      }).catch(e => console.error('Erro ao consultar CONFIG tb_ControleSyncIn campo '+ campo,e))
    }).catch(err => console.error('Erro ao obter instancia de DB',err))
  }

  pesquisaDataMobile(banco: string, campo:string) {
    return this.getDB(banco).then((db: SQLiteObject) => {
      return db.executeSql('SELECT '+campo+' as serverToClient FROM tb_ControleSyncIn ', [])
        .then((result: any) => {
          if(result.rows.item(0).serverToClient != undefined && result.rows.item(0).serverToClient != null)
            return result.rows.item(0).serverToClient;
          else
            return ''
      }).catch(e => console.error('Erro ao consultar tb_ControleSyncIn campo '+ campo,e))
    }).catch(err => console.error('Erro ao obter instancia de DB',err))
  }

  public insertDateTimeInicialOut(banco: string) {
    return this.getDB(banco).then(async (db: SQLiteObject) => {
      return db.executeSql('SELECT COUNT(id) as qtd FROM tb_ControleSyncOut WHERE tb_UsuarioEquipamento != ""', [])
        .then(async (result: any) => {
          if(result.rows.item(0).qtd === 0) {
            var dt = Util.modifyDate(new Date());
            return db.executeSql('INSERT INTO tb_ControleSyncOut (tb_FotoDoBem,tb_UsuarioEquipamento,tb_InventarioMovimentacoes,tb_AtributosDoBem,tb_Inventario,tb_Patrimonio,fotos,tb_ConfiguracoesEquipamento,tb_Filial,tb_Local,tb_CentroCusto,tb_CentroResponsabilidade) VALUES('+ dt +','+ dt +','+ dt +','+ dt +','+ dt +','+ dt +','+ dt +','+ dt +','+ dt +','+ dt +','+ dt +','+ dt +')', [])
            .then(() => {
              console.log('data inserida com sucesso');
            }).catch(e => console.error('Erro ao inserir data em clientToServer',e))
        }
      }).catch(e => console.error('Erro ao consultar tb_ControleSyncOut',e))
    }).catch(err => console.error('Erro ao obter instancia de DB',err))
  }

  public verificaConfigDb() {
    return this.getDB(AppConstants.dbConfigMobile).then(async (db: SQLiteObject) => {
      return db.executeSql('SELECT COUNT(1) as qtd FROM tb_UsuarioEquipamento ', [])
      .then(async (data: any) => {
        if(data.rows.item(0).qtd == 0){
          await this.insereNullSyncConfig()
        }
        return data.rows.item(0).qtd;
      }).catch(e => console.error('Erro ao consultar tb_UsuarioEquipamento',e))
    }).catch(err => console.error('Erro ao obter instancia de DB',err))
  }

  public verificaMobileDb(banco: string) {
    return this.getDB(banco).then(async (db: SQLiteObject) => {
      return db.executeSql('SELECT COUNT(1) as qtd FROM tb_ControleSyncIn WHERE tb_Filial is not null', [])
        .then(async (data: any) => {
          if(data.rows.item(0).qtd == 0){
            await this.insereNullSync(banco)
          }
          return data.rows.item(0).qtd;
        })
        .catch(e => console.error('Erro ao consultar tb_ControleSyncIn',e));
      }).catch(err => console.error('Erro ao obter instancia de DB',err))
  }

  public insereNullSync(banco: string) {
    return this.getDB(banco).then(async (db: SQLiteObject) => {
      return db.executeSql('INSERT INTO tb_ControleSyncIn VALUES(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null)', [])
        .then(() => {})
        .catch(e => console.error('Erro ao inserir null em tb_ControleSyncIn',e));
      }).catch(err => console.error('Erro ao obter instancia de DB',err))
  }

  public insereNullSyncConfig() {
    return this.getDB(AppConstants.dbConfigMobile).then(async (db: SQLiteObject) => {
      return db.executeSql('INSERT INTO tb_ControleSyncIn VALUES(null,null,null,null,null,null,null,null,null)', [])
        .then(() => {})
        .catch(e => console.error('Erro ao inserir null em tb_ControleSyncIn CONFIG',e));
      }).catch(err => console.error('Erro ao obter instancia de DB',err))
  }
  
  private createTableBulk(db: SQLiteObject, tabelas: string[]){
    return db.sqlBatch(tabelas)
      .catch(e => {
        alert('Erro ao criar tabelas !');
        console.error('Erro ao criar bulk de tabelas', e)
    });
  }

  public closeConnection(banco: string) {
    return this.getDB(banco).then((db: SQLiteObject) => {
      return db.close().then(() => {
          console.log('Conexao encerada');
        }).catch(e => console.error('Problemas ao encerar a conexão', e))
    }).catch(err => console.error('Erro ao obter instancia de DB',err))
  }

  public queryGenerica(db: SQLiteObject, tabela:string, dados: any[] ) {
    var query = this.sqlHelper.buildInsert(tabela,dados);
    db.executeSql(query,[])
      .then(() => {
        console.log('Query executada com sucesso.');
      })
      .catch(e => console.error('Erro ao executar query: ',e));
  }

  public async existeNoBancoLocal(db: SQLiteObject, tabela: string, valor: string, campo: string) {
    return new Promise((resolve, reject) => {  
    db.executeSql('SELECT COUNT(id) as result FROM '+tabela+' WHERE '+campo+' = '+'\''+valor+'\'' +' LIMIT 1',[]).then((data: any) => {
        resolve(data.rows.item(0).result)
      })
      .catch(err => {console.error('Erro na consulta de linha tabela',err)});
    });
  }

  public async existePatrimonioNoBancoLocal(db: SQLiteObject, idFilial: string, codigo: string, incorporacao: string) {
    return new Promise((resolve, reject) => {  
    db.executeSql('SELECT Patrimonio.id as result FROM tb_Patrimonio as Patrimonio'
                  +' INNER JOIN tb_Filial as Filial on Patrimonio.id_Filial = Filial.id'
                  +' WHERE Patrimonio.codigo = ? AND Patrimonio.incorporacao = ? AND Filial.id = ?'
                ,[codigo, incorporacao, idFilial]).then((data: any) => {
        if(data.rows.length == 0) {
          resolve(0)
        } else {
          resolve(data.rows.item(0).result)
        }
      })
      .catch(err => {console.error('Erro na consulta de linha tabela tb_Patrimonio',err)});
    });
  }

  public async existePropriedadeNoBancoLocal(db: SQLiteObject, idPatrimonio: number, idPropriedade: string) {
    return new Promise((resolve, reject) => {  
    db.executeSql('SELECT id as result FROM tb_AtributosDoBem WHERE id_patrimonio = ? AND id_propriedade = ?'
                ,[idPatrimonio, idPropriedade]).then((data: any) => {
        if(data.rows.length == 0) {
          resolve(0)
        } else {
          resolve(data.rows.item(0).result)
        }
      })
      .catch(err => {console.error('Erro na consulta de linha tabela tb_Patrimonio',err)});
    });
  }

  public async existeInventarioNoBancoLocal(db: SQLiteObject, dataGravacao: string, idPatrimonio: string) {
    let dataModificada = dataGravacao.replace(/\'/g,"")
    return new Promise((resolve, reject) => {  
    db.executeSql('SELECT id as result FROM tb_Inventario WHERE dtInsercao = ? AND id_patrimonio = ?'
                ,[dataModificada, idPatrimonio]).then((data: any) => {
        if(data.rows.length == 0) {
          resolve(0)
        } else {
          resolve(data.rows.item(0).result)
        }
      })
      .catch(err => {console.error('Erro na consulta de linha tabela tb_Patrimonio',err)});
    });
  }

  public gravarDataControleSyncIn(campo: string, db: SQLiteObject, data: string) {
    return db.executeSql('UPDATE tb_ControleSyncIn SET '+ campo + ' = ' + data,[])
      .then(() => {
        console.log('tb_ControleSyncIn Data atualizada com sucesso campo: ' + campo + ' data: '+ data);
      }).catch(e => console.error('Erro ao inserir dado em tb_ControleSyncIn campo: ' + campo + ' data: '+ data,e));
  }

  public gravarDataControleSyncOut(campo: string, db: SQLiteObject, data: string) {
    return db.executeSql('UPDATE tb_ControleSyncOut SET '+ campo + ' = ' + data,[])
      .then(() => {
        console.log('tb_ControleSyncOut Data atualizada com sucesso campo: ' + campo + ' data: '+ data);
      }).catch(e => console.error('Erro ao inserir dado em tb_ControleSyncOut campo: ' + campo + ' data: '+ data,e));
  }

  public deleteDatabase(banco: string) {
    this.sqlite.deleteDatabase({
      name: banco+'.db',
      location: 'default'
    }).then((data) => {
      console.log('DROP DE' + banco+' COM SUCESSO.');
    })
    .catch(e => console.error('Erro ao excluir banco de dados', e));
  }


}
