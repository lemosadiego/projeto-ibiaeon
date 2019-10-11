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
export class PatrimoniosDaoProvider {

  private patrimonioQueryUpdate = 'UPDATE tb_Patrimonio SET nome = ?, status = ?, UsuarioPdaLogin = ?, dtAlteracao = ? WHERE codigo = ?'
  private patrimonioQuerySelect = 'SELECT * FROM tb_Patrimonio';
  private patrimonioQuerySelectNaoEncontrado = 'SELECT GrupoDeEspecie.nome AS Grupo,'
  + ' Especie.id_grupo,'
  + ' count(*) as qtde'
  + ' FROM tb_Patrimonio as Patrimonio'
  + ' INNER JOIN tb_Especie as Especie on Patrimonio.id_Especie = Especie.id'
  + ' LEFT JOIN tb_Grupo as GrupoDeEspecie on GrupoDeEspecie.id = Especie.id_Grupo'
  + ' LEFT JOIN tb_Local as Local ON Local.id = Patrimonio.id_Local'
  + ' WHERE Patrimonio.STATUS != ? and Patrimonio.STATUS != ? and Patrimonio.id_Local = ?'
  + ' group by GrupoDeEspecie.nome, Especie.id_grupo';
  private queryTeste = 'SELECT status FROM tb_Patrimonio where status = "R"';
  private patrimonioQuerySelectLocal = 'SELECT count(*) as qtde'
    + ' FROM tb_Patrimonio as Patrimonio'
    + ' WHERE Patrimonio.id_Local = ?';
  private patrimonioQuerySelectEtiquetaLocalEscolhido = 'SELECT GrupoDeEspecie.nome AS Grupo,'
    + 'Especie.id_grupo,'
    + 'Patrimonio.Codigo,'
    + 'Especie.Nome,'
    + 'Patrimonio.STATUS,'
    + 'count(*) as qtde'
    + ' FROM tb_Patrimonio as Patrimonio'
    + ' INNER JOIN tb_Especie as Especie on Patrimonio.id_Especie = Especie.id'
    + ' LEFT JOIN tb_Grupo as GrupoDeEspecie on GrupoDeEspecie.id = Especie.id_Grupo'
    + ' LEFT JOIN tb_Local as Local ON Local.id = Patrimonio.id_Local'
    + ' WHERE Patrimonio.Codigo = ? and Patrimonio.id_Local = ?'
    + ' group by GrupoDeEspecie.nome, Especie.id_grupo,Patrimonio.Codigo,Patrimonio.STATUS,Especie.Nome';
    private patrimonioQuerySelectEtiquetaEmLocais = 'SELECT GrupoDeEspecie.nome AS NomeGrupo,'
    + 'Especie.id_grupo,'
    + 'Patrimonio.Codigo,'
    + 'Patrimonio.STATUS,'
    + 'Patrimonio.Marca,'
    + 'Especie.Nome,'
    + 'Local.Nome as NomeLocal,'
    + 'count(*) as qtde'
    + ' FROM tb_Patrimonio as Patrimonio'
    + ' INNER JOIN tb_Especie as Especie on Patrimonio.id_Especie = Especie.id'
    + ' LEFT JOIN tb_Grupo as GrupoDeEspecie on GrupoDeEspecie.id = Especie.id_Grupo'
    + ' LEFT JOIN tb_Local as Local ON Local.id = Patrimonio.id_Local'
    + ' WHERE Patrimonio.Codigo = ? and Patrimonio.id_Local != ? '
    + ' group by GrupoDeEspecie.nome, Especie.id_grupo, Patrimonio.Codigo, Patrimonio.STATUS, Local.Nome, Patrimonio.Marca, Especie.Nome';
  private patrimonioQueryTabelaResultado = 'INSERT INTO tb_resultado_buscas(NomeGrupo, idGrupo, qtde)'
    + ' SELECT GrupoDeEspecie.nome AS Grupo,'
    + ' Especie.id_grupo,'
    + ' count(*) as qtde'
    + ' FROM tb_Patrimonio as Patrimonio'
    + ' INNER JOIN tb_Especie as Especie on Patrimonio.id_Especie = Especie.id'
    + ' LEFT JOIN tb_Grupo as GrupoDeEspecie on GrupoDeEspecie.id = Especie.id_Grupo'
    + ' LEFT JOIN tb_Local as Local ON Local.id = Patrimonio.id_Local'
    + ' WHERE Patrimonio.id_Local = ?'
    + ' group by GrupoDeEspecie.nome, Especie.id_grupo';
  private testeCriaTabela = ['CREATE TABLE IF NOT EXISTS tb_resultado_buscas(NomeGrupo nvarchar(60),'
    + 'idGrupo INTEGER,'
    + 'qtde INTEGER,'
    + 'qtde_encontrado INTEGER)'];

