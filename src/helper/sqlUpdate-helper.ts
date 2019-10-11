import { Injectable } from '@angular/core';
import * as ConstantsHelper from './constansts-helper';
import * as ConstantsSql from '../providers/database/sql';
import * as ConstantsSqlConfig from '../providers/database/sqlDbConfig';
import { Util } from './Util';
import * as ConstantsUpdateHelper from './constanstsUpdate-helper';

/** 
 * Classe Helper onde está cria o inserte com os dados para gravar localmente no Mobile.
 * 
*/

@Injectable()
export class SqlUpdateHelper {

    constructor() {}
    
    public buildUpdate(tabela: string, values: any) {
        var queryUpdate: string = '';

        switch (tabela) {
            case ConstantsSql.tb_Marca:
                queryUpdate +=  this.buildValuesMarca(values, ConstantsUpdateHelper.updateTbMarca);
                break;
            case  ConstantsSql.tb_Patrimonio:
                queryUpdate += this.buildValuesPatrimonio(values, ConstantsUpdateHelper.updateTbPatrimonio);
                break;
            case ConstantsSql.tb_Inventario:
                queryUpdate +=  this.buildValuesInventario(values, ConstantsUpdateHelper.updateTbInventario);
                break;
            case ConstantsSql.tb_CentroCusto:
                queryUpdate +=  this.buildValueGeneric(values, ConstantsUpdateHelper.updateTbCentroCusto);
                break;
            case ConstantsSql.tb_CentroResponsabilidade:
                queryUpdate += this.buildValueGeneric(values, ConstantsUpdateHelper.updateTbCentroResponsabilidade);
                break;
            case ConstantsSql.tb_Local:
                queryUpdate += this.buildValueGeneric(values,  ConstantsUpdateHelper.updateTbLocal);
                break;
            case ConstantsSql.tb_Filial:
                queryUpdate += this.buildValueGeneric(values, ConstantsUpdateHelper.updateTbFilial);
                break;
            case ConstantsSql.tb_CondicaoUso:
                queryUpdate += this.buildValueGeneric(values,  ConstantsUpdateHelper.updateTbCondicaoUso);
                break;
            case ConstantsSql.tb_Grupo:
                queryUpdate += this.buildValueGeneric(values,  ConstantsUpdateHelper.updateTbGrupo);
                break;
            case ConstantsSql.tb_Propriedade:
                queryUpdate += this.buildValuePropriedade(values, ConstantsUpdateHelper.updateTbPropriedade);
                break;
            case ConstantsSql.tb_Especie:
                queryUpdate += this.buildValueEspecie(values, ConstantsUpdateHelper.updateTbEspecie);
                break;
            case ConstantsSql.tb_DicionarioEspecie:
                queryUpdate += this.buildValueDicionarioEspecie(values, ConstantsUpdateHelper.updateTbDicionarioEspecie);
                break;
            case ConstantsSqlConfig.tb_CodigoFicticio:
                queryUpdate += this.buildValueCodigoFicticio(values, ConstantsUpdateHelper.updateTbCodigoFicticio);
                break;
            case ConstantsSqlConfig.tb_Justificativa:
                queryUpdate += this.buildValueJustificativa(values, ConstantsUpdateHelper.updateTbCodigoJustificativa);
                break;
            case ConstantsSqlConfig.tb_ConfiguracoesEquipamento:
                queryUpdate += this.buildValueConfiguracoesEquipamento(values, ConstantsUpdateHelper.updateTbConfiguracoesEquipamento);
                break;
            case ConstantsSqlConfig.tb_TipoServidor:
                queryUpdate += this.buildValueTipoServidor(values, ConstantsUpdateHelper.updateTbTipoServidor);
                break;
            case ConstantsSqlConfig.tb_Conexao:
                queryUpdate += this.buildValueConexao(values, ConstantsUpdateHelper.updateTbConexao);
                break;
            case ConstantsSqlConfig.tb_Cliente:
                queryUpdate += this.buildValueClient(values, ConstantsUpdateHelper.updateTbCliente);
                break;
            case ConstantsSql.tb_AtributosDoBem:
                queryUpdate += this.buildValueAtributosDoBem(values, ConstantsUpdateHelper.updateTbAtributosDoBem);
                break;
            case ConstantsSql.tb_InventarioMovimentacoes:
                queryUpdate += this.buildValueInventarioMovimentacoes(values, ConstantsUpdateHelper.updateTbInventarioMovimentacoes);
                break;
            case ConstantsSql.tb_PropriedadeLookUp:
                queryUpdate += this.buildValuePropriedadeLookUp(values, ConstantsUpdateHelper.updateTbPropriedadeLookUp);
                break; 
            case ConstantsSql.tb_TipoDado:
                queryUpdate += this.buildValueTipoDado(values, ConstantsUpdateHelper.updateTbTipoDado);
                break;    
            case ConstantsSqlConfig.tb_UsuarioEquipamento:
                queryUpdate += this.buildValueUsuarioEquipamento(values, ConstantsUpdateHelper.updateTbUsuarioEquipamento);
                break;
            case ConstantsSql.tb_TipoDadosPatrimonio:
                queryUpdate += this.buildValueTipoDadosPatrimonio(values, ConstantsUpdateHelper.updateTbTipoDadosPatrimonio);
                break;
            case ConstantsSql.tb_FotoDoBem:
                queryUpdate += this.buildValueFotoDoBem(values,  ConstantsUpdateHelper.updateTbFotoDoBem);
                break;             
        }

        queryUpdate = queryUpdate.replace(/'undefined'/g,null);
        queryUpdate = queryUpdate.replace(/undefined/g,null);
        
        return queryUpdate;
    }

