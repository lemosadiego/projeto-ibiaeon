import { Injectable } from '@angular/core';
import * as ConstantsHelper from './constansts-helper';
import * as ConstantsSql from '../providers/database/sql';
import * as ConstantsSqlConfig from '../providers/database/sqlDbConfig';
import { Util } from './Util';

/** 
 * Classe Helper onde está cria o inserte com os dados para gravar localmente no Mobile.
 * 
*/

@Injectable()
export class SqlHelper {

    constructor() { }
    
    public buildInsert(tabela: string, values: any) {
        var queryInsert: string = '';

        switch (tabela) {
            case ConstantsSql.tb_Marca:
                queryInsert += ConstantsHelper.insertTbMarca + 'VALUES ('+this.buildValuesMarca(values)+')';
                break;
            case  ConstantsSql.tb_Patrimonio:
                queryInsert += ConstantsHelper.insertTbPatrimonio + 'VALUES ('+this.buildValuesPatrimonio(values)+')';
                break;
            case ConstantsSql.tb_Inventario:
                queryInsert += ConstantsHelper.insertTbInventario + 'VALUES ('+this.buildValuesInventario(values)+')';
                break;
            case ConstantsSql.tb_CentroCusto:
                queryInsert += ConstantsHelper.insertTbCentroCusto + 'VALUES ('+this.buildValueGeneric(values)+')';
                break;
            case ConstantsSql.tb_CentroResponsabilidade:
                queryInsert += ConstantsHelper.insertTbCentroResponsabilidade + 'VALUES ('+this.buildValueGeneric(values)+')';
                break;
            case ConstantsSql.tb_Local:
                queryInsert += ConstantsHelper.insertTbLocal + 'VALUES ('+this.buildValueGeneric(values)+')';
                break;
            case ConstantsSql.tb_Filial:
                queryInsert += ConstantsHelper.insertTbFilial + 'VALUES ('+this.buildValueGeneric(values)+')';
                break;
            case ConstantsSql.tb_CondicaoUso:
                queryInsert += ConstantsHelper.insertTbCondicaoUso + 'VALUES ('+this.buildValueGeneric(values)+')';
                break;
            case ConstantsSql.tb_Grupo:
                queryInsert += ConstantsHelper.insertTbGrupo + 'VALUES ('+this.buildValueGeneric(values)+')';
                break;
            case ConstantsSql.tb_Propriedade:
                queryInsert += ConstantsHelper.insertTbPropriedade + 'VALUES ('+this.buildValuePropriedade(values)+')';
                break;
            case ConstantsSql.tb_Especie:
                queryInsert += ConstantsHelper.insertTbEspecie + 'VALUES ('+this.buildValueEspecie(values)+')';
                break;
            case ConstantsSql.tb_DicionarioEspecie:
                queryInsert += ConstantsHelper.insertTbDicionarioEspecie + 'VALUES ('+this.buildValueDicionarioEspecie(values)+')';
                break;
            case ConstantsSqlConfig.tb_CodigoFicticio:
                queryInsert += ConstantsHelper.insertTbCodigoFicticio + 'VALUES ('+this.buildValueCodigoFicticio(values)+')';
                break;
            case ConstantsSqlConfig.tb_Justificativa:
                queryInsert += ConstantsHelper.insertTbCodigoJustificativa + 'VALUES ('+this.buildValueJustificativa(values)+')';
                break;
            case ConstantsSqlConfig.tb_ConfiguracoesEquipamento:
                queryInsert += ConstantsHelper.insertTbConfiguracoesEquipamento + 'VALUES ('+this.buildValueConfiguracoesEquipamento(values)+')';
                break;
            case ConstantsSqlConfig.tb_TipoServidor:
                queryInsert += ConstantsHelper.insertTbTipoServidor + 'VALUES ('+this.buildValueTipoServidor(values)+')';
                break;
            case ConstantsSqlConfig.tb_Conexao:
                queryInsert += ConstantsHelper.insertTbConexao + 'VALUES ('+this.buildValueConexao(values)+')';
                break;
            case ConstantsSqlConfig.tb_Cliente:
                queryInsert += ConstantsHelper.insertTbCliente + 'VALUES ('+this.buildValueClient(values)+')';
                break;
            case ConstantsSql.tb_AtributosDoBem:
                queryInsert += ConstantsHelper.insertTbAtributosDoBem + 'VALUES ('+this.buildValueAtributosDoBem(values)+')';
                break;
            case ConstantsSql.tb_InventarioMovimentacoes:
                queryInsert += ConstantsHelper.insertTbInventarioMovimentacoes + 'VALUES ('+this.buildValueInventarioMovimentacoes(values)+')';
                break;
            case ConstantsSql.tb_PropriedadeLookUp:
                queryInsert += ConstantsHelper.insertTbPropriedadeLookUp + 'VALUES ('+this.buildValuePropriedadeLookUp(values)+')';
                break; 
            case ConstantsSql.tb_TipoDado:
                queryInsert += ConstantsHelper.insertTbTipoDado + 'VALUES ('+this.buildValueTipoDado(values)+')';
                break;    
            case ConstantsSqlConfig.tb_UsuarioEquipamento:
                queryInsert += ConstantsHelper.insertTbUsuarioEquipamento + 'VALUES ('+this.buildValueUsuarioEquipamento(values)+')';
                break;
            case ConstantsSql.tb_TipoDadosPatrimonio:
                queryInsert += ConstantsHelper.insertTbTipoDadosPatrimonio + 'VALUES ('+this.buildValueTipoDadosPatrimonio(values)+')';
                break;
            case ConstantsSql.tb_FotoDoBem:
                queryInsert += ConstantsHelper.insertTbFotoDoBem + 'VALUES ('+this.buildValueFotoDoBem(values)+')';
                break;             
        }

        queryInsert = queryInsert.replace(/'undefined'/g,null);
        queryInsert = queryInsert.replace(/undefined/g,null);
        
        return queryInsert;
    }