  private patrimonioQueryAtualizaTabelaTemporaria = 'SELECT * FROM tb_resultado_buscas';
  private dropQuery = 'DELETE FROM tb_resultado_buscas';
  private updateEtiquetaRevisada = 'UPDATE tb_Patrimonio SET status = ? WHERE codigo = ?';
  private queryBuscaEtiquetaNaoEncontrada = 'select Especie.Nome, Patrimonio.Codigo from tb_Patrimonio as Patrimonio'
    + ' INNER JOIN tb_Especie as Especie on Patrimonio.id_Especie = Especie.id'
    + ' LEFT JOIN tb_Grupo as GrupoDeEspecie on GrupoDeEspecie.id = Especie.id_Grupo'
    + ' where Patrimonio.id_Local = ? and GrupoDeEspecie.ID = ? and Patrimonio.STATUS = "?"';



  constructor(public http: HttpClient, public dbProvider: DatabaseProvider) { }
  
  buscaPatrimonio(banco: string) {
    return this.dbProvider.getDB(banco).then((dataBase: SQLiteObject) => {
      return dataBase.executeSql(this.patrimonioQuerySelect, []).then((result: any) => {
        var filiais = [];
        for (var i = 0; i < result.rows.length; i++) {
          filiais.push(result.rows.item(i));
        }
        return filiais;
      }).catch(e => console.error('Erro buscaPatrimonio', e))
    }).catch(e => console.error('Erro ao obter instancia do DB', e))
  }
  buscaPatrimonioNaoEncontrado(banco: string, local) {
    return this.dbProvider.getDB(banco).then((dataBase: SQLiteObject) => {
      return dataBase.executeSql(this.patrimonioQuerySelectNaoEncontrado, ['R', 'I', local]).then((result: any) => {
        var filiais = [];
        for (var i = 0; i < result.rows.length; i++) {
          filiais.push(result.rows.item(i));
        }
        return filiais;
      }).catch(e => console.error('Erro buscaPatrimonioNaoEncontrado', e))
    }).catch(e => console.error('Erro ao obter instancia do DB', e))
  }

  editarPatrimonio(banco: string, nome: string, status: number, nomeLogin: string, dtAlteracao: string, codigo: number) {
    return this.dbProvider.getDB(banco).then((dataBase: SQLiteObject) => {
      return dataBase.executeSql(this.patrimonioQueryUpdate, [nome, status, nomeLogin, dtAlteracao, codigo]).then((result: any) => {
        return true;
      }).catch(e => {
        console.error('Erro ao consultar editarResponsaveis', e)
        return false;
      })
    }).catch(e => {
      console.error('Erro ao obter instancia do DB', e)
      return false;
    })
  }

  buscaPatrimonioPorLocal(banco: string, idLocal) {
    return this.dbProvider.getDB(banco).then((dataBase: SQLiteObject) => {
      return dataBase.executeSql(this.patrimonioQuerySelectLocal, [idLocal]).then((result: any) => {
        var filiais = [];
        for (var i = 0; i < result.rows.length; i++) {
          filiais.push(result.rows.item(i));
        }
        return filiais;
      }).catch(e => console.error('Erro buscaPatrimonioPorLocal', e))
    }).catch(e => console.error('Erro ao obter instancia do DB', e))
  }
  testeDeQuery(banco: string) {
    return this.dbProvider.getDB(banco).then((dataBase: SQLiteObject) => {
      return dataBase.executeSql(this.queryTeste, []).then((result: any) => {
        var filiais = [];
        for (var i = 0; i < result.rows.length; i++) {
          filiais.push(result.rows.item(i));
        }
        return filiais;
      }).catch(e => console.error('Erro testeDeQuery', e))
    }).catch(e => console.error('Erro ao obter instancia do DB', e))
  }