    private buildValuesMarca(q: any, update: string): string {
        update = update.replace('?1',q.Codigo)
        .replace('?2',q.DsMarca)
        .replace('?3',q.Origem)
        .replace('?4',q.Status)
        .replace('?5',q.DtInsercao)
        .replace('?6',q.DtAlteracao)
        .replace('?7',q.UsuarioPdaLogin)
        .replace('?8',q.ID)

        return update;
    }

    private buildValuesPatrimonio(q: any, update: string): string {
        update = update.replace('?1',q.id_Filial)
        .replace('?2',q.id_Especie)
        .replace('?3',q.id_Condicao)
        .replace('?4',q.id_Responsavel)
        .replace('?5',q.id_CentroCusto)
        .replace('?6',q.id_Local)
        .replace('?7',"'"+q.Codigo+"'")
        .replace('?8',"'"+q.CodigoAnt+"'")
        .replace('?9',q.Incorporacao)
        .replace('?10',q.IncorporacaoAnt)
        .replace('?11','\''+this.escape(q.DESCRICAO)+'\'')
        .replace('?12','\''+q.Serie+'\'') 
        .replace('?13','\''+this.escape(q.OBSERVACAO)+'\'')
        .replace('?14','\''+q.TAG+'\'')
        .replace('?15','\''+q.AUX1+'\'')
        .replace('?16','\''+q.AUX2+'\'')
        .replace('?17','\''+q.AUX3+'\'')
        .replace('?18','\''+q.AUX4+'\'')
        .replace('?19','\''+q.AUX5+'\'')
        .replace('?20','\''+q.AUX6+'\'')
        .replace('?21','\''+q.AUX7+'\'')
        .replace('?22','\''+q.AUX8+'\'')
        .replace('?23','\''+q.STATUS+'\'')
        .replace('?24','\''+q.Latitude+'\'')
        .replace('?25','\''+q.Longitude+'\'')
        .replace('?26','\''+q.Altitude+'\'')
        .replace('?27',q.LoteSeq)
        .replace('?28',q.gravado)
        .replace('?29',q.NumeroFicticio)
        .replace('?30',q.ID_LinkEspecieMarca)
        .replace('?31',q.ID_LinkEspecieMarcaModelo)
        .replace('?32','\''+this.escape(q.Marca)+'\'')
        .replace('?33','\''+this.escape(q.Modelo)+'\'')
        .replace('?34',Util.modifyDate(q.DTATLZ))
        .replace('?35','\''+q.UsuarioPdaLogin+'\'')
        .replace('?36',q.ID)

        return update;
    }

    private buildValuesInventario(q: any, update: string): string {
        update = update.replace('?1',q.id_Patrimonio)
        .replace('?2',Util.modifyDate(q.DataDeGravacao))
        .replace('?3','\''+q.Situacao+'\'')
        .replace('?4','\''+q.UsuarioPdaLogin+'\'')
        .replace('?5','\''+q.UsuarioConfigLogin+'\'')
        .replace('?6',q.ID)

        return update;
    }
    
