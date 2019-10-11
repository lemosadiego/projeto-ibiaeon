import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { ConfiguracaoEquipamento } from '../../../modelos/ConfiguracaoEquipamento';
import { Session } from '../../../providers/session/session';

declare let TestePlugin;

@IonicPage()
@Component({
  selector: 'page-rfid-nativo',
  templateUrl: 'rfid-nativo.html'
})
export class RfidNativoPage {

  public rfidLeitura = false
  public tags: string[] = [];
  public tipoLeitura = 'multipla';
  public objConfig: ConfiguracaoEquipamento;

  constructor(public navCtrl: NavController,public session: Session) { }

  public initialise() {
    TestePlugin.initialise(function(data) {
      console.log('initialise ',data)
    })
  }

  async ionViewWillEnter() {
    var config: ConfiguracaoEquipamento = await this.session.getConfiguracao();
    this.objConfig = new ConfiguracaoEquipamento(config);
    
  }

  tagSelecionada(tag){
    this.disconnect()
    var mascara = this.objConfig.mascara.length;
      var etiquetaComMascara = tag.substring(tag.length-mascara);
      this.navCtrl.getPrevious().data.etiquetaSelecionada = etiquetaComMascara;
      this.navCtrl.pop();
  }

  public single() {
    TestePlugin.singleTag((data) => {
      console.log('tag ',data.tag)
      this.preencheListaTag(data.tag);
    })
  }
  tipoDeLeitura(tipo){
    if(tipo){
      this.tipoLeitura = 'multipla'
    } else{
      this.tipoLeitura = 'individual'
    }
   
  }

  startRfid(){
    if(this.tipoLeitura == 'multipla'){
      this.multi();
    } else if(this.tipoLeitura == 'individual'){
      this.single();
    }
  }

  public async multi() {
    this.rfidLeitura = true;
    while(this.rfidLeitura) {
      this.single();
      await this.delay(300);
    }
  }

  private preencheListaTag(tag: string) {
    var existe = false;
    if(this.tags.length == 0){
      this.tags.push(tag)
    } else {
        for(var i = 0; i < this.tags.length; i++) {
          if(this.tags[i] == tag) {
            existe = true;
            i = this.tags.length;
          }
        }
        if(!existe && tag != "")
          this.tags.push(tag)
    }
  }

  public disconnect() {
    this.rfidLeitura = false;
    TestePlugin.disconnect(function(data) {
      console.log('disconect ',data)
    })
  }

  public clean() {
    this.rfidLeitura = false;
    this.tags = [];
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

}
