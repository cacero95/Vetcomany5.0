import { Component, OnInit } from '@angular/core';
import { DbaService } from '../../../services/dba.service';
import { User, Veterinaria } from '../../../models/usuarios';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.page.html',
  styleUrls: ['./notificaciones.page.scss'],
})
export class NotificacionesPage implements OnInit {
  user:User;
  vet:Veterinaria;
  constructor(private dba:DbaService,private event:Events) { }

  ngOnInit() {
    let usuario = this.dba.getUsuario();
    this.event.subscribe('usuario',(user)=>{
      usuario = user;
      if (usuario.type == 'mascota'){
        this.user = usuario;
      }
      else {
        this.vet = usuario;
      }
    })
    if (usuario.type == 'mascota'){
      this.user = usuario;
    }
    else {
      this.vet = usuario;
    }
  }

}
