import { Model } from "./Model";

export class ConfiguracaoEquipamento extends Model {

    private _mascara: string;
    private _tamanhoMascara: string;
    private _usarMascara: number;
    private _revisaoRapida: number;
    private _numeroFotos: number;
    private _campoAuxiliar: any[];
    private _campoObrigatorio: any[];
    private _campoFixado: any[];
    private _campoRevisar: any[];

    /*constructor (mascara: string,
        revisaoRapida: number,
        numeroFotos: number, 
        campoAuxiliar: Map<string,string>, 
        campoObrigatorio: Map<string,string>,
        campoFixado: Map<string,string>,
        campoRevisar: Map<string,string> ) {
        
        this.mascara = mascara;
        this.revisaoRapida = revisaoRapida;
        this.numeroFotos = numeroFotos;
        this.campoAuxiliar = campoAuxiliar;
        this.campoObrigatorio = campoObrigatorio;
        this.campoFixado = campoFixado;
        this.campoRevisar = campoRevisar;
        }*/

    public get mascara(): string {
        return this._mascara;
    }
    public set mascara(value: string) {
        this._mascara = value;
    }
    public get tamanhoMascara(): string {
        return this._tamanhoMascara;
    }
    public set tamanhoMascara(value: string) {
        this._tamanhoMascara = value;
    }
    public get usarMascara(): number {
        return this._usarMascara;
    }
    public set usarMascara(value: number) {
        this._usarMascara = value;
    }
    public get revisaoRapida(): number {
        return this._revisaoRapida;
    }
    public set revisaoRapida(value: number) {
        this._revisaoRapida = value;
    }
    public get numeroFotos(): number {
        return this._numeroFotos;
    }
    public set numeroFotos(value: number) {
        this._numeroFotos = value;
    }
    public get campoAuxiliar(): any[] {
        return this._campoAuxiliar;
    }
    public set campoAuxiliar(value: any[]) {
        this._campoAuxiliar = value;
    }
    public get campoObrigatorio(): any[] {
        return this._campoObrigatorio;
    }
    public set campoObrigatorio(value: any[]) {
        this._campoObrigatorio = value;
    }
    public get campoFixado(): any[] {
        return this._campoFixado;
    }
    public set campoFixado(value: any[]) {
        this._campoFixado = value;
    }
    public get campoRevisar(): any[] {
        return this._campoRevisar;
    }
    public set campoRevisar(value: any[]) {
        this._campoRevisar = value;
    }
    

}