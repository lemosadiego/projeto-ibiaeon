import { FotoDoBem } from './../../modelos/FotoDoBem';
import { FotosDaoProvider } from './../../providers/fotos-dao/fotos-dao';
import { Injectable } from '@angular/core';
import { Util } from '../Util';

Injectable()
export class FotosDoBemHelper {
    
    constructor(public fotosDoBemDao: FotosDaoProvider ) {  }

    public async inserirRegistro(banco: string, fotoDoBem: FotoDoBem) {
        fotoDoBem.dtInsercao = Util.gerarData(new Date());
        var retorno: number = await this.fotosDoBemDao.inserirRegistro(banco, fotoDoBem);
        return retorno;
    }

    public async alterarRegistro(banco: string, fotoDoBem: FotoDoBem) {
        fotoDoBem.dtInsercao = Util.gerarData(new Date());
        var retorno: number = await this.fotosDoBemDao.alterarRegistro(banco, fotoDoBem);
        return retorno;
    }

    public async retornaRegistros(banco: string, codigoPatrimonio: string) {
        var retorno: any = await this.fotosDoBemDao.retornaRegistros(banco, codigoPatrimonio);
        console.log('Fotos', retorno);
        return retorno;
    }

}