import { LookUpDaoProvider } from './../../providers/look-up-dao/look-up-dao';
import { Injectable } from "@angular/core";

Injectable()
export class LookUpHelper {
    

    constructor(public lookUpDaoProvider: LookUpDaoProvider) {
    }

    async retornaValorLookUpPorPropriedade(banco: string, idPropriedade: number) {
        var retorno = await this.lookUpDaoProvider.retornaValorLookUpPorPropriedade(banco, idPropriedade);
        return retorno;
    }

}