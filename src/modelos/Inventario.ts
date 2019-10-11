export class Inventario {
    
    private _id: number;
    private _idPatrimonio: number;
    private _usuarioPdaLogin: string;
    private _usuarioConfigLogin: string;        
    private _dataGravacao: string;
    private _acao: string;
    
    constructor() {
        this.id = null;
        this.idPatrimonio = null;
        this.usuarioPdaLogin = null;
        this.usuarioConfigLogin = null;
        this.dataGravacao = null;
        this.acao = null;
    }

    public getAtributosToArray() : any[] {
        var arrayValues = [];
        arrayValues.push(this.idPatrimonio);
        arrayValues.push(this.dataGravacao);
        arrayValues.push(this.acao);
        arrayValues.push(this.usuarioPdaLogin);
        arrayValues.push(this.usuarioConfigLogin);

        return arrayValues;
    }
    
    public get id(): number {
        return this._id;
    }
    public set id(value: number) {
        this._id = value;
    }
    public get idPatrimonio(): number {
        return this._idPatrimonio;
    }
    public set idPatrimonio(value: number) {
        this._idPatrimonio = value;
    }
    public get dataGravacao(): string {
        return this._dataGravacao;
    }
    public set dataGravacao(value: string) {
        this._dataGravacao = value;
    }
    public get acao(): string {
        return this._acao;
    }
    public set acao(value: string) {
        this._acao = value;
    }
    public get usuarioPdaLogin(): string {
        return this._usuarioPdaLogin;
    }
    public set usuarioPdaLogin(value: string) {
        this._usuarioPdaLogin = value;
    }
    public get usuarioConfigLogin(): string {
        return this._usuarioConfigLogin;
    }
    public set usuarioConfigLogin(value: string) {
        this._usuarioConfigLogin = value;
    }

}