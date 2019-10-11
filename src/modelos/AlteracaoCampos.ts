export class AlteracaoCampos {
    
    private _idPropriedade: string;
    private _campo: string;
    private _idAntigo: string;
    private _idNovo: string;
    private _valorAntigo: string;
    private _valorNovo: string;
    
    constructor() {
    }

    public getAtributosToArray() : any[] {
        var arrayValues = [];
        arrayValues.push(this.idPropriedade);
        arrayValues.push(this.campo);
        arrayValues.push(this.idAntigo);
        arrayValues.push(this.idNovo);
        arrayValues.push(this.valorAntigo);
        arrayValues.push(this.valorNovo);

        return arrayValues;
    }

    public get idPropriedade(): string {
        return this._idPropriedade;
    }
    public set idPropriedade(value: string) {
        this._idPropriedade = value;
    }
    public get campo(): string {
        return this._campo;
    }
    public set campo(value: string) {
        this._campo = value;
    }
    public get idAntigo(): string {
        return this._idAntigo;
    }
    public set idAntigo(value: string) {
        this._idAntigo = value;
    }
    public get idNovo(): string {
        return this._idNovo;
    }
    public set idNovo(value: string) {
        this._idNovo = value;
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
    
}