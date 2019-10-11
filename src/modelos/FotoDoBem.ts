export class FotoDoBem {
    
    private _id: number;
    private _codigoFilial: number;
    private _codigoPatrimonio: number;
    private _incorporacao: string;       
    private _nomeFoto: string;
    private _dtInsercao: string;
    private _syncToServer: number;
    
    
    
    constructor() {}

    public getAtributosToArray() : any[] {
        var arrayValues = [];
        arrayValues.push(this.codigoFilial);
        arrayValues.push(this.codigoPatrimonio);
        arrayValues.push(this.incorporacao);
        arrayValues.push(this.nomeFoto);
        arrayValues.push(this.dtInsercao);
        arrayValues.push(0);

        return arrayValues;
    }
    public get syncToServer(): number {
        return this._syncToServer;
    }
    public set syncToServer(value: number) {
        this._syncToServer = value;
    }
    public get codigoFilial(): number {
        return this._codigoFilial;
    }
    public set codigoFilial(value: number) {
        this._codigoFilial = value;
    }
    public get codigoPatrimonio(): number {
        return this._codigoPatrimonio;
    }
    public set codigoPatrimonio(value: number) {
        this._codigoPatrimonio = value;
    }
    public get incorporacao(): string {
        return this._incorporacao;
    }
    public set incorporacao(value: string) {
        this._incorporacao = value;
    }
    public get nomeFoto(): string {
        return this._nomeFoto;
    }
    public set nomeFoto(value: string) {
        this._nomeFoto = value;
    }
    public get id(): number {
        return this._id;
    }
    public set id(value: number) {
        this._id = value;
    }
    public get dtInsercao(): string {
        return this._dtInsercao;
    }
    public set dtInsercao(value: string) {
        this._dtInsercao = value;
    }

}