import { DatabaseProvider } from './../database/database';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import { Patrimonio } from '../../modelos/Patrimonio';

/*
  Generated class for the PatrimonioDaoProvider provider.

  See https:angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PatrimonioDaoProvider {

  private patrimonioQuerySelect = 'SELECT Patrimonio.id,'
                                    +'Patrimonio.id_Filial AS idFilial,'
                                    +'Filial.codigo AS CodigoFilial,'
                                    +'Filial.nome AS Filial,'
                                    +'Patrimonio.id_Especie AS idEspecie,'
                                    +'Especie.codigo AS CodigoEspecie,'
                                    +'Especie.nome AS Especie,'
                                    +'Especie.id_grupo,'
                                    +'GrupoDeEspecie.codigo AS CodigoGrupo,'
                                    +'GrupoDeEspecie.nome AS Grupo,'
                                    +'Patrimonio.id_Condicao AS idCondicao,'
                                    +'CondicaoDeUso.codigo AS CodigoCondicao,'
                                    +'CondicaoDeUso.nome AS Condicao,'
                                    +'Patrimonio.id_Responsavel AS idResponsavel,'
                                    +'CentroDeResponsabilidade.codigo AS CodigoResponsavel,'
                                    +'CentroDeResponsabilidade.nome AS Responsavel,'
                                    +'Patrimonio.id_CentroCusto AS idCentroCusto,'
                                    +'CentroDeCusto.codigo AS CodigoCentroDeCusto,'
                                    +'CentroDeCusto.nome AS CentroDeCusto,'
                                    +'Patrimonio.id_Local AS idLocal,'
                                    +'Local.codigo AS CodigoLocal,'
                                    +'Local.nome AS Local,'
                                    +'Patrimonio.codigo,'
                                    +'Patrimonio.codigoAnterior,'
                                    +'Patrimonio.incorporacao,'
                                    +'Patrimonio.incorporacaoAnterior,'
                                    +'Patrimonio.descricao,'
                                    +'Patrimonio.serie,'
                                    +'Patrimonio.observacao,'
                                    +'Patrimonio.tag,'
                                    +'AUX1 AS aux1,'
                                    +'AUX2 AS aux2,'
                                    +'AUX3 AS aux3,'
                                    +'AUX4 AS aux4,'
                                    +'AUX5 AS aux5,'    
                                    +'AUX6 AS aux6,'     
                                    +'AUX7 AS aux7,'     
                                    +'AUX8 AS aux8,'   
                                    +'Patrimonio.status,'
                                    +'latitude,'                     
                                    +'longitude,'                     
                                    +'altitude,'
                                    +'Patrimonio.seq,'
                                    +'Patrimonio.gravado,'
                                    +'Patrimonio.numeroFicticio,'
                                    +'Patrimonio.id_linkEspecieMarca,'
                                    +'Patrimonio.id_linkEspecieMarcaModelo,'
                                    +'Marca.codigo AS CodigoMarca,'
                                    +'Patrimonio.marca,'
                                    +'Modelo.codigo AS CodigoModelo,'
                                    +'Patrimonio.modelo'
                                    +' FROM tb_Patrimonio as Patrimonio'
                                    +' INNER JOIN tb_Filial as Filial on Patrimonio.id_Filial = Filial.id'
                                    +' INNER JOIN tb_Especie as Especie on Patrimonio.id_Especie = Especie.id'
                                    +' LEFT JOIN tb_LinkEspecieMarca as LinkEspecieMarca ON LinkEspecieMarca.id = Patrimonio.id_linkEspecieMarca'
                                    +' LEFT JOIN tb_Marca as Marca ON Marca.id = LinkEspecieMarca.id_Marca'
                                    +' LEFT JOIN tb_LinkEspecieMarcaModelo as LinkEspecieMarcaModelo ON LinkEspecieMarcaModelo.id = Patrimonio.id_linkEspecieMarcaModelo'
                                    +' LEFT JOIN tb_Modelo as Modelo ON Modelo.id = LinkEspecieMarcaModelo.id_Modelo'
                                    +' LEFT JOIN tb_Grupo as GrupoDeEspecie on GrupoDeEspecie.id = Especie.id_Grupo'
                                    +' LEFT JOIN tb_CondicaoUso as CondicaoDeUso ON Patrimonio.id_Condicao = CondicaoDeUso.id'
                                    +' LEFT JOIN tb_CentroResponsabilidade as CentroDeResponsabilidade ON CentroDeResponsabilidade.id = Patrimonio.id_Responsavel'
                                    +' LEFT JOIN tb_CentroCusto as CentroDeCusto ON CentroDeCusto.id = Patrimonio.id_CentroCusto'
                                    +' LEFT JOIN tb_Local as Local ON Local.id = Patrimonio.id_Local';
                                    //+' WHERE Patrimonio.codigo = ?';

  private patrimonioQueryUpdate = `UPDATE tb_Patrimonio SET id_Filial = ?,
                                      id_Especie = ?,
                                      id_Condicao = ?,
                                      id_Responsavel = ?,
                                      id_CentroCusto = ?,
                                      id_Local = ?,
                                      codigoAnterior = ?,
                                      incorporacaoAnterior = ?,
                                      descricao = ?,
                                      serie = ?,
                                      observacao = ?,
                                      AUX1 = ?,
                                      AUX2 = ?,
                                      AUX3 = ?,
                                      AUX4 = ?,
                                      AUX5 = ?,
                                      AUX6 = ?,
                                      AUX7 = ?,
                                      AUX8 = ?,
                                      tag = ?,
                                      status = ?,
                                      latitude = ?,
                                      longitude = ?,
                                      altitude = ?,
                                      numeroFicticio = ?,
                                      id_linkEspecieMarca = ?,
                                      id_linkEspecieMarcaModelo = ?,
                                      marca = ?,
                                      modelo = ?,
                                      dtAlteracao = ?,
                                      ultimoUsuario = ?
                                    WHERE id = ?`;

  private patrimonioQueryInsert = `INSERT INTO tb_Patrimonio (id_Filial,id_Especie,id_Condicao,id_Responsavel,id_CentroCusto,id_Local,codigo,
                                    codigoAnterior,incorporacao,incorporacaoAnterior,descricao,serie,observacao,
                                    tag,AUX1,AUX2,AUX3,AUX4,AUX5,AUX6,AUX7,AUX8,status,latitude,longitude,altitude,
                                    seq,gravado,numeroFicticio,id_linkEspecieMarca,id_linkEspecieMarcaModelo,marca,modelo,dtAlteracao,ultimoUsuario) 
                                    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`                                  
  
  private patrimonioQueryUltimoFicticio = `SELECT MAX(Codigo) AS ultimoEncontrado FROM tb_Patrimonio WHERE Codigo LIKE '%F'`;
  
  private patrimonioQueryPlaquetas = `SELECT DISTINCT codigo FROM tb_Patrimonio WHERE codigo = ?`;

  private patrimonioQueryBensNoIntervalo = `SELECT COUNT(*) as qtd FROM tb_Patrimonio WHERE id_filial = ? AND incorporacao = ? AND `;
  
  constructor(public http: HttpClient, public dbProvider: DatabaseProvider) { }

  buscaPatrimonio(banco: string, filtro: string) {
    var query = this.patrimonioQuerySelect;
    if(filtro != "") {
      query += filtro;
      query += " LIMIT 100"
    }
    return this.dbProvider.getDB(banco).then((dataBase: SQLiteObject) => {
      return dataBase.executeSql(query,[]).then((result: any) => {
        var resposta: any[]=[];
        if(result.rows.length == 1){
          return result.rows.item(0);
        }else{
          for (let i = 0; i < result.rows.length; i++) {
            resposta.push(result.rows.item(i))
          }
          if(result.rows.length == 0){
            resposta = undefined;
          }
          return resposta;
        }
      }).catch(e => console.error('Erro ao consultar buscaPatrimonio',e))
    }).catch(e => console.error('Erro ao obter instancia do DB',e))
  }

  inserirPatrimonio(banco: string, patrimonio: Patrimonio) {
    var arrayDados = patrimonio.getAtributosToArray();
    return this.dbProvider.getDB(banco).then((dataBase: SQLiteObject) => {
      return dataBase.executeSql(this.patrimonioQueryInsert,arrayDados).then((result: any) => {
        return result.insertId;
      }).catch(e =>{
        console.error('Erro ao inserir Patrimonio',e);
        return -1;
      })
    }).catch(e => {
      console.error('Erro ao obter instancia do DB',e)
      return -1;
    })
  }

  alterarPatrimonio(banco: string, patrimonio: Patrimonio) {
    var arrayDados = patrimonio.getAtributosUpdateToArray();
    return this.dbProvider.getDB(banco).then((dataBase: SQLiteObject) => {
      return dataBase.executeSql(this.patrimonioQueryUpdate,arrayDados).then((result: any) => {
        return 1
      }).catch(e =>{
        console.error('Erro ao atualizar Patrimonio',e);
        return -1;
      })
    }).catch(e => {
      console.error('Erro ao obter instancia do DB',e)
      return -1;
    })
  }

  retornaUltimoFicticioEncontradoPatrimonio(banco: string) {
    return this.dbProvider.getDB(banco).then((dataBase: SQLiteObject) => {
      return dataBase.executeSql(this.patrimonioQueryUltimoFicticio,[]).then((result: any) => {
        return result.rows.item(0).ultimoEncontrado;
      }).catch(e =>{
        console.error('Erro ao consultar ultimo ficticio do Patrimonio',e);
        return -1;
      })
    }).catch(e => {
      console.error('Erro ao obter instancia do DB',e)
      return -1;
    })
  }

  retornaPlaquetas(banco: string, codigoConsulta: string) {
    return this.dbProvider.getDB(banco).then((dataBase: SQLiteObject) => {
      return dataBase.executeSql(this.patrimonioQueryPlaquetas,[codigoConsulta]).then((result: any) => {
        return result.rows.item(0);
      }).catch(e =>{
        console.error('Erro ao consultar plaquetas',e);
        return -1;
      })
    }).catch(e => {
      console.error('Erro ao obter instancia do DB',e)
      return -1;
    })
  }

  retornaTotalBensNoIntervalo(banco: string, idFilial: number, incorporacao: number, filtro: string) {
    var query = this.patrimonioQueryBensNoIntervalo;
    query += filtro;
    return this.dbProvider.getDB(banco).then((dataBase: SQLiteObject) => {
      return dataBase.executeSql(query,[idFilial,incorporacao]).then((result: any) => {
        return result.rows.item(0).qtd;
      }).catch(e =>{
        console.error('Erro ao consultar bens no intervalo',e);
        return -1;
      })
    }).catch(e => {
      console.error('Erro ao obter instancia do DB',e)
      return -1;
    })
  }

}
