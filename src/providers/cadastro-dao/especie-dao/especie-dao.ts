import { DatabaseProvider } from '../../database/database';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';

/*
  Generated class for the FilialDaoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class EspecieDaoProvider {

  private especieQueryUpdate = 'UPDATE tb_Especie SET nome = ?, status = ?, UsuarioPdaLogin = ?, dtAlteracao = ? WHERE codigo = ?'
  private especieQuerySelect = 'SELECT * FROM tb_Especie where id_grupo = ?';
  private propriedadeQuerySelect = `select PP.id,                                  
                                    PP.id_tipoDado, 
                                    PP.nome,  
                                    '' As Texto
                                    from tb_Propriedade PP  
                                    left join tb_DicionarioEspecie D on D.id_propriedade = PP.id  
                                    inner join tb_Especie E on E.id_grupo = D.id_grupo 
                                    where E.id = ?`;

  constructor(public http: HttpClient, public dbProvider: DatabaseProvider) { }

  buscaEspecie(banco: string, idGrupo: any) {
    return this.dbProvider.getDB(banco).then((dataBase: SQLiteObject) => {
      return dataBase.executeSql(this.especieQuerySelect,[idGrupo]).then((result: any) => {
        var filiais = [];
        for(var i = 0; i < result.rows.length; i++) {
          filiais.push(result.rows.item(i));
        }
        return filiais;
      }).catch(e => console.error('Erro ao consultar buscaCliente',e))
    }).catch(e => console.error('Erro ao obter instancia do DB',e))
  }

  buscaPropriedade(banco: string, idEspecie: any) {
    console.log('idEspecie: ',idEspecie);
    return this.dbProvider.getDB(banco).then((dataBase: SQLiteObject) => {
      return dataBase.executeSql(this.propriedadeQuerySelect,[idEspecie]).then((result: any) => {
        var propriedades = [];
        for(var i = 0; i < result.rows.length; i++) {
          propriedades.push(result.rows.item(i));
        }
        console.log('propriedade',propriedades);
        
        return propriedades;
      }).catch(e => console.error('Erro ao consultar buscaCliente',e))
    }).catch(e => console.error('Erro ao obter instancia do DB',e))
  }

  editarEspecie(banco: string, nome: string, status: number, nomeLogin: string, dtAlteracao: string, codigo: number) {
    return this.dbProvider.getDB(banco).then((dataBase: SQLiteObject) => {
      return dataBase.executeSql(this.especieQueryUpdate,[nome,status,nomeLogin,dtAlteracao,codigo]).then((result: any) => {
        return true;
      }).catch(e => {
        console.error('Erro ao consultar especieLocal',e)
        return false;
      })
    }).catch(e => {console.error('Erro ao obter instancia do DB',e)
      return false;
    })
  }

}
