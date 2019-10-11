import { InventarioConsultaDaoProvider } from './../../providers/inventario-consulta-dao/inventario-consulta-dao';
import { Injectable } from "@angular/core";

Injectable()
export class ConsultaHelper {
    
    constructor(public inventarioConsultaDao: InventarioConsultaDaoProvider) { }

    public async retornaRegistros(banco: string, camposConsulta: string, filtrosConsulta: string, gruposConsulta: string, dataHora: string) {
        if(filtrosConsulta == undefined){
            filtrosConsulta = "";
        }
        var retorno = await this.inventarioConsultaDao.retornaRegistros(banco, camposConsulta, filtrosConsulta, gruposConsulta, dataHora);
        return retorno;
    }
    
}