    private buildValueGeneric(q: any, update: string): string {
        update = update.replace('?1','\''+q.CodBiz+'\'')
        .replace('?2','\''+q.Nome+'\'')
        .replace('?3','\''+q.Situacao+'\'')
        .replace('?4','\''+this.boolToNumber(q.Status)+'\'')
        .replace('?5',Util.modifyDate(q.DtInsercao))
        .replace('?6',Util.modifyDate(q.DtAlteracao))
        .replace('?7','\''+q.UsuarioConfigLognin+'\'')
        .replace('?8','\''+q.UsuarioPdaLogin+'\'')
        .replace('?9',q.ID)

        
        return update;
    }

    private buildValuePropriedade(q: any, update: string): string {
        update = update.replace('?1','\''+q.CodBiz+'\'')
        .replace('?2','\''+q.Nome+'\'')
        .replace('?3','\''+q.Situacao+'\'')
        .replace('?4','\''+this.boolToNumber(q.Status)+'\'')
        .replace('?5',Util.modifyDate(q.DtInsercao))
        .replace('?6',Util.modifyDate(q.DtAlteracao))
        .replace('?7','\''+q.UsuarioConfigLogin+'\'')
        .replace('?8','\''+q.UsuarioPdaLogin+'\'')
        .replace('?9',q.ID_TipoDado)
        .replace('?10',q.Padronizacao)
        .replace('?11',q.ID)

        return update;
    }

    private buildValueEspecie(q: any, update: string): string {
        update = update.replace('?1','\''+q.CodBiz+'\'')
        .replace('?2','\''+q.Nome+'\'')
        .replace('?3','\''+q.Situacao+'\'')
        .replace('?4','\''+this.boolToNumber(q.Status)+'\'')
        .replace('?5',Util.modifyDate(q.DtInsercao))
        .replace('?6',Util.modifyDate(q.DtAlteracao))
        .replace('?7','\''+q.UsuarioConfigLogin+'\'')
        .replace('?8','\''+q.UsuarioPdaLogin+'\'')
        .replace('?9','\''+q.ID_Grupo+'\'')
        .replace('?10','\''+q.CodContaContabil+'\'')
        .replace('?11','\''+q.VidaUtil+'\'')
        .replace('?12',q.ID)

        return update;
    }

    private buildValueDicionarioEspecie(q: any, update: string): string {
        update = update.replace('?1',q.ID_Grupo)
        .replace('?2',q.ID_Propriedade)
        .replace('?3','\''+this.boolToNumber(q.Temp)+'\'')
        .replace('?4','\''+this.boolToNumber(q.Retirar)+'\'')
        .replace('?5',q.ID)

        return update;
    }

    private buildValueUsuarioEquipamento(q: any, update: string): string {
        update = update.replace('?1','\''+q.Nome+'\'')
        .replace('?2','\''+q.Login+'\'')
        .replace('?3','\''+q.Senha+'\'')
        .replace('?4','\''+q.Tipo+'\'')
        .replace('?5','\''+this.boolToNumber(q.Status)+'\'')
        .replace('?6',Util.modifyDate(q.DtInsercao))
        .replace('?7',Util.modifyDate(q.DtAlteracao))
        .replace('?8',q.UsuarioConfigID)
        .replace('?9',q.UsuarioPdaID)
        .replace('?10',q.ID)

        return update;
    }

    private buildValueCodigoFicticio(q: any, update: string): string {
        update = update.replace('?1',q.ID_Cliente)
        .replace('?2',q.ID_UsuarioEquipamento)
        .replace('?3',q.De)
        .replace('?4',q.Ate)
        .replace('?5',q.UltimoUtilizado)
        .replace('?6','\''+0+'\'')
        .replace('?7',q.ID)

        return update;
    }

    private buildValueJustificativa(q: any, update: string): string {
        update = update.replace('?1','\''+q.Tempo+'\'')
        .replace('?2',q.ID_Cliente)
        .replace('?3',q.ID)

        return update;
    }

