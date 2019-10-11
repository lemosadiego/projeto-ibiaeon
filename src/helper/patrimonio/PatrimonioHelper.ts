import { Util } from './../Util';
import { InventarioMovimentacoesHelper } from './../inventario/InventarioMovimentacoesHelper';
import { AlteracaoCampos } from './../../modelos/AlteracaoCampos';
import { InventarioHelper } from './../inventario/InventarioHelper';
import { AtributosDoBemHelper } from './../atributos-do-bem/AtributosDoBemHelper';
import { ConfiguracaoEquipamento } from './../../modelos/ConfiguracaoEquipamento';
import { AtributoDoBem } from './../../modelos/AtributoDoBem';
import { Patrimonio } from './../../modelos/Patrimonio';
import { Injectable } from "@angular/core";
import { PatrimonioDaoProvider } from './../../providers/patrimonio-dao/patrimonio-dao';
import { Session } from '../../providers/session/session';
import * as Const from '../constansts-helper';
import { ConfiguracoesEquipamentoDaoProvider } from '../../providers/configuracoes-equipamento-dao/configuracoes-equipamento-dao';
import { Inventario } from '../../modelos/Inventario';
import { InventarioMovimentacoesDaoProvider } from '../../providers/inventario-movimentacoes-dao/inventario-movimentacoes-dao';
import { TipoDadosPatrimonioDaoProvider } from '../../providers/tipo-dados-patrimonio-dao/tipo-dados-patrimonio-dao';

Injectable()
export class PatrimonioHelper {
    
    objConfig: ConfiguracaoEquipamento = null;
    usuario: any = null;

    constructor(public tipoDadoPatrimonioDao: TipoDadosPatrimonioDaoProvider, 
        public inventarioMovimentacoesDao: InventarioMovimentacoesDaoProvider, 
        public patrimonioDao: PatrimonioDaoProvider, 
        public configEqpDao: ConfiguracoesEquipamentoDaoProvider, 
        public session: Session, 
        public atributosDoBemHelper: AtributosDoBemHelper, 
        public inventarioHelper: InventarioHelper) {
    }

    public async carregaSessaoConfig() {
        var config: ConfiguracaoEquipamento = await this.session.getConfiguracao();
        this.objConfig = new ConfiguracaoEquipamento(config);
        this.usuario = await this.session.getUsuario();
    }

    public async selecionaPatrimonioPorFiltro(banco: string, filtro: string) {
        var retorno = await this.patrimonioDao.buscaPatrimonio(banco, filtro);
        return retorno;
    }

    public async retornaPlaquetas(banco: string, codigoConsulta: string) {
        var retorno = await this.patrimonioDao.retornaPlaquetas(banco, codigoConsulta);
        return retorno;
    }

    public async inserirRegistro(banco: string, listAtributo: any[], patrimonio: Patrimonio) {
        patrimonio.dtAlteracao = Util.gerarData(new Date());
        var filtro: string = " WHERE Patrimonio.codigo = '" + patrimonio.codigo + "' COLLATE NOCASE AND Patrimonio.incorporacao = " + patrimonio.incorporacao + " AND Patrimonio.id_Filial = " + patrimonio.idFilial;

        var result = await this.patrimonioDao.buscaPatrimonio(banco, filtro);
        
        if(result == undefined) {
            if(await this.validaPatrimonio(patrimonio)) {
                //inserir registro
                var retorno = await this.patrimonioDao.inserirPatrimonio(banco, patrimonio);
                console.log('id insert Patrimonio: ', retorno);
                if (retorno == -1)
                    throw new Error("Por algum motivo o item não foi inserido\nPor favor, informe ao desenvolvimento.");
                else {
                    patrimonio.id = retorno;

                    for (var i = 0; i < listAtributo.length; i++) {
                        var atributo: AtributoDoBem = new AtributoDoBem();
                        atributo.id_patrimonio = retorno
                        atributo.idTipoDeDado = listAtributo[i].id_tipoDado
                        atributo.id_propriedade = listAtributo[i].id_propriedade
                        atributo.texto = listAtributo[i].texto
                        atributo.nome = listAtributo[i].nome
                        await this.atributosDoBemHelper.inserirRegistro(banco, atributo);
                    }
                    patrimonio.status = 'I';
                    var inventario: Inventario = new Inventario();
                    inventario.usuarioPdaLogin = this.usuario.login;
                    inventario.idPatrimonio = retorno;
                    inventario.acao = patrimonio.status;
                    await this.inventarioHelper.inserirRegistro(banco, inventario);
                }
            }
        } else {
            throw new Error("Já existe um item com o código, filial e incorporação informados.");
        }

        return retorno;
    }

