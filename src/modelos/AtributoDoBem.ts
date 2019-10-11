export class AtributoDoBem {
    
    private _id: number;
    private _id_patrimonio: number;
    private _id_propriedade: number;
    private _texto: string;       
    private _idTipoDeDado: number;
    private _nome: string;
    private _dtInsercao: string;
    
    
    constructor() {}

    public getAtributosToArray() : any[] {
        var arrayValues = [];
        arrayValues.push(this.id_patrimonio);
        arrayValues.push(this.id_propriedade);
        arrayValues.push(this.texto);
        arrayValues.push(this.dtInsercao);

        return arrayValues;
    }
    
    public get id(): number {
        return this._id;
    }
    public set id(value: number) {
        this._id = value;
    }
    public get id_patrimonio(): number {
        return this._id_patrimonio;
    }
    public set id_patrimonio(value: number) {
        this._id_patrimonio = value;
    }
    public get id_propriedade(): number {
        return this._id_propriedade;
    }
    public set id_propriedade(value: number) {
        this._id_propriedade = value;
    }
    public get texto(): string {
        return this._texto;
    }
    public set texto(value: string) {
        this._texto = value;
    }
    public get idTipoDeDado(): number {
        return this._idTipoDeDado;
    }
    public set idTipoDeDado(value: number) {
        this._idTipoDeDado = value;
    }
    public get nome(): string {
        return this._nome;
    }
    public set nome(value: string) {
        this._nome = value;
    }
    public get dtInsercao(): string {
        return this._dtInsercao;
    }
    public set dtInsercao(value: string) {
        this._dtInsercao = value;
    }

}