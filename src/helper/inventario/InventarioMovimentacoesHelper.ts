import { Util } from './../Util';
import { InventarioMovimentacoes } from './../../modelos/InventarioMovimentacoes';
import { TipoDadosPatrimonioDaoProvider } from './../../providers/tipo-dados-patrimonio-dao/tipo-dados-patrimonio-dao';
import { AlteracaoCampos } from './../../modelos/AlteracaoCampos';
import { InventarioMovimentacoesDaoProvider } from './../../providers/inventario-movimentacoes-dao/inventario-movimentacoes-dao';
import { Injectable } from '@angular/core';

Injectable()
export class InventarioMovimentacoesHelper {
    
    constructor(public inventarioMovimentacoesDao: InventarioMovimentacoesDaoProvider, public tipoDadoPatrimonioDao: TipoDadosPatrimonioDaoProvider) {}

    public async inserirRegistro(banco: string, idInventario: number, listAlteracoesCampos: AlteracaoCampos[], listAlteracoesPropriedades: AlteracaoCampos[]) {
        var inventarioMovimentacoes: InventarioMovimentacoes;

        var tipoDados:any = await this.tipoDadoPatrimonioDao.retornaRegistros(banco);

        for(var i = 0; i < listAlteracoesCampos.length; i++) {
            inventarioMovimentacoes = new InventarioMovimentacoes();
            inventarioMovimentacoes.idInventario = idInventario;
            inventarioMovimentacoes.idPropriedade = +this.getTipoDados(tipoDados, listAlteracoesCampos[i].campo);
            inventarioMovimentacoes.nome = listAlteracoesCampos[i].campo;
            inventarioMovimentacoes.valorAntigo = listAlteracoesCampos[i].valorAntigo;
            inventarioMovimentacoes.valorNovo = listAlteracoesCampos[i].valorNovo;
            inventarioMovimentacoes.dtInsercao = Util.gerarData(new Date());
            var retorno = await this.inventarioMovimentacoesDao.inserirRegistro(banco, inventarioMovimentacoes);
            if(retorno == -1) {
                throw new Error('Erro ao inserir registro de movimentação '+ 'iventario: '+inventarioMovimentacoes.idInventario + ' propriedade: '+inventarioMovimentacoes.idPropriedade);
            }
        }

        for(var i = 0; i < listAlteracoesPropriedades.length; i++) {
            inventarioMovimentacoes = new InventarioMovimentacoes();
            inventarioMovimentacoes.idInventario = idInventario;
            inventarioMovimentacoes.idPropriedade = +listAlteracoesPropriedades[i].idPropriedade;
            inventarioMovimentacoes.nome = listAlteracoesPropriedades[i].campo;
            inventarioMovimentacoes.valorAntigo = listAlteracoesPropriedades[i].valorAntigo;
            inventarioMovimentacoes.valorNovo = listAlteracoesPropriedades[i].valorNovo;
            inventarioMovimentacoes.dtInsercao = Util.gerarData(new Date());
            var retorno = await this.inventarioMovimentacoesDao.inserirRegistro(banco, inventarioMovimentacoes);
            if(retorno == -1) {
                throw new Error('Erro ao inserir registro de movimentação '+ 'iventario: '+inventarioMovimentacoes.idInventario + ' propriedade: '+inventarioMovimentacoes.idPropriedade);
            }
        }
    }

    public async retornaRegistros(banco: string, filtro: string) {
        var retorno = await this.inventarioMovimentacoesDao.retornaRegistros(banco, filtro);
        return retorno;
    }

    private getTipoDados(tipoDados: any [], descricao: string) : string {
        var codigo: string = "0";
        
        for(var i = 0; i < tipoDados.length; i++) {
            if(tipoDados[i].descricao === descricao) {
                codigo = tipoDados[i].codigo;
                i = tipoDados.length;
            }
        }
        return codigo;
    }
}