    private async validaPatrimonio(patrimonio: Patrimonio ) {
        await this.carregaSessaoConfig();
        if (patrimonio.codigo.trim() == "")
            throw new Error("Codigo não informado.");

        if(patrimonio.idFilial == null)
            throw new Error("Filial não informada.");

        if(patrimonio.idEspecie == null)
            throw new Error("Espécie não informada.");

        if(patrimonio.descricao.trim() == "")
            throw new Error("Descrição não informada.");

        //Se marca é um campo obrigatorio nas configurações
        if(this.configEqpDao.getValorObg(Const.marca,this.objConfig.campoObrigatorio)) {
            if(patrimonio.marca == "")
                throw new Error("Marca não informada.");
        }

        if(this.configEqpDao.getValorObg(Const.modelo,this.objConfig.campoObrigatorio)) {
            if(patrimonio.modelo == "")
                throw new Error("Modelo não informado.");
        }

        if(this.configEqpDao.getValorObg(Const.cCusto,this.objConfig.campoObrigatorio)) {
            if(patrimonio.idCentroCusto == 0)
                throw new Error("Centro de custo não informado.");
        }

        if(this.configEqpDao.getValorObg(Const.local,this.objConfig.campoObrigatorio)) {
            if(patrimonio.idLocal == null)
                throw new Error("Local não informado.");
        }

        if(this.configEqpDao.getValorObg(Const.condicao,this.objConfig.campoObrigatorio)) {
            if(patrimonio.idCondicao == null)
                throw new Error("Condição não informada.");
        }

        if(this.configEqpDao.getValorObg(Const.responsavel,this.objConfig.campoObrigatorio)) {
            if(patrimonio.idResponsavel == null)
                throw new Error("Responsável não informado.");
        }

        if(this.configEqpDao.getValorObg(Const.serie,this.objConfig.campoObrigatorio)) {
            if(patrimonio.serie == "")
                throw new Error("Série não informada.");
        }

        if(this.configEqpDao.getValorObg(Const.codAnterior,this.objConfig.campoObrigatorio)) {
            if(patrimonio.codigoAnterior == "")
                throw new Error("Codigo anterior não informado.");
        }

        if(this.configEqpDao.getValorObg(Const.tag,this.objConfig.campoObrigatorio)) {
            if(patrimonio.tag == "")
                throw new Error("Tag não informada.");
        }

        if(this.configEqpDao.getValorObg(Const.aux1,this.objConfig.campoObrigatorio)) {
            if(patrimonio.aux1 == "")
                throw new Error(this.configEqpDao.getNomeCampoAux(Const.aux1,this.objConfig.campoObrigatorio) +" não informada.");
        }
        if(this.configEqpDao.getValorObg(Const.aux2,this.objConfig.campoObrigatorio)) {
            if(patrimonio.aux2 == "")
                throw new Error(this.configEqpDao.getNomeCampoAux(Const.aux2,this.objConfig.campoObrigatorio) +" não informada.");
        }
        if(this.configEqpDao.getValorObg(Const.aux3,this.objConfig.campoObrigatorio)) {
            if(patrimonio.aux3 == "")
                throw new Error(this.configEqpDao.getNomeCampoAux(Const.aux3,this.objConfig.campoObrigatorio) +" não informada.");
        }
        if(this.configEqpDao.getValorObg(Const.aux4,this.objConfig.campoObrigatorio)) {
            if(patrimonio.aux4 == "")
                throw new Error(this.configEqpDao.getNomeCampoAux(Const.aux4,this.objConfig.campoObrigatorio) +" não informada.");
        }
        if(this.configEqpDao.getValorObg(Const.aux5,this.objConfig.campoObrigatorio)) {
            if(patrimonio.aux5 == "")
                throw new Error(this.configEqpDao.getNomeCampoAux(Const.aux5,this.objConfig.campoObrigatorio) +" não informada.");
        }
        if(this.configEqpDao.getValorObg(Const.aux6,this.objConfig.campoObrigatorio)) {
            if(patrimonio.aux6 == "")
                throw new Error(this.configEqpDao.getNomeCampoAux(Const.aux6,this.objConfig.campoObrigatorio) +" não informada.");
        }
        if(this.configEqpDao.getValorObg(Const.aux7,this.objConfig.campoObrigatorio)) {
            if(patrimonio.aux7 == "")
                throw new Error(this.configEqpDao.getNomeCampoAux(Const.aux7,this.objConfig.campoObrigatorio) +" não informada.");
        }
        if(this.configEqpDao.getValorObg(Const.aux8,this.objConfig.campoObrigatorio)) {
            if(patrimonio.aux8 == "")
                throw new Error(this.configEqpDao.getNomeCampoAux(Const.aux8,this.objConfig.campoObrigatorio) +" não informada.");
        }
        if(this.configEqpDao.getValorObg(Const.observacao,this.objConfig.campoObrigatorio)) {
            if(patrimonio.observacao == "")
                throw new Error("Observação não informada.");
        }

       return true;

    }

