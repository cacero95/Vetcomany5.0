import { Component, OnInit } from '@angular/core';
import { DbaService } from '../../services/dba.service';
import { User, Veterinaria } from '../../models/usuarios';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

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
    private alertCtlr:AlertController) { }

  ngOnInit() {
    let usuario = this.dba.getUsuario();
    if(usuario == 'mascota'){
      this.user = usuario;
    }
    else {
      this.vet = usuario;
    }
  }
  close_sesion(){
    this.dba.setUsuario(null);
    this.dba.setTipo('');
    
  }
  
}