    private buildValuesMarca(q: any): string {
        var query: string = '';
        query += q.ID
        +','+q.Codigo
        +','+'\''+q.DsMarca+'\''
        +','+'\''+q.Origem+'\''
        +','+this.boolToNumber(q.Status)
        +','+Util.modifyDate(q.DtInsercao)
        +','+Util.modifyDate(q.DtAlteracao)
        +','+'\''+q.UsuarioPdaLogin+'\''
        +','+this.boolToNumber(q.deleted);

        return query;
    }

    private buildValuesPatrimonio(q: any): string {
        var query: string = '';
        query += q.ID
            +','+q.id_Filial
            +','+q.id_Especie
            +','+q.id_Condicao
            +','+q.id_Responsavel
            +','+q.id_CentroCusto
            +','+q.id_Local
            +','+'\''+q.Codigo+'\''
            +','+'\''+q.CodigoAnt+'\''
            +','+q.Incorporacao
            +','+q.IncorporacaoAnt
            +','+'\''+this.escape(q.DESCRICAO)+'\''
            +','+'\''+q.Serie+'\''
            +','+'\''+this.escape(q.OBSERVACAO)+'\''
            +','+'\''+q.TAG+'\''
            +','+'\''+q.AUX1+'\''
            +','+'\''+q.AUX2+'\''
            +','+'\''+q.AUX3+'\''
            +','+'\''+q.AUX4+'\''
            +','+'\''+q.AUX5+'\''
            +','+'\''+q.AUX6+'\''
            +','+'\''+q.AUX7+'\''
            +','+'\''+q.AUX8+'\''
            +','+'\''+q.STATUS+'\''
            +','+'\''+q.Latitude+'\''
            +','+'\''+q.Longitude+'\''
            +','+'\''+q.Altitude+'\''
            +','+q.LoteSeq
            +','+q.gravado
            +','+q.NumeroFicticio
            +','+q.ID_LinkEspecieMarca
            +','+q.ID_LinkEspecieMarcaModelo
            +','+'\''+this.escape(q.Marca)+'\''
            +','+'\''+this.escape(q.Modelo)+'\''
            +','+Util.modifyDate(q.DTATLZ)
            +','+'\''+q.UsuarioPdaLogin+'\'';

        return query;
    }

