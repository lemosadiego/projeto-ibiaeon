import { Util } from './../Util';
import { Injectable } from '@angular/core';
import { InventarioDaoProvider } from './../../providers/inventario-dao/inventario-dao';
import { Inventario } from "../../modelos/Inventario";

Injectable()
export class InventarioHelper {
    
    constructor(public inventarioDao: InventarioDaoProvider) {}

    public async inserirRegistro(banco: string, inventario: Inventario) {
        inventario.dataGravacao = Util.gerarData(new Date());
        var retorno: number = await this.inventarioDao.inserirRegistro(banco, inventario);
        return retorno;
    } 
}