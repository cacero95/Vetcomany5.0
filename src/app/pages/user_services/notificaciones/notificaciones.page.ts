import { Component, OnInit } from '@angular/core';
import { DbaService } from '../../../services/dba.service';
import { User, Veterinaria } from '../../../models/usuarios';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.page.html',
  styleUrls: ['./notificaciones.page.scss'],
})
export class NotificacionesPage implements OnInit {
  user:User;
  vet:Veterinaria;
  constructor(private dba:DbaService) { }

  ngOnInit() {
    let usuario = this.dba.getUsuario();
    if (usuario.type == 'mascota'){
      this.user = usuario;
    }
    else {
      this.vet = usuario;
    }
  }

}
