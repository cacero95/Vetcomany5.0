import { Component, OnInit } from '@angular/core';
import { DbaService } from '../../services/dba.service';
import { User, Veterinaria } from '../../models/usuarios';
import { Router } from '@angular/router';
import { AlertController, ModalController, Events } from '@ionic/angular';
import { EditarPage } from './editar/editar.page';
import { EditarVetPage } from './editar-vet/editar-vet.page';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {
  user:User;
  vet:Veterinaria;
  constructor(private dba:DbaService,
    private router:Router,
    private alertCtlr:AlertController,
    private modalCtrl:ModalController,
    private event:Events) { }


  back(){
    this.router.navigate(['/main']);
  }

  ngOnInit() {
    let usuario = this.dba.getUsuario();
    this.event.subscribe('usuario',(user)=>{
      usuario = user;
      if(usuario.type == 'mascota'){
        this.user = usuario;
      }
      else {
        this.vet = usuario;
      }
    })


    if(usuario.type == 'mascota'){
      this.user = usuario;
    }
    else {
      this.vet = usuario;
    }
  }
  close_sesion(){

    this.dba.setTipo('');
    this.dba.setUsuario(null);
    this.router.navigate(['/tabs/home']);
  }
  async editar(){
    
    let modal = await this.modalCtrl.create({
      component:EditarPage,
      componentProps: {
        'usuario':this.user
      }
    });
    modal.present();
    const { data } = await modal.onDidDismiss();
    
    
    if(data.result){
      this.show_mess('Usuario','Actualizado');
    }
  }
  async editar_vet(){
    let modal = await this.modalCtrl.create({
      component: EditarVetPage,
      componentProps: {
        'usuario':this.vet
      }
    });
    modal.present();
    const { data } = await modal.onDidDismiss();
    // si retorna true quiere decir que la veterinaria esta actualizada
    
    if(data.result){
      this.show_mess('Usuario','Actualizado');
    }
  }
  async show_mess(title:string,mensaje:string){
    let alert = await this.alertCtlr.create({
      header:title,
      subHeader:mensaje,
      buttons:['Confirmar']
    });
    alert.present();
  }
}
