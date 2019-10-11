import { Component, OnInit} from '@angular/core';
import { IonicPage, NavParams, NavController, AlertController } from 'ionic-angular';
import { Session } from '../../providers/session/session';
import { Clientes } from '../../modelos/Clientes';
import { Storage } from "@ionic/storage";

@IonicPage()
@Component({
  selector: 'page-selecao-cliente',
  templateUrl: 'selecao-cliente.html'
})
export class SelecaoClientePage implements OnInit{

  public statusSwipe:any;
  public filialData: any;
  public clienteSelecionado: any;
  public isSelect: any;
  clientesRetornados : any;
  clientes: Clientes;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private _alertCrtl: AlertController,
    public session: Session,
    public storage: Storage) { 
  // this.filialData = this.navParams.get('enviarSelecao');
    }
    
    ngOnInit() {
      this.session.getClientes().then((res) => {
        this.clientesRetornados = Object.keys(res).map(function(index){
          let arrayClientes = res[index];
          return arrayClientes;
          });
      })
    }
    
    selecionaCliente(selecao, cliente){
      this.isSelect = selecao;
      this.clienteSelecionado = cliente;
      
    }

    verificaCheck(){
      if(this.isSelect){
        this.clientes = new Clientes(this.clienteSelecionado);
        this.session.createClienteSelecionado(this.clientes);
        this.navCtrl.setRoot('MenuPrincipalPage');
      } else {
        this._alertCrtl.create({
          title: 'Nenhum cliente escolhido',
          subTitle: 'Escolha um cliente!',
          buttons : [{
             text: 'ok'
          }]
        }).present();
      }
    }
}

