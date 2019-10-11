import { Model } from "./Model";

export class Usuario extends Model{

    id: number;
    login: string;
    senha: string;
    nome: string;
    sobreNome: string;
    email: string;
    perfil: number;
    dtInsercao: string;
    dtAlteracao: string;
    status: boolean;

}