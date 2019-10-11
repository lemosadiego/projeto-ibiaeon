import { Injectable } from '@angular/core';
import { DatabaseProvider } from '../database/database';
import { SQLiteObject } from '@ionic-native/sqlite';

/*
  Generated class for the InventarioConsultaDaoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class InventarioConsultaDaoProvider {

  private querySelect = ` FROM tb_Patrimonio as Patrimonio
                        left join tb_Especie as Especie on Especie.id = Patrimonio.id_Especie
                        left join tb_Filial as Filial on Filial.id = Patrimonio.id_Filial
                        left join tb_Local as Local on Local.id = Patrimonio.id_Local
                        left join tb_CentroCusto as CentroDeCusto on CentroDeCusto.id = Patrimonio.id_CentroCusto
                        left join tb_CentroResponsabilidade as CentroDeResponsabilidade on CentroDeResponsabilidade.id = Patrimonio.id_Responsavel `;

  constructor(public dbProvider: DatabaseProvider) { }

  public retornaRegistros(banco: string, camposConsulta: string, filtrosConsulta: string, gruposConsulta: string, dataHora: string) {
    var sql: string = 'SELECT '+ camposConsulta + this.querySelect;

    if(dataHora != null) { // CERTIFICAR QUE dataHora vem no formato "dd-MM-yyyy"
      filtrosConsulta += " AND strftime('%d-%m-%Y', Patrimonio.dtAlteracao ) = " + dataHora
      sql += filtrosConsulta;
      sql += gruposConsulta;
    } else {
      if(filtrosConsulta != undefined)
        sql += filtrosConsulta;
      sql += gruposConsulta;
    }
    
    return this.dbProvider.getDB(banco).then((db: SQLiteObject) => {
      return db.executeSql(sql,[]).then((result: any) => {
        var consulta = [];
        for(var i = 0; i < result.rows.length; i++) {
          consulta.push(result.rows.item(i));
        }
        return consulta;
      }).catch(e => console.error('Erro ao consultar Inventario',e))
    }).catch(e => console.error('Erro ao obter instancia do DB',e))
  }
}