    private buildValuesInventario(q: any): string {
        var query: string = '';
        query += q.ID
        +','+q.id_Patrimonio
        +','+Util.modifyDate(q.DataDeGravacao)
        +','+'\''+q.Situacao+'\''
        +','+'\''+q.UsuarioPdaLogin+'\''
        +','+'\''+q.UsuarioConfigLogin+'\'';

        return query;
    }
    
    private buildValueGeneric(q: any): string {
        var query: string = '';
        query += q.ID
        +','+'\''+q.CodBiz+'\''
        +','+'\''+q.Nome+'\''
        +','+'\''+q.Situacao+'\''
        +','+this.boolToNumber(q.Status)
        +','+Util.modifyDate(q.DtInsercao)
        +','+Util.modifyDate(q.DtAlteracao)
        +','+'\''+q.UsuarioConfigLogin+'\''
        +','+'\''+q.UsuarioPdaLogin+'\'';
        
        return query;
    }

    private buildValuePropriedade(q: any): string {
        var query = this.buildValueGeneric(q);
        query += ','+q.ID_TipoDado
        +','+'\''+q.Padronizacao+'\'';

        return query;
    }

    private buildValueEspecie(q: any): string {
        var query = this.buildValueGeneric(q);
        query += ','+q.ID_Grupo
        +','+'\''+q.CodContaContabil+'\''
        +','+q.VidaUtil;
        return query;
    }

    private buildValueDicionarioEspecie(q: any): string {
        var query: string = '';
        query += q.ID
        +','+q.ID_Grupo
        +','+q.ID_Propriedade
        +','+this.boolToNumber(q.Temp)
        +','+this.boolToNumber(q.Retirar);
        return query;
    }

    private buildValueUsuario(q: any): string {
        var query: string = '';
        query += q.ID
        +','+'\''+q.Nome+'\''
        +','+'\''+q.SobreNome+'\''
        +','+'\''+q.Login+'\''
        +','+'\''+q.Senha+'\''
        +','+this.boolToNumber(q.Status)
        +','+Util.modifyDate(q.DtInsercao)
        +','+Util.modifyDate(q.DtAlteracao)
        +','+'\''+q.Email+'\''
        +','+q.IdPerfil;
        
        return query;
    }

    private buildValueCodigoFicticio(q: any): string {
        var query: string = '';
        query += q.ID
        +','+q.ID_Cliente
        +','+q.ID_UsuarioEquipamento
        +','+q.De
        +','+q.Ate
        +','+q.UltimoUtilizado
        +','+0;// validado padrao 0=false

        return query;
    }

    private buildValueJustificativa(q: any): string {
        var query: string = '';
        query += q.ID
        +','+'\''+q.Tempo+'\''
        +','+q.ID_Cliente;
              
        return query;
    }

    private buildValueConfiguracoesEquipamento(q: any): string {
        var query: string = '';
        query += q.idConfig
        +','+q.idCliente
        +','+'\''+q.Nome+'\''
        +','+'\''+q.Valor+'\'';
          
        return query;
    }

    private buildValueTipoServidor(q: any): string {
        var query: string = '';
        query += q.id_TipoServidor
        +','+'\''+q.TipoServidor+'\'';
              
        return query;
    }