  buscaPatrimonioPorEtiquetaLocalEscolhido(banco: string, etiqueta, local) {
    return this.dbProvider.getDB(banco).then((dataBase: SQLiteObject) => {
      return dataBase.executeSql(this.patrimonioQuerySelectEtiquetaLocalEscolhido, [etiqueta, local]).then((result: any) => {
        var filiais = [];
        for (var i = 0; i < result.rows.length; i++) {
          filiais.push(result.rows.item(i));
        }
        return filiais;
      }).catch(e => console.error('Erro buscaPatrimonioPorEtiquetaLocalEscolhido', e))
    }).catch(e => console.error('Erro ao obter instancia do DB', e))
  }
  buscaPatrimonioPorEtiquetaEmLocais(banco: string, etiqueta, local) {
    return this.dbProvider.getDB(banco).then((dataBase: SQLiteObject) => {
      return dataBase.executeSql(this.patrimonioQuerySelectEtiquetaEmLocais, [etiqueta, local]).then((result: any) => {
        var filiais = [];
        for (var i = 0; i < result.rows.length; i++) {
          filiais.push(result.rows.item(i));
        }
        return filiais;
       }).catch(e => console.error('Erro buscaPatrimonioPorEtiquetaEmLocais', e))
    }).catch(e => console.error('Erro ao obter instancia do DB', e))
  }
  CriaTabelaResultado(banco: string) {
    return this.dbProvider.getDB(banco).then((dataBase: SQLiteObject) => {
      return dataBase.sqlBatch(this.testeCriaTabela).then((result: any) => {
        console.log('tabela adicionada');

      }).catch(e => console.error('Erro CriaTabelaResultado', e))
    }).catch(e => console.error('Erro ao obter instancia do DB', e))
  }


  atualizaNaTabelaTemporaria(banco: string, idLocal) {
    return this.dbProvider.getDB(banco).then((dataBase: SQLiteObject) => {
      return dataBase.executeSql(this.patrimonioQueryTabelaResultado, [idLocal]).then((result: any) => {
        var filiais = [];
        for (var i = 0; i < result.rows.length; i++) {
          filiais.push(result.rows.item(i));
        }
        return filiais;
      }).catch(e => console.error('Erro atualizaNaTabelaTemporaria', e))
    }).catch(e => console.error('Erro ao obter instancia do DB', e))
  }
  selectAll(banco: string) {
    return this.dbProvider.getDB(banco).then((dataBase: SQLiteObject) => {
      return dataBase.executeSql(this.patrimonioQueryAtualizaTabelaTemporaria, []).then((result: any) => {
        var filiais = [];
        for (var i = 0; i < result.rows.length; i++) {
          filiais.push(result.rows.item(i));
        }
        return filiais;
      }).catch(e => console.error('Erro selectAll', e))
    }).catch(e => console.error('Erro ao obter instancia do DB', e))
  }
  detalhesEtiquetasNaoEncontradas(banco: string, local, idGrupo) {
    return this.dbProvider.getDB(banco).then((dataBase: SQLiteObject) => {
      return dataBase.executeSql(this.queryBuscaEtiquetaNaoEncontrada, [local, idGrupo]).then((result: any) => {
        var filiais = [];
        for (var i = 0; i < result.rows.length; i++) {
          filiais.push(result.rows.item(i));
        }
        return filiais;
      }).catch(e => console.error('Erro selectAll', e))
    }).catch(e => console.error('Erro ao obter instancia do DB', e))
  }
  fecharConexao(banco: string){
    return this.dbProvider.closeConnection(banco).then(() => {
      console.log('conexãoEncerrada');
    }).catch(e => console.error('Erro ao fechar a conexão', e))
  }
  deletarDados(banco: string) {
    return this.dbProvider.getDB(banco).then((dataBase: SQLiteObject) => {
      return dataBase.executeSql(this.dropQuery, []).then((result: any) => {
        console.log('dados deletados');

      }).catch(e => console.error('Erro deletarDados', e))
    }).catch(e => console.error('Erro ao obter instancia do DB', e))
  }
  updatePatrimonioStatus(banco: string, statusAtual, codigo) {
    return this.dbProvider.getDB(banco).then((dataBase: SQLiteObject) => {
      return dataBase.executeSql(this.updateEtiquetaRevisada, [statusAtual, codigo]).then((result: any) => {
        console.log(JSON.stringify(result));
        return 1
      }).catch(e => {
        console.error('Erro ao atualizar Patrimonio', e);
        console.log(JSON.stringify(e));
        return -1;
      })
    }).catch(e => {
      console.error('Erro ao obter instancia do DB', e)
      return -1;
    })
  }
}
