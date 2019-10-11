import { ConfiguracaoEquipamento } from './../../modelos/ConfiguracaoEquipamento';
import { CodigoFicticioDaoProvider } from './../../providers/codigo-ficticio-dao/codigo-ficticio-dao';
import { Injectable } from "@angular/core";
import { Session } from '../../providers/session/session';
import { PatrimonioDaoProvider } from '../../providers/patrimonio-dao/patrimonio-dao';
import { Util } from '../Util';

Injectable()
export class CodigoFicticioHelper {
    
    usuario: any;
    cliente: any;
    objConfig: ConfiguracaoEquipamento;
    
    constructor(public codigoFicticioDao: CodigoFicticioDaoProvider, public session: Session, public patrimonioDao: PatrimonioDaoProvider) { }

    public async carregaSessaoConfig() {
        var config: ConfiguracaoEquipamento = await this.session.getConfiguracao();
        this.objConfig = new ConfiguracaoEquipamento(config);
        this.cliente = await this.session.getClienteSelecionado();
        this.usuario = await this.session.getUsuario();
    }

    public async buscaProximoFicticio() {
        var ficticio = "0";
        var ultimoUtilizado = 0;

        var codigoFicticio = await this.retornaIntervalo();

        if(codigoFicticio == undefined) {
            alert('Não existe intervalo para o usuario '+this.usuario.login);
            return codigoFicticio;
        }

        if(codigoFicticio.validado == 1) {
            codigoFicticio.ultimoUtilizado++;
            if(codigoFicticio.ultimoUtilizado >= codigoFicticio.de && codigoFicticio.ultimoUtilizado <= codigoFicticio.ate) {
                ficticio = this.retornaFicticioFormatado(this.objConfig.mascara, codigoFicticio.ultimoUtilizado);
                ultimoUtilizado = codigoFicticio.ultimoUtilizado;
            } else {
                ficticio = "0";
                var ultimoEncontrado = await this.retornaUltimoFicticioEncontradoNoPatrimonio(this.cliente.banco);
                alert("Fim de intervalo gravado\nComunique imediatamente seu supervisor.\n\nDe:" + codigoFicticio.de + "\nAté:" + codigoFicticio.ate + "\nTentou utilizar:" + codigoFicticio.ultimoUtilizado + "\nEncontrou no patrimônio:" + ultimoEncontrado)
            }   
        } else {
            var ultimoEncontrado = await this.retornaUltimoFicticioEncontradoNoPatrimonio(this.cliente.banco);

            if(ultimoEncontrado != undefined && ultimoEncontrado != null) {
                if(codigoFicticio.ultimoUtilizado == 0) {
                    ficticio = this.retornaFicticioFormatado(this.objConfig.mascara, codigoFicticio.ultimoUtilizado);
                    ultimoUtilizado = codigoFicticio.ultimoUtilizado;
                    alert('Não existe intervalo para o usuario '+this.usuario.login+ ' e nem foi utilizado nenhum código ficticio até o momento nesta base de dados.')
                } else if (++codigoFicticio.ultimoUtilizado >= codigoFicticio.de && codigoFicticio.ultimoUtilizado <= codigoFicticio.ate) {
                    ficticio = this.retornaFicticioFormatado(this.objConfig.mascara, codigoFicticio.ultimoUtilizado);
                    ultimoUtilizado = codigoFicticio.ultimoUtilizado;
                } else {
                    ficticio = "0";
                    ultimoUtilizado = 0;
                    alert('Fim de intervalo gravado\nComunique imediatamente seu supervisor.\n\nDe:' + codigoFicticio.de + '\nAté:' + codigoFicticio.ate + '\nTentou utilizar:' + codigoFicticio.ultimoUtilizado + '\nEncontrou no patrimônio:' + ultimoEncontrado);
                }
            } else {
                if(ultimoEncontrado == codigoFicticio.ultimoUtilizado) {
                    codigoFicticio.ultimoUtilizado++;
                    if(codigoFicticio.ultimoUtilizado >= codigoFicticio.de && codigoFicticio.ultimoUtilizado <= codigoFicticio.ate) {
                        ficticio = this.retornaFicticioFormatado(this.objConfig.mascara, codigoFicticio.ultimoUtilizado);
                        ultimoUtilizado = codigoFicticio.ultimoUtilizado;
                    } else if (codigoFicticio.ultimoUtilizado > codigoFicticio.ate) {
                        ficticio = "0";
                        ultimoUtilizado = 0;
                        alert('Fim de intervalo gravado\nComunique imediatamente seu supervisor.\nDe:' + codigoFicticio.De + '\nAté:' + codigoFicticio.Ate + '\nTentou utilizar:' + codigoFicticio.ultimoUtilizado + '\nÚltimo encontrado:' + ultimoEncontrado);
                    }
                } else {
                    if (ultimoEncontrado < codigoFicticio.ultimoUtilizado) {
                        ficticio = this.retornaFicticioFormatado(this.objConfig.mascara, codigoFicticio.ultimoUtilizado);
                        ultimoUtilizado = codigoFicticio.ultimoUtilizado;
                    } else if (ultimoEncontrado > codigoFicticio.ultimoUtilizado) {
                        ficticio = "0";
                        ultimoUtilizado = 0;
                        alert('INFORME IMEDIATAMENTE SEU SUPERVISOR \nO Último número encontrato no patrimônio é maior do que o último número que foi enviado pelo Desktop para o PDA. \nDe:' + codigoFicticio.de + '\nAté:' + codigoFicticio.ate + '\nÚltimo Número Enviado:' + codigoFicticio.ultimoUtilizado + '\nÚltimo Número Encontrado:' + ultimoEncontrado);
                    }
                }
            }
        }
        codigoFicticio.ficticio = ficticio;
        codigoFicticio.ultimoEncontrado = ultimoEncontrado;
        return codigoFicticio;
    }

    public async retornaIntervalo() {
        await this.carregaSessaoConfig();
        var retorno = await this.codigoFicticioDao.retornaIntervalo(this.usuario.id, this.cliente.id);
        return retorno;
    }

    private retornaFicticioFormatado(mascara: string, numero: number): string {
        var numeroFicticio = Util.aplicaMascara(mascara, numero.toString());
        return numeroFicticio + 'F';
    }

    private async retornaUltimoFicticioEncontradoNoPatrimonio(banco: string) {
        var retorno = await this.patrimonioDao.retornaUltimoFicticioEncontradoPatrimonio(banco);
        return retorno;
    }

    public async atualizaFicticio(objFicticio: any) {
        var retorno = await this.codigoFicticioDao.atualizaCodigoFicticio(objFicticio);
        return retorno;
    }
}