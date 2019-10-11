import { AtributoDoBem } from './../../modelos/AtributoDoBem';
import { AtributosDoBemDaoProvider } from './../../providers/atributos-do-bem-dao/atributos-do-bem-dao';
import { Injectable } from '@angular/core';
import { Patrimonio } from '../../modelos/Patrimonio';
import { Util } from '../Util';

Injectable()
export class AtributosDoBemHelper {
    
    constructor(public atributosDoBemDao: AtributosDoBemDaoProvider ) {  }

    public async inserirRegistro(banco: string, atributosDoBem: AtributoDoBem) {
        atributosDoBem.dtInsercao = Util.gerarData(new Date());
        var retorno: number = await this.atributosDoBemDao.inserirRegistro(banco, atributosDoBem);
        return retorno;
    }

    public async buscaAtributosDoBemPorPatrimonio(banco: string, idPatrimonio: number) {
        var retorno: any = await this.atributosDoBemDao.buscaAtributosDoBemPorPatrimonio(banco, idPatrimonio);
        return retorno;
    }

    public async buscaAtributosDoBemPorEspecie(banco: string, idEspecie: number) {
        var retorno: any = await this.atributosDoBemDao.buscaAtributosDoBemPorEspecie(banco, idEspecie);
        return retorno;
    }

    public async alterarPropriedade(banco: string, listAtributo: any[], patrimonio: Patrimonio) {
        var dtAlteracao = Util.gerarData(new Date());
        if(listAtributo.length > 0) {
            await this.atributosDoBemDao.excluirRegistros(banco, patrimonio.id);

            for (var i = 0; i < listAtributo.length; i++) {
                var propriedade: AtributoDoBem = new AtributoDoBem();
                propriedade.id_patrimonio = patrimonio.id;
                propriedade.id_propriedade = listAtributo[i].id_propriedade;
                propriedade.texto = listAtributo[i].texto;
                propriedade.dtInsercao = dtAlteracao;
                await this.atributosDoBemDao.inserirRegistro(banco, propriedade);
            }
        }
    }

}