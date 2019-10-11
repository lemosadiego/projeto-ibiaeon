export class CodigoFicticio {
    
    private _id: number;
    private _idUsuario: number;
    private _de: number;
    private _ate: number;
    private _ultimoUtilizado: number;
    private _ultimoEncontrado: number;
    private _validado: boolean;
    private _login: string;
    private _cliente: string;

    constructor() {
        this.id = null;
        this.idUsuario = null;
        this.de = null;
        this.ate = null;
        this.ultimoUtilizado = null;
        this.ultimoUtilizado = null;
        this.validado = false;
        this.login = null;
        this.cliente = null;
    }

    public getAtributosToArray() : any[] {
        var arrayValues = [];
        arrayValues.push(this.de);
        arrayValues.push(this.ate);
        arrayValues.push(this.ultimoUtilizado);
        arrayValues.push(this.validado == false ? 0 : 1);

        return arrayValues;
    }
    
    public get id(): number {
        return this._id;
    }
    public set id(value: number) {
        this._id = value;
    }
    public get idUsuario(): number {
        return this._idUsuario;
    }
    public set idUsuario(value: number) {
        this._idUsuario = value;
    }
    public get de(): number {
        return this._de;
    }
    public set de(value: number) {
        this._de = value;
    }
    public get ate(): number {
        return this._ate;
    }
    public set ate(value: number) {
        this._ate = value;
    }
    public get ultimoUtilizado(): number {
        return this._ultimoUtilizado;
    }
    public set ultimoUtilizado(value: number) {
        this._ultimoUtilizado = value;
    }
    public get ultimoEncontrado(): number {
        return this._ultimoEncontrado;
    }
    public set ultimoEncontrado(value: number) {
        this._ultimoEncontrado = value;
    }
    public get validado(): boolean {
        return this._validado;
    }
    public set validado(value: boolean) {
        this._validado = value;
    }
    public get login(): string {
        return this._login;
    }
    public set login(value: string) {
        this._login = value;
    }
    public get cliente(): string {
        return this._cliente;
    }
    public set cliente(value: string) {
        this._cliente = value;
    }

}