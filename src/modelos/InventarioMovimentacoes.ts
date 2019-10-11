export class InventarioMovimentacoes {
    
    private _id: number;
    private _idInventario: number;
    private _idPropriedade: number;
    private _nome: string;
    private _valorAntigo: string;       
    private _valorNovo: string;
    private _dtInsercao: string;
    
    constructor() {}

    public getAtributosToArray() : any[] {
        var arrayValues = [];
        arrayValues.push(this.idInventario);
        arrayValues.push(this.idPropriedade);
        arrayValues.push(this.valorAntigo);
        arrayValues.push(this.valorNovo);
        arrayValues.push(this.nome);
        arrayValues.push(this.dtInsercao);

        return arrayValues;
    }
    public get idInventario(): number {
        return this._idInventario;
    }
    public set idInventario(value: number) {
        this._idInventario = value;
    }
    public get id(): number {
        return this._id;
    }
    public set id(value: number) {
        this._id = value;
    }
    
    public get idPropriedade(): number {
        return this._idPropriedade;
    }
    public set idPropriedade(value: number) {
        this._idPropriedade = value;
    }
    public get valorAntigo(): string {
        return this._valorAntigo;
    }
    public set valorAntigo(value: string) {
        this._valorAntigo = value;
    }
    public get valorNovo(): string {
        return this._valorNovo;
    }
    public set valorNovo(value: string) {
        this._valorNovo = value;
    }
    public get dtInsercao(): string {
        return this._dtInsercao;
    }
    public set dtInsercao(value: string) {
        this._dtInsercao = value;
    }
    public get nome(): string {
        return this._nome;
    }
    public set nome(value: string) {
        this._nome = value;
    }

}