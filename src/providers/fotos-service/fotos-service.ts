
import { Injectable } from '@angular/core';

const CHAVE ='teste';

@Injectable()
export class FotosServiceProvider {

  constructor() {
     
  }

  salvaFoto(avatar) { 
    localStorage.setItem(CHAVE, avatar)
  }

  obtemFoto() {
    return localStorage.getItem(CHAVE) 
            ? localStorage.getItem(CHAVE)
            : 'assets/img/avatar-padrao.jpg';
  }

}
