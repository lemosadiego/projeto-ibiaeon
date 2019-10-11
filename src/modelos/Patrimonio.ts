
export class Patrimonio {
    private _id: number;
    private _idFilial: number;
    private _nomeFilial: string;
    private _idEspecie: number;
    private _nomeEspecie: string;    
    private _idCondicao: number;
    private _nomeCondicao: string;    
    private _idResponsavel: number;
    private _nomeResponsavel: string;    
    private _idCentroCusto: number;
    private _nomeCentroCusto: string;    
    private _idLocal: number;
    private _nomeLocal: string;    
    private _codigo: string;
    private _codigoAnterior: string;
    private _incorporacao: number;
    private _incorporacaoAnterior: number;
    private _descricao: string;
    private _serie: string;
    private _observacao: string;
    private _tag: string;
    private _aux1: string;
    private _aux2: string;
    private _aux3: string;
    private _aux4: string;
    private _aux5: string;
    private _aux6: string;
    private _aux7: string;
    private _aux8: string;
    private _status: string;
    private _latitude: string;
    private _longitude: string;
    private _altitude: string;
    private _seq: number;
    private _gravado: number;
    private _numeroFicticio: number;
    private _id_linkEspecieMarca: number;
    private _id_linkEspecieMarcaModelo: number;
    private _marca: string;
    private _modelo: string;
    private _dtAlteracao: string;
    private _ultimoUsuario: string;
    private _codigoFilial: string;

    constructor() {
        this.id = null;
        this.idFilial = null
        this.idEspecie = null
        this.idResponsavel = null;
        this.idCentroCusto = 0; 
        this.idLocal = null;
        this.codigo = null;
        this.codigoFilial = null;
        this.codigoAnterior = "";
        this.incorporacao = null;
        this.incorporacaoAnterior = 0;
        this.descricao = "";
        this.serie = null;
        this.observacao = "";
        this.tag = null;
        this.aux1 = "";
        this.aux2 = "";
        this.aux3 = "";
        this.aux4 = "";
        this.aux5 = "";
        this.aux6 = "";
        this.aux7 = "";
        this.aux8 = "";
        this.status = "";
        this.latitude = "";
        this.longitude = "";
        this.altitude = "";
        this.seq = null;
        this.gravado = null;
        this.numeroFicticio = null;
        this.id_linkEspecieMarca = 0;
        this.id_linkEspecieMarcaModelo = null;
        this.marca = "";
        this.modelo = "";
        this.dtAlteracao = "";
        this.ultimoUsuario = "";
    }

    public getAtributosToArray() : any[] {
        var arrayValues = [];
        arrayValues.push(this.idFilial);
        arrayValues.push(this.idEspecie);
        arrayValues.push(this.idCondicao);
        arrayValues.push(this.idResponsavel);
        arrayValues.push(this.idCentroCusto); 
        arrayValues.push(this.idLocal);
        arrayValues.push(this.codigo);
        arrayValues.push(this.codigoAnterior);
        arrayValues.push(this.incorporacao);
        arrayValues.push(this.incorporacaoAnterior);
        arrayValues.push(this.descricao.toUpperCase());
        arrayValues.push(this.serie.toUpperCase());
        arrayValues.push(this.observacao.toUpperCase());
        arrayValues.push(this.tag.toUpperCase());
        arrayValues.push(this.aux1.toUpperCase());
        arrayValues.push(this.aux2.toUpperCase());
        arrayValues.push(this.aux3.toUpperCase());
        arrayValues.push(this.aux4.toUpperCase());
        arrayValues.push(this.aux5.toUpperCase());
        arrayValues.push(this.aux6.toUpperCase());
        arrayValues.push(this.aux7.toUpperCase());
        arrayValues.push(this.aux8.toUpperCase());
        arrayValues.push(this.status);
        arrayValues.push(this.latitude);
        arrayValues.push(this.longitude);
        arrayValues.push(this.altitude);
        arrayValues.push(this.seq);
        arrayValues.push(this.gravado);
        arrayValues.push(this.numeroFicticio);
        arrayValues.push(this.id_linkEspecieMarca);
        arrayValues.push(this.id_linkEspecieMarcaModelo);
        arrayValues.push(this.marca.toUpperCase());
        arrayValues.push(this.modelo.toUpperCase());
        arrayValues.push(this.dtAlteracao);
        arrayValues.push(this.ultimoUsuario.toUpperCase());
        return arrayValues;
    }

