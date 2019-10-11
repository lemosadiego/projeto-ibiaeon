import { Util } from './../../helper/Util';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';
import { Session } from '../../providers/session/session';
import { UsuarioDaoProvider } from '../../providers/usuario-dao/usuario-dao';
import { SDES } from '../../helper/SDES';

@IonicPage()
@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html'
})
export class PerfilPage implements OnInit {
  public usuarioLogado: any;
  public clienteLogado: any;


  constructor(public navCtrl: NavController,
    public session: Session,
    public alertController: AlertController,
    private usuarioDaoProvider: UsuarioDaoProvider) {
  }


  async ngOnInit() {
    this.usuarioLogado = await this.session.getUsuario();
    console.log(this.usuarioLogado);
    
    this.clienteLogado = await this.session.getClienteSelecionado();
    console.log('Usuario: ', this.usuarioLogado);
    
  }
  alterarSenha() {
    const alert1 = this.alertController.create({
      title: 'Alteração de senha',
      inputs:[
        {
          name: 'name2',
          type: 'password',
          placeholder: 'Digite a nova senha'
        },
        {
          name: 'name2',
          type: 'password',
          placeholder: 'Confirme a nova senha'
        },
      ],
      buttons: [
        {
          text: 'Confirmar',
          handler: () => {
            if(alert1.data.inputs[0].value != alert1.data.inputs[1].value)
            {
              alert1.setMessage('As senhas são diferentes')
              return false;
            } else {
              var sdes = new SDES()
              sdes.mensagem = alert1.data.inputs[0].value
              sdes.Encrypt();
              var data = Util.gerarData(new Date());
              this.usuarioDaoProvider.alterarSenha(sdes.mensagem,data,this.usuarioLogado.id).then((res:any) => {
                if(res == 1)
                  alert('Senha alterada com sucesso');
                else
                  alert('Erro ao alterar senha');
              }).catch(err => console.error('Erro ao gravar alteracao de senha em db mobile.',err))

            }
          }
        }
      ],
      cssClass:'my-class'
    });
    alert1.present()



}
  
}