    private buildValueConfiguracoesEquipamento(q: any, update: string): string {
        update = update.replace('?1',q.idCliente)
        .replace('?2','\''+q.Nome+'\'')
        .replace('?3','\''+q.Valor+'\'')
        .replace('?4',q.idConfig)
          
        return update;
    }

    private buildValueTipoServidor(q: any, update: string): string {
        update = update.replace('?1','\''+q.TipoServidor+'\'')
        .replace('?2',q.ID)
              
        return update;
    }

    private buildValueConexao(q: any, update: string): string {
        update = update.replace('?1',q.UsuarioConfigID)
        .replace('?2','\''+this.boolToNumber(q.Status)+'\'')
        .replace('?3',Util.modifyDate(q.DtInsercao))
        .replace('?4',Util.modifyDate(q.DtAlteracao))
        .replace('?5',q.id_TipoServidor)
        .replace('?6','\''+q.Banco+'\'')
        .replace('?7','\''+q.Servidor+'\'')
        .replace('?8','\''+q.Mapeamento+'\'')
        .replace('?9','\''+q.CaminhoMapeamento+'\'')
        .replace('?10','\''+q.CaminhoFisico+'\'')
        .replace('?11',q.ID)

        return update;
    }

    private buildValueClient(q: any, update: string): string {
        update = update.replace('?1','\''+q.CNPJ+'\'')
        .replace('?2','\''+q.Situacao+'\'')
        .replace('?3','\''+this.boolToNumber(q.Status)+'\'')
        .replace('?4',Util.modifyDate(q.DtInsercao))
        .replace('?5','\''+q.CodBiz+'\'')
        .replace('?6','\''+q.Nome+'\'')
        .replace('?7',q.UsuarioConfigID)
        .replace('?8',Util.modifyDate(q.DtAlteracao))
        .replace('?9','\''+q.PastaCliente+'\'')
        .replace('?10','\''+q.SMTP+'\'')
        .replace('?11','\''+q.EmailRecebimento+'\'')
        .replace('?12','\''+q.EmailEnvio+'\'')
        .replace('?13','\''+q.SenhaEmailEnvio+'\'')
        .replace('?14',q.Id_Conexao)
        .replace('?15','\''+q.Banco+'\'')
        .replace('?16',q.ID)
        
        return update;
    }

    private buildValueAtributosDoBem(q: any, update: string): string {
        update = update.replace('?1',q.ID_Patrimonio)
        .replace('?2',q.ID_Propriedade)
        .replace('?3','\''+q.Texto+'\'')
        .replace('?4',q.ID)

        return update;
    }
    private buildValueFotoDoBem(q: any, update: string): string {
        update = update.replace('?1','\''+q.CodigoFilial+'\'')
        .replace('?2','\''+q.CodigoPatrimonio+'\'')
        .replace('?3',q.Incorporacao)
        .replace('?4','\''+q.NomeFoto+'\'')
        .replace('?5',Util.modifyDate(q.DtInsercao))
        .replace('?6','\''+0+'\'')
        .replace('?7','\''+q.NomeFoto+'\'')

        return update;
    }

    private buildValueInventarioMovimentacoes(q: any, update: string): string {
        update = update.replace('?1',q.id_Inventario)
        .replace('?2',q.id_Propriedade)
        .replace('?3','\''+this.escape(q.ValorAntigo)+'\'')
        .replace('?4','\''+this.escape(q.ValorNovo)+'\'')
        .replace('?5',q.ID)

        return update;
    }

    private buildValueTipoDado(q: any, update: string): string {
        update = update.replace('?1','\''+q.Nome+'\'')
        .replace('?2',q.ID)
        return update;
    }

    private buildValuePropriedadeLookUp(q: any, update: string): string {
        update = update.replace('?1',q.id_Propriedade)
        .replace('?2','\''+q.Valor+'\'')
        .replace('?3','\''+q.Situacao+'\'')
        .replace('?4',Util.modifyDate(q.DtInsercao))
        .replace('?5','\''+q.UsuarioConfigLogin+'\'')
        .replace('?6',q.Retirar)
        .replace('?7',q.Temp)
        .replace('?8',q.ID)

        return update;
    }

    private buildValueTipoDadosPatrimonio(q: any, update: string): string {
        update = update.replace('?1','\''+q.Codigo+'\'')
        .replace('?2','\''+q.Situacao+'\'')
        .replace('?3',q.ID)

        return update;
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