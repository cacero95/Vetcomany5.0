import { Component, OnInit } from '@angular/core';
import { DbaService } from '../../services/dba.service';
import { User, Veterinaria } from '../../models/usuarios';
import { Router } from '@angular/router';
import { AlertController, ModalController, Events } from '@ionic/angular';
import { EditarPage } from './editar/editar.page';

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

  ngOnInit() {
    let usuario = this.dba.getUsuario();
    this.event.subscribe('usuario',(user)=>{
      usuario = user;
      if(usuario == 'mascota'){
        this.user = usuario;
      }
      else {
        this.vet = usuario;
      }
    })


    if(usuario == 'mascota'){
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
      component:EditarPage
    });
    modal.present();
  }
}
