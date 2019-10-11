import { Injectable } from '@angular/core';
import { DatabaseProvider } from '../database/database';
import { AtributoDoBem } from '../../modelos/AtributoDoBem';
import { SQLiteObject } from '@ionic-native/sqlite';

/*
  Generated class for the AtributosDoBemDaoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AtributosDoBemDaoProvider {

  private atributosDoBemQueryInsert = `INSERT INTO tb_AtributosDoBem (id_patrimonio,id_propriedade,texto,dtInsercao) VALUES (?,?,?,?)`;
  private atributosDoBemQueryBuscaPorPatrimonio = `SELECT A.id_patrimonio, 
                                                          A.id_propriedade, 
                                                          A.texto,                                      
                                                          PP.id_tipoDado,  
                                                          PP.nome
                                                    FROM tb_AtributosDoBem A  
                                                    INNER JOIN tb_Propriedade PP on PP.id = A.id_propriedade WHERE A.id_patrimonio = ?`;
  private atributosDoBemQueryBuscaPorEspecie = `select PP.id as id_propriedade,                                  
                                                  PP.id_tipoDado, 
                                                  PP.nome,  
                                                  '' As texto
                                                FROM tb_Propriedade PP  
                                                LEFT JOIN tb_DicionarioEspecie D on D.id_propriedade = PP.id  
                                                INNER JOIN tb_Especie E on E.id_grupo = D.id_grupo 
                                                WHERE E.id = ? ORDER BY PP.id_tipoDado DESC, PP.nome ASC`;
  private atributosDoBemQueryDelete = `DELETE FROM tb_AtributosDoBem WHERE id_patrimonio = ?`;
  private atributosDoBemQueryUpdateIdPatrimonio = `UPDATE tb_AtributosDoBem SET id_patrimonio = ? WHERE id_patrimonio = ?`;

  constructor(public dbProvider: DatabaseProvider) { }

  public inserirRegistro(banco: string, atributosDoBem: AtributoDoBem) {
    var arrayDados = atributosDoBem.getAtributosToArray();
    return this.dbProvider.getDB(banco).then((dataBase: SQLiteObject) => {
      return dataBase.executeSql(this.atributosDoBemQueryInsert,arrayDados).then((result: any) => {
        return result.insertId;
      }).catch(e =>{
        console.error('Erro ao inserir AtributosDobem',e);
        return -1;
      })
    }).catch(e => {
      console.error('Erro ao obter instancia do DB',e)
      return -1;
    })
  }

  public buscaAtributosDoBemPorPatrimonio(banco: string, idPatrimonio: number) {
    return this.dbProvider.getDB(banco).then((dataBase: SQLiteObject) => {
      return dataBase.executeSql(this.atributosDoBemQueryBuscaPorPatrimonio,[idPatrimonio]).then((result: any) => {
        var listAtributos: AtributoDoBem[] = [];
        for(var i = 0; i < result.rows.length; i++) {
          var atributos: AtributoDoBem = new AtributoDoBem();
          atributos.id_patrimonio = result.rows.item(i).id_patrimonio;
          atributos.id_propriedade = result.rows.item(i).id_propriedade;
          atributos.idTipoDeDado = result.rows.item(i).id_tipoDado;
          atributos.nome = result.rows.item(i).nome;
          atributos.texto = result.rows.item(i).texto;
          listAtributos.push(result.rows.item(i));
        }
        return listAtributos;
      }).catch(e =>{
        console.error('Erro ao buscar Atributo do bem por Patrimonio',e);
        return -1;
      })
    }).catch(e => {
      console.error('Erro ao obter instancia do DB',e)
      return -1;
    })
  }

  public buscaAtributosDoBemPorEspecie(banco: string, idEspecie: number) {
    return this.dbProvider.getDB(banco).then((dataBase: SQLiteObject) => {
      return dataBase.executeSql(this.atributosDoBemQueryBuscaPorEspecie,[idEspecie]).then((result: any) => {
        var listAtributos: AtributoDoBem[] = [];
        for(var i = 0; i < result.rows.length; i++) {
          var atributos: AtributoDoBem = new AtributoDoBem();
          atributos.id_patrimonio = result.rows.item(i).id_patrimonio;
          atributos.id_propriedade = result.rows.item(i).id_propriedade;
          atributos.idTipoDeDado = result.rows.item(i).id_tipoDado;
          atributos.nome = result.rows.item(i).nome;
          atributos.texto = result.rows.item(i).texto;
          listAtributos.push(result.rows.item(i));
        }
        return listAtributos;
      }).catch(e =>{
        console.error('Erro ao buscar Atributo do bem por Especie',e);
        return -1;
      })
    }).catch(e => {
      console.error('Erro ao obter instancia do DB',e)
      return -1;
    })
  }

  public excluirRegistros(banco: string, idPatrimonio: number) {
    return this.dbProvider.getDB(banco).then((dataBase: SQLiteObject) => {
      return dataBase.executeSql(this.atributosDoBemQueryDelete,[idPatrimonio]).then((result: any) => {
        return 1;
      }).catch(e =>{
        console.error('Erro ao excluir AtributosDobem',e);
        return -1;
      })
    }).catch(e => {
      console.error('Erro ao obter instancia do DB',e)
      return -1;
    })
  }

  public alterarIdPatrimonio(banco: string, idPatrimonio: number, idPatrimonioWhere: number) {
    return this.dbProvider.getDB(banco).then((dataBase: SQLiteObject) => {
      return dataBase.executeSql(this.atributosDoBemQueryUpdateIdPatrimonio,[idPatrimonio,idPatrimonioWhere]).then((result: any) => {
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

}