    public buscaAlteracoesCampos(patrimonioOriginal: any, patrimonioAlterado: Patrimonio):  AlteracaoCampos[] {
        var alteracao: AlteracaoCampos;
        var listAlteracao : AlteracaoCampos[] = [];
        
        if(patrimonioOriginal.idFilial != patrimonioAlterado.idFilial) {
            alteracao = new AlteracaoCampos();
            alteracao.campo = "Filial";
            alteracao.idAntigo = this.nullOrString(patrimonioOriginal.idFilial);
            alteracao.idNovo = this.nullOrString(patrimonioAlterado.idFilial);
            alteracao.valorAntigo = patrimonioOriginal.Filial;
            alteracao.valorNovo = patrimonioAlterado.nomeFilial;
            listAlteracao.push(alteracao);
        }

        if(patrimonioOriginal.idEspecie != patrimonioAlterado.idEspecie) {
            alteracao = new AlteracaoCampos();
            alteracao.campo = "Especie";
            alteracao.idAntigo = this.nullOrString(patrimonioOriginal.idEspecie);
            alteracao.idNovo = this.nullOrString(patrimonioAlterado.idEspecie);
            alteracao.valorAntigo = patrimonioOriginal.Especie;
            alteracao.valorNovo = patrimonioAlterado.nomeEspecie;
            listAlteracao.push(alteracao);
        }

        if(patrimonioOriginal.descricao != patrimonioAlterado.descricao) {
            alteracao = new AlteracaoCampos();
            alteracao.campo = "Descricao";
            alteracao.idAntigo = ""
            alteracao.idNovo = ""
            alteracao.valorAntigo = patrimonioOriginal.descricao;
            alteracao.valorNovo = patrimonioAlterado.descricao;
            listAlteracao.push(alteracao);
        }

        if(patrimonioOriginal.marca != patrimonioAlterado.marca) {
            alteracao = new AlteracaoCampos();
            alteracao.campo = "Marca";
            alteracao.idAntigo = this.nullOrString(patrimonioOriginal.id_linkEspecieMarca);
            alteracao.idNovo = this.nullOrString(patrimonioAlterado.id_linkEspecieMarca);
            alteracao.valorAntigo = patrimonioOriginal.marca;
            alteracao.valorNovo = patrimonioAlterado.marca;
            listAlteracao.push(alteracao);
        }

        if(patrimonioOriginal.modelo != patrimonioAlterado.modelo) {
            alteracao = new AlteracaoCampos();
            alteracao.campo = "Modelo";
            alteracao.idAntigo = this.nullOrString(patrimonioOriginal.id_linkEspecieMarcaModelo);
            alteracao.idNovo = this.nullOrString(patrimonioAlterado.id_linkEspecieMarcaModelo);
            alteracao.valorAntigo = patrimonioOriginal.modelo;
            alteracao.valorNovo = patrimonioAlterado.modelo;
            listAlteracao.push(alteracao);
        }

        if(patrimonioOriginal.idCentroCusto != patrimonioAlterado.idCentroCusto) {
            alteracao = new AlteracaoCampos();
            alteracao.campo = "Centro de Custo";
            alteracao.idAntigo = this.nullOrString(patrimonioOriginal.idCentroCusto);
            alteracao.idNovo = this.nullOrString(patrimonioAlterado.idCentroCusto);
            alteracao.valorAntigo = patrimonioOriginal.CentroDeCusto
            alteracao.valorNovo = patrimonioAlterado.nomeCentroCusto
            listAlteracao.push(alteracao);
        }

        if(patrimonioOriginal.idLocal != patrimonioAlterado.idLocal) {
            alteracao = new AlteracaoCampos();
            alteracao.campo = "Local";
            alteracao.idAntigo = this.nullOrString(patrimonioOriginal.idLocal);
            alteracao.idNovo = this.nullOrString(patrimonioAlterado.idLocal);
            alteracao.valorAntigo = patrimonioOriginal.Local
            alteracao.valorNovo = patrimonioAlterado.nomeLocal
            listAlteracao.push(alteracao);
        }
        if(patrimonioOriginal.idCondicao != patrimonioAlterado.idCondicao) {
            alteracao = new AlteracaoCampos();
            alteracao.campo = "Condicao de Uso";
            alteracao.idAntigo = this.nullOrString(patrimonioOriginal.idCondicao);
            alteracao.idNovo = this.nullOrString(patrimonioAlterado.idCondicao);
            alteracao.valorAntigo = patrimonioOriginal.Condicao
            alteracao.valorNovo = patrimonioAlterado.nomeCondicao
            listAlteracao.push(alteracao);
        }

        if(patrimonioOriginal.idResponsavel != patrimonioAlterado.idResponsavel) {
            alteracao = new AlteracaoCampos();
            alteracao.campo = "Responsavel";
            alteracao.idAntigo = this.nullOrString(patrimonioOriginal.idResponsavel);
            alteracao.idNovo = this.nullOrString(patrimonioAlterado.idResponsavel);
            alteracao.valorAntigo = patrimonioOriginal.Responsavel
            alteracao.valorNovo = patrimonioAlterado.nomeResponsavel
            listAlteracao.push(alteracao);
        }

        if(patrimonioOriginal.serie != patrimonioAlterado.serie) {
            alteracao = new AlteracaoCampos();
            alteracao.campo = "Serie";
            alteracao.idAntigo = ""
            alteracao.idNovo = ""
            alteracao.valorAntigo = patrimonioOriginal.serie;
            alteracao.valorNovo = patrimonioAlterado.serie;
            listAlteracao.push(alteracao);
        }

        if(patrimonioOriginal.codigoAnterior != patrimonioAlterado.codigoAnterior) {
            alteracao = new AlteracaoCampos();
            alteracao.campo = "Codigo Anterior";
            alteracao.idAntigo = ""
            alteracao.idNovo = ""
            alteracao.valorAntigo = patrimonioOriginal.codigoAnterior;
            alteracao.valorNovo = patrimonioAlterado.codigoAnterior;
            listAlteracao.push(alteracao);
        }

        if(patrimonioOriginal.incorporacaoAnterior != patrimonioAlterado.incorporacaoAnterior) {
            alteracao = new AlteracaoCampos();
            alteracao.campo = "Incorporacao Anterior";
            alteracao.idAntigo = ""
            alteracao.idNovo = ""
            alteracao.valorAntigo = this.nullOrString(patrimonioOriginal.incorporacaoAnterior);
            alteracao.valorNovo = this.nullOrString(patrimonioAlterado.incorporacaoAnterior);
            listAlteracao.push(alteracao);
        }

        if(patrimonioOriginal.tag != patrimonioAlterado.tag) {
            alteracao = new AlteracaoCampos();
            alteracao.campo = "TAG";
            alteracao.idAntigo = ""
            alteracao.idNovo = ""
            alteracao.valorAntigo = patrimonioOriginal.tag;
            alteracao.valorNovo = patrimonioAlterado.tag;
            listAlteracao.push(alteracao);
        }

        if(patrimonioOriginal.aux1 != patrimonioAlterado.aux1) {
            alteracao = new AlteracaoCampos();
            alteracao.campo = "AUX1";
            alteracao.idAntigo = ""
            alteracao.idNovo = ""
            alteracao.valorAntigo = patrimonioOriginal.aux1;
            alteracao.valorNovo = patrimonioAlterado.aux1;
            listAlteracao.push(alteracao);
        }

        if(patrimonioOriginal.aux2 != patrimonioAlterado.aux2) {
            alteracao = new AlteracaoCampos();
            alteracao.campo = "AUX2";
            alteracao.idAntigo = ""
            alteracao.idNovo = ""
            alteracao.valorAntigo = patrimonioOriginal.aux2;
            alteracao.valorNovo = patrimonioAlterado.aux2;
            listAlteracao.push(alteracao);
        }

        if(patrimonioOriginal.aux3 != patrimonioAlterado.aux3) {
            alteracao = new AlteracaoCampos();
            alteracao.campo = "AUX3";
            alteracao.idAntigo = ""
            alteracao.idNovo = ""
            alteracao.valorAntigo = patrimonioOriginal.aux3;
            alteracao.valorNovo = patrimonioAlterado.aux3;
            listAlteracao.push(alteracao);
        }

        if(patrimonioOriginal.aux4 != patrimonioAlterado.aux4) {
            alteracao = new AlteracaoCampos();
            alteracao.campo = "AUX4";
            alteracao.idAntigo = ""
            alteracao.idNovo = ""
            alteracao.valorAntigo = patrimonioOriginal.aux4;
            alteracao.valorNovo = patrimonioAlterado.aux4;
            listAlteracao.push(alteracao);
        }

        if(patrimonioOriginal.aux5 != patrimonioAlterado.aux5) {
            alteracao = new AlteracaoCampos();
            alteracao.campo = "AUX5";
            alteracao.idAntigo = ""
            alteracao.idNovo = ""
            alteracao.valorAntigo = patrimonioOriginal.aux5;
            alteracao.valorNovo = patrimonioAlterado.aux5;
            listAlteracao.push(alteracao);
        }

        if(patrimonioOriginal.aux6 != patrimonioAlterado.aux6) {
            alteracao = new AlteracaoCampos();
            alteracao.campo = "AUX6";
            alteracao.idAntigo = ""
            alteracao.idNovo = ""
            alteracao.valorAntigo = patrimonioOriginal.aux6;
            alteracao.valorNovo = patrimonioAlterado.aux6;
            listAlteracao.push(alteracao);
        }

        if(patrimonioOriginal.aux7 != patrimonioAlterado.aux7) {
            alteracao = new AlteracaoCampos();
            alteracao.campo = "AUX7";
            alteracao.idAntigo = ""
            alteracao.idNovo = ""
            alteracao.valorAntigo = patrimonioOriginal.aux7;
            alteracao.valorNovo = patrimonioAlterado.aux7;
            listAlteracao.push(alteracao);
        }

        if(patrimonioOriginal.aux8 != patrimonioAlterado.aux8) {
            alteracao = new AlteracaoCampos();
            alteracao.campo = "AUX7";
            alteracao.idAntigo = ""
            alteracao.idNovo = ""
            alteracao.valorAntigo = patrimonioOriginal.aux7;
            alteracao.valorNovo = patrimonioAlterado.aux7;
            listAlteracao.push(alteracao);
        }

        if(patrimonioOriginal.observacao != patrimonioAlterado.observacao) {
            alteracao = new AlteracaoCampos();
            alteracao.campo = "Observacao";
            alteracao.idAntigo = ""
            alteracao.idNovo = ""
            alteracao.valorAntigo = patrimonioOriginal.observacao;
            alteracao.valorNovo = patrimonioAlterado.observacao;
            listAlteracao.push(alteracao);
        }

        return listAlteracao;
    }