    public getAtributosUpdateToArray() : any[] {
        var arrayValues = [];
        arrayValues.push(this.idFilial);
        arrayValues.push(this.idEspecie);
        arrayValues.push(this.idCondicao);
        arrayValues.push(this.idResponsavel);
        arrayValues.push(this.idCentroCusto); 
        arrayValues.push(this.idLocal);
        arrayValues.push(this.codigoAnterior);
        arrayValues.push(this.incorporacaoAnterior);
        arrayValues.push(this.descricao.toUpperCase());
        arrayValues.push(this.serie.toUpperCase());
        arrayValues.push(this.observacao.toUpperCase());
        arrayValues.push(this.aux1.toUpperCase());
        arrayValues.push(this.aux2.toUpperCase());
        arrayValues.push(this.aux3.toUpperCase());
        arrayValues.push(this.aux4.toUpperCase());
        arrayValues.push(this.aux5.toUpperCase());
        arrayValues.push(this.aux6.toUpperCase());
        arrayValues.push(this.aux7.toUpperCase());
        arrayValues.push(this.aux8.toUpperCase());
        arrayValues.push(this.tag.toUpperCase());
        arrayValues.push(this.status);
        arrayValues.push(this.latitude);
        arrayValues.push(this.longitude);
        arrayValues.push(this.altitude);
        arrayValues.push(this.numeroFicticio);
        arrayValues.push(this.id_linkEspecieMarca);
        arrayValues.push(this.id_linkEspecieMarcaModelo);
        arrayValues.push(this.marca.toUpperCase());
        arrayValues.push(this.modelo.toUpperCase());
        arrayValues.push(this.dtAlteracao);
        arrayValues.push(this.ultimoUsuario.toUpperCase());
        arrayValues.push(this.id);

        return arrayValues
    }
    public get id(): number {
        return this._id;
    }
    public set id(value: number) {
        this._id = value;
    }
    public get idFilial(): number {
        return this._idFilial;
    }
    public set idFilial(value: number) {
        this._idFilial = value;
    }
    public get nomeFilial(): string {
        return this._nomeFilial;
    }
    public set nomeFilial(value: string) {
        this._nomeFilial = value;
    }
    public get idEspecie(): number {
        return this._idEspecie;
    }
    public set idEspecie(value: number) {
        this._idEspecie = value;
    }
    public get nomeEspecie(): string {
        return this._nomeEspecie;
    }
    public set nomeEspecie(value: string) {
        this._nomeEspecie = value;
    }
    public get idCondicao(): number {
        return this._idCondicao;
    }
    public set idCondicao(value: number) {
        this._idCondicao = value;
    }
    public get nomeCondicao(): string {
        return this._nomeCondicao;
    }
    public set nomeCondicao(value: string) {
        this._nomeCondicao = value;
    }
    public get idResponsavel(): number {
        return this._idResponsavel;
    }
    public set idResponsavel(value: number) {
        this._idResponsavel = value;
    }
    public get nomeResponsavel(): string {
        return this._nomeResponsavel;
    }
    public set nomeResponsavel(value: string) {
        this._nomeResponsavel = value;
    }
    public get idCentroCusto(): number {
        return this._idCentroCusto;
    }
    public set idCentroCusto(value: number) {
        this._idCentroCusto = value;
    }
    public get nomeCentroCusto(): string {
        return this._nomeCentroCusto;
    }
    public set nomeCentroCusto(value: string) {
        this._nomeCentroCusto = value;
    }
    public get idLocal(): number {
        return this._idLocal;
    }
    public set idLocal(value: number) {
        this._idLocal = value;
    }
    public get nomeLocal(): string {
        return this._nomeLocal;
    }
    public set nomeLocal(value: string) {
        this._nomeLocal = value;
    }
    public get codigo(): string {
        return this._codigo;
    }
    public set codigo(value: string) {
        this._codigo = value;
    }
    public get codigoFilial(): string {
        return this._codigoFilial;
    }
    public set codigoFilial(value: string) {
        this._codigoFilial = value;
    }
    public get codigoAnterior(): string {
        return this._codigoAnterior;
    }
    public set codigoAnterior(value: string) {
        this._codigoAnterior = value;
    }
    public get incorporacao(): number {
        return this._incorporacao;
    }
    public set incorporacao(value: number) {
        this._incorporacao = value;
    }
    public get incorporacaoAnterior(): number {
        return this._incorporacaoAnterior;
    }
    public set incorporacaoAnterior(value: number) {
        this._incorporacaoAnterior = value;
    }
    public get descricao(): string {
        return this._descricao;
    }
    public set descricao(value: string) {
        this._descricao = value;
    }
    public get serie(): string {
        return this._serie;
    }
    public set serie(value: string) {
        this._serie = value;
    }
    public get observacao(): string {
        return this._observacao;
    }
    public set observacao(value: string) {
        this._observacao = value;
    }
    public get tag(): string {
        return this._tag;
    }
    public set tag(value: string) {
        this._tag = value;
    }
    public get aux1(): string {
        return this._aux1;
    }
    public set aux1(value: string) {
        this._aux1 = value;
    }
    public get aux2(): string {
        return this._aux2;
    }
    public set aux2(value: string) {
        this._aux2 = value;
    }
    public get aux3(): string {
        return this._aux3;
    }
    public set aux3(value: string) {
        this._aux3 = value;
    }
    public get aux4(): string {
        return this._aux4;
    }
    public set aux4(value: string) {
        this._aux4 = value;
    }
    public get aux5(): string {
        return this._aux5;
    }
    public set aux5(value: string) {
        this._aux5 = value;
    }
    public get aux6(): string {
        return this._aux6;
    }
    public set aux6(value: string) {
        this._aux6 = value;
    }
    public get aux7(): string {
        return this._aux7;
    }
    public set aux7(value: string) {
        this._aux7 = value;
    }
    public get aux8(): string {
        return this._aux8;
    }
    public set aux8(value: string) {
        this._aux8 = value;
    }
    public get status(): string {
        return this._status;
    }
    public set status(value: string) {
        this._status = value;
    }
    public get latitude(): string {
        return this._latitude;
    }
    public set latitude(value: string) {
        this._latitude = value;
    }
    public get longitude(): string {
        return this._longitude;
    }
    public set longitude(value: string) {
        this._longitude = value;
    }
    public get altitude(): string {
        return this._altitude;
    }
    public set altitude(value: string) {
        this._altitude = value;
    }
    public get seq(): number {
        return this._seq;
    }
    public set seq(value: number) {
        this._seq = value;
    }
    public get gravado(): number {
        return this._gravado;
    }
    public set gravado(value: number) {
        this._gravado = value;
    }
    public get numeroFicticio(): number {
        return this._numeroFicticio;
    }
    public set numeroFicticio(value: number) {
        this._numeroFicticio = value;
    }
    public get id_linkEspecieMarca(): number {
        return this._id_linkEspecieMarca;
    }
    public set id_linkEspecieMarca(value: number) {
        this._id_linkEspecieMarca = value;
    }
    public get id_linkEspecieMarcaModelo(): number {
        return this._id_linkEspecieMarcaModelo;
    }
    public set id_linkEspecieMarcaModelo(value: number) {
        this._id_linkEspecieMarcaModelo = value;
    }
    public get marca(): string {
        return this._marca;
    }
    public set marca(value: string) {
        this._marca = value;
    }
    public get modelo(): string {
        return this._modelo;
    }
    public set modelo(value: string) {
        this._modelo = value;
    }
    public get dtAlteracao(): string {
        return this._dtAlteracao;
    }
    public set dtAlteracao(value: string) {
        this._dtAlteracao = value;
    }
    public get ultimoUsuario(): string {
        return this._ultimoUsuario;
    }
    public set ultimoUsuario(value: string) {
        this._ultimoUsuario = value;
    }

}