    private buildValueConexao(q: any): string {
        var query: string = '';
        query += q.ID
        +','+q.UsuarioConfigID
        +','+this.boolToNumber(q.Status)
        +','+Util.modifyDate(q.DtInsercao)
        +','+Util.modifyDate(q.DtAlteracao)
        +','+q.id_TipoServidor
        +','+'\''+q.Banco+'\''
        +','+'\''+q.Servidor+'\''
        +','+'\''+q.Mapeamento+'\''
        +','+'\''+q.CaminhoMapeamento+'\''
        +','+'\''+q.CaminhoFisico+'\'';
        
        return query;
    }

    private buildValueClient(q: any): string {
        var query: string = '';
        query += q.ID
        +','+'\''+q.CNPJ+'\''
        +','+'\''+q.Situacao+'\''
        +','+this.boolToNumber(q.Status)
        +','+Util.modifyDate(q.DtInsercao)
        +','+'\''+q.CodBiz+'\''
        +','+'\''+q.Nome+'\''
        +','+q.UsuarioConfigID
        +','+Util.modifyDate(q.DtAlteracao)
        +','+'\''+q.PastaCliente+'\''
        +','+'\''+q.SMTP+'\''
        +','+'\''+q.EmailRecebimento+'\''
        +','+'\''+q.EmailEnvio+'\''
        +','+'\''+q.SenhaEmailEnvio+'\''
        +','+q.Id_Conexao
        +','+'\''+q.Banco+'\'';
        
        return query;
    }

    private buildValueAtributosDoBem(q: any): string {
        var query: string = '';
        query += q.ID
        +','+q.ID_Patrimonio
        +','+q.ID_Propriedade
        +','+'\''+q.Texto+'\'';

        return query;
    }

    private buildValueFotoDoBem(q: any): string {
        var query: string = '';
        query += '\''+q.CodigoFilial+'\''
        +','+'\''+q.CodigoPatrimonio+'\''
        +','+q.Incorporacao
        +','+'\''+q.NomeFoto+'\''
        +','+'\'\''
        +','+0;

        return query;
    }

    private buildValueInventarioMovimentacoes(q: any): string {
        var query: string = '';
        query += q.ID
        +','+q.id_Inventario
        +','+q.id_Propriedade
        +','+'\''+this.escape(q.ValorAntigo)+'\''
        +','+'\''+this.escape(q.ValorNovo)+'\'';

        return query;
    }

    private buildValueUsuarioEquipamento(q: any): string {
        var query: string = '';
        query += q.ID
        +','+'\''+q.Nome+'\''
        +','+'\''+q.Login+'\''
        +','+'\''+q.Senha+'\''
        +','+'\''+q.Tipo+'\''
        +','+this.boolToNumber(q.Status)
        +','+Util.modifyDate(q.DtInsercao)
        +','+Util.modifyDate(q.DtAlteracao)
        +','+q.UsuarioConfigID
        +','+q.UsuarioPdaID;

        return query;
    }

    private buildValueTipoDado(q: any): string {
        var query: string = '';
        query += q.ID
        +','+'\''+q.Nome+'\'';

        return query;
    }

    private buildValuePropriedadeLookUp(q: any): string {
        var query: string = '';
        query += q.ID
        +','+q.id_Propriedade
        +','+'\''+q.Valor+'\''
        +','+'\''+q.Situacao+'\''
        +','+Util.modifyDate(q.DtInsercao)
        +','+'\''+q.UsuarioConfigLogin+'\''
        +','+q.Retirar
        +','+q.Temp;

        return query;
    }

    private buildValueTipoDadosPatrimonio(q: any): string {
        var query: string = '';
        query += q.ID
        +','+'\''+q.Codigo+'\''
        +','+'\''+q.Descricao+'\'';

        return query;
    }

    private boolToNumber(q: boolean): number {
        if(q === true)
            return 1;
        else
            return 0;
    }

    private escape(descricao: string): string {
        if(descricao != undefined)   
            return descricao.replace(/'/g,'\'\'');
        else
            return '';
    }
}