    public buscaAlteracoesPropriedade(listAtributoOriginal: any[], listAtributoAlterado: any[]):  AlteracaoCampos[] {
        var alteracao: AlteracaoCampos;
        var listAlteracao : AlteracaoCampos[] = [];

        for(var i = 0; i < listAtributoAlterado.length; i++) {
            var valorAntigo: string = this.preencheValorAntigo(listAtributoOriginal, listAtributoAlterado[i].id_propriedade);

            if(valorAntigo != listAtributoAlterado[i].texto) {
                alteracao = new AlteracaoCampos();
                alteracao.idPropriedade = listAtributoAlterado[i].id_propriedade.toString();
                alteracao.campo = listAtributoAlterado[i].campo;
                alteracao.idAntigo = ""
                alteracao.idNovo = ""
                alteracao.valorAntigo = valorAntigo;
                alteracao.valorNovo = listAtributoAlterado[i].texto;
                listAlteracao.push(alteracao);
            }
        }

        if(listAtributoAlterado.length == 0 && listAtributoOriginal.length > 0) {
            for(var i = 0; i < listAtributoOriginal.length; i++) {
                listAtributoAlterado.push({id_propriedade: listAtributoOriginal[i].id_propriedade
                    , id_tipoDado: listAtributoOriginal[i].id_tipoDado
                    , nome: listAtributoOriginal[i].nome
                    , texto: listAtributoOriginal[i].texto})
            }
        }

        return listAlteracao;
    }

    private preencheValorAntigo(listAtributoOriginal: any[], idPropriedade: number) {
        var valorAntigo: string = '';
        var index: number;
        for(var i=0; i < listAtributoOriginal.length; i++) {
            if(listAtributoOriginal[i].id_propriedade == idPropriedade) {
                valorAntigo = listAtributoOriginal[i].texto;
                index = i;
                i = listAtributoOriginal.length;
            }
        }

        if(index != undefined && listAtributoOriginal[index].id_tipoDado == 2 && valorAntigo == '') {
            valorAntigo = '0';
        }

        return valorAntigo;
    }

    public async alterarRegistro(banco: string, listAltercaoCampos: AlteracaoCampos[], listAltercaoPropriedades: AlteracaoCampos[], 
        patrimonio: Patrimonio, atributoDoBem: AtributoDoBem[]) {
        var retorno;
        if(patrimonio.status != 'B') {
            if(listAltercaoCampos.length == 0 && listAltercaoPropriedades.length == 0)
                patrimonio.status = "R";
            else
                patrimonio.status = "A";
        }

        if(await this.validaPatrimonio(patrimonio)) {
            patrimonio.dtAlteracao = Util.gerarData(new Date());
            retorno = await this.patrimonioDao.alterarPatrimonio(banco, patrimonio);  
            
            if (retorno > 0) {
                await this.atributosDoBemHelper.alterarPropriedade(banco, atributoDoBem, patrimonio);
                var inventario: Inventario = new Inventario();
                inventario.usuarioPdaLogin = this.usuario.login;
                inventario.idPatrimonio = patrimonio.id;
                inventario.acao = patrimonio.status;
                var idInventario = await this.inventarioHelper.inserirRegistro(banco, inventario);

                if(listAltercaoCampos.length > 0 || listAltercaoPropriedades.length > 0) {
                    var inventarioMovimentacoesHelper: InventarioMovimentacoesHelper = new InventarioMovimentacoesHelper(this.inventarioMovimentacoesDao, this.tipoDadoPatrimonioDao);
                    try {
                        await inventarioMovimentacoesHelper.inserirRegistro(banco, idInventario, listAltercaoCampos, listAltercaoPropriedades);
                    } catch(err) {
                        alert(err);
                    }
                }
            }
        }

        return retorno;
    }

    async retornaTotalBensNoIntervalo(banco: string, idFilial: number, incorporacao: number, codigoInicial: number, codigoFinal: number, mascara: string) {
        var filtro: string = '';
        for(var i = codigoInicial; i < codigoFinal; i++) {
            if(i == codigoInicial)
                filtro += " codigo in ('" + Util.aplicaMascara(mascara, i.toString()) + "',";
            else 
            filtro += "'" + Util.aplicaMascara(mascara, i.toString()) + "',";
        }
        filtro = filtro.substring(0, filtro.length - 1) + ')';


        var retorno = await this.patrimonioDao.retornaTotalBensNoIntervalo(banco, idFilial, incorporacao, filtro);
        if(retorno > 0)
            return true;
        else
            return false;
    }

    nullOrString(dado) {
        if(dado == null)
            return null;
        else
            return dado + '';
    }

}