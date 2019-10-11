import { DatabaseProvider } from './../database/database';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import { ConfiguracaoEquipamento } from '../../modelos/ConfiguracaoEquipamento';
import * as AppConstants from '../../app/app-constantes'
import { Util } from '../../helper/Util';
/*
  Generated class for the ConfiguracoesEquipamentoDaoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ConfiguracoesEquipamentoDaoProvider {

  private configQuerySelect = 'SELECT nome,valor FROM tb_ConfiguracoesEquipamento WHERE id_cliente = ?';

  constructor(public http: HttpClient, public dbProvider: DatabaseProvider) { }

  buscarConfiguracoesEquipamento(idCliente: number) {
    return this.dbProvider.getDB(AppConstants.dbConfigMobile).then((dataBase: SQLiteObject) => {
      return dataBase.executeSql(this.configQuerySelect,[idCliente]).then((result: any) => {
        var configuracoes = [];
        for(var i = 0; i < result.rows.length; i++) {
          configuracoes.push(result.rows.item(i));
        }
        return configuracoes;
      }).catch(e => console.error('Erro ao consultar buscarConfiguracoesEquipamento',e))
    }).catch(e => console.error('Erro ao obter instancia do DB',e))
  }

  alterarConfiguracoesEquipamentoFotos(numFotos: number, idCliente: number) {
    var dtAlteracao = Util.gerarData(new Date());
    var sql = `UPDATE tb_ConfiguracoesEquipamento SET valor = ?, dtAlteracao = ? WHERE id_cliente = ? AND nome = 'nudFotos'` 
    return this.dbProvider.getDB(AppConstants.dbConfigMobile).then((dataBase: SQLiteObject) => {
      return dataBase.executeSql(sql,[numFotos,dtAlteracao,idCliente]).then((result: any) => {
        return 1;
      }).catch(e => {
        console.error('Erro ao alterar configurações',e)
        return -1
      })
    }).catch(e => console.error('Erro ao obter instancia do DB',e))
  }

  alterarConfiguracoesEquipamentoMascara(mascara: string, idCliente: number) {
    var dtAlteracao = Util.gerarData(new Date());
    var sql = `UPDATE tb_ConfiguracoesEquipamento SET valor = ?, dtAlteracao = ? WHERE id_cliente = ? AND nome = 'tbxMascara'`
    return this.dbProvider.getDB(AppConstants.dbConfigMobile).then((dataBase: SQLiteObject) => {
      return dataBase.executeSql(sql,[mascara,dtAlteracao,idCliente]).then((result: any) => {
        return 1;
      }).catch(e => {
        console.error('Erro ao alterar configurações',e)
        return -1
      })
    }).catch(e => console.error('Erro ao obter instancia do DB',e))
  }

  alterarConfiguracoesEquipamentoCamposAux(campoAux: string, idCliente: number, nomeCampo:string) {
    var dtAlteracao = Util.gerarData(new Date());
    var sql = `UPDATE tb_ConfiguracoesEquipamento SET valor = ?, dtAlteracao = ? WHERE id_cliente = ? AND nome = ?`
    return this.dbProvider.getDB(AppConstants.dbConfigMobile).then((dataBase: SQLiteObject) => {
      return dataBase.executeSql(sql,[campoAux,dtAlteracao,idCliente,nomeCampo]).then((result: any) => {
        return 1;
      }).catch(e => {
        console.error('Erro ao alterar configurações',e)
        return -1
      })
    }).catch(e => console.error('Erro ao obter instancia do DB',e))
  }

  populaObjetoConfig(dado: any): ConfiguracaoEquipamento {

    var config: ConfiguracaoEquipamento = new ConfiguracaoEquipamento();
    var auxiliar: any[] = [];
    var obrigatorio: any[] = [];
    var fixado: any[] = [];
    var revisar: any[] = [];

    for (var i = 0; i < dado.length; i++) {
      if (dado[i].nome === 'nudFotos') {
        config.numeroFotos = +dado[i].valor;
      } else if (dado[i].nome === 'rdbRevisaoRapida') {
        config.revisaoRapida = +dado[i].valor;
      } else if (dado[i].nome === 'tbxAux01') {
        if (dado[i].valor != 'AUX 1' && dado[i].valor != 'N' && dado[i].valor != '') {
          auxiliar.push({aux1 : dado[i].valor});
        }
      }
      else if (dado[i].nome === 'tbxAux02') {
        if (dado[i].valor != 'AUX 2' && dado[i].valor != 'N' && dado[i].valor != '') {
          auxiliar.push({aux2 : dado[i].valor});
        }
      }
      else if (dado[i].nome === 'tbxAux03') {
        if (dado[i].valor != 'AUX 3' && dado[i].valor != 'N' && dado[i].valor != '') {
          auxiliar.push({aux3 : dado[i].valor});
        }
      }
      else if (dado[i].nome === 'tbxAux04') {
        if (dado[i].valor != 'AUX 4' && dado[i].valor != 'N' && dado[i].valor != '') {
          auxiliar.push({aux4 : dado[i].valor});
        }
      }
      else if (dado[i].nome === 'tbxAux05') {
        if (dado[i].valor != 'AUX 5' && dado[i].valor != 'N' && dado[i].valor != '') {
          auxiliar.push({aux5 : dado[i].valor});
        }
      }
      else if (dado[i].nome === 'tbxAux06') {
        if (dado[i].valor != 'AUX 6' && dado[i].valor != 'N' && dado[i].valor != '') {
          auxiliar.push({aux6 : dado[i].valor});
        }
      }
      else if (dado[i].nome === 'tbxAux07') {
        if (dado[i].valor != 'AUX 7' && dado[i].valor != 'N' && dado[i].valor != '') {
          auxiliar.push({aux7 : dado[i].valor});
        }
      }
      else if (dado[i].nome === 'tbxAux08') {
        if (dado[i].valor != 'AUX 8' && dado[i].valor != 'N' && dado[i].valor != '') {
          auxiliar.push({aux8 : dado[i].valor});
        }
      }
      else if (dado[i].nome === 'tbxMascara') {
        config.mascara = dado[i].valor;
      } else if (dado[i].nome === 'ckbUsarMascara') {
        config.usarMascara = dado[i].valor;
      } else if (dado[i].nome.indexOf('Obrig') > 0) {
        if (dado[i].nome == 'ckxLocalObrig') {
          obrigatorio.push({nome:'local',valor:dado[i].valor});
        } else if (dado[i].nome == 'ckxCCustoObrig') {
          obrigatorio.push({nome:'cCusto',valor:dado[i].valor});
        } else if (dado[i].nome == 'ckxCondicaoObrig') {
          obrigatorio.push({nome:'condicao',valor:dado[i].valor});
        } else if (dado[i].nome == 'ckxResponsavelObrig') {
          obrigatorio.push({nome:'responsavel',valor:dado[i].valor});
        } else if(dado[i].nome == 'ckxDescricaoObrig') {
          obrigatorio.push({nome:'descricao',valor:dado[i].valor});
        } else if(dado[i].nome == 'ckxMarcaObrig') {
          obrigatorio.push({nome:'marca',valor:dado[i].valor});
        } else if (dado[i].nome == 'ckxModeloObrig') {
          obrigatorio.push({nome:'modelo',valor: dado[i].valor});
        } else if (dado[i].nome == 'ckxNSerieObrig') {
          obrigatorio.push({nome:'serie',valor:dado[i].valor});
        } else if (dado[i].nome == 'ckxCodAntObrig') {
          obrigatorio.push({nome:'codAnterior',valor:dado[i].valor});
        } else if (dado[i].nome == 'ckxTagObrig') {
          obrigatorio.push({nome:'tag',valor:dado[i].valor});
        } else if (dado[i].nome == 'ckxAux1Obrig') {
          obrigatorio.push({nome:'aux1',valor:dado[i].valor});
        } else if (dado[i].nome == 'ckxAux2Obrig') {
          obrigatorio.push({nome:'aux2',valor:dado[i].valor});
        } else if (dado[i].nome == 'ckxAux3Obrig') {
          obrigatorio.push({nome:'aux3',valor:dado[i].valor});
        } else if (dado[i].nome == 'ckxAux4Obrig') {
          obrigatorio.push({nome:'aux4',valor:dado[i].valor});
        } else if (dado[i].nome == 'ckxAux5Obrig') {
          obrigatorio.push({nome:'aux5',valor:dado[i].valor});
        } else if (dado[i].nome == 'ckxAux6Obrig') {
          obrigatorio.push({nome:'aux6',valor:dado[i].valor});
        } else if (dado[i].nome == 'ckxAux7Obrig') {
          obrigatorio.push({nome:'aux7',valor:dado[i].valor});
        } else if (dado[i].nome == 'ckxAux8Obrig') {
          obrigatorio.push({nome:'aux8',valor:dado[i].valor});
        } else if (dado[i].nome == 'ckxObservacaoObrig') {
          obrigatorio.push({nome:'observacao',valor:dado[i].valor});
        } else if (dado[i].nome == 'ckxCoordenadasObrig') {
          obrigatorio.push({nome:'coordenada',valor:dado[i].valor});
        } else if (dado[i].nome == 'ckxEspecieObrig') {
          obrigatorio.push({nome:'especie',valor:dado[i].valor});
        }
        
      } else if (dado[i].nome.indexOf('Aviso') > 0) {
        fixado.push(dado[i].valor);
      } else if (dado[i].nome.indexOf('Bloqueia') > 0) {
        revisar.push(dado[i].valor);
      }
    }
    config.campoAuxiliar = auxiliar;
    config.campoObrigatorio = obrigatorio;
    config.campoFixado = fixado;
    config.campoRevisar = revisar;
    return config;
  }

  getValorObg(campo:string, dados:any): boolean {
    for(var i = 0; i < dados.length; i++) {
      if(dados[i].nome == campo ) {
        if(dados[i].valor == '1') {
          return true;
        } else {
          return false;
        }
      }
    }
    return false;
  }

  getNomeCampoAux(campo:string, dados:any): string {
    for(var i = 0; i < dados.length; i++) {
      if(dados[i].nome == campo ) {
        return dados[i].nome;
      }
    }
    return "";
  }

}
