import { Component, OnInit } from '@angular/core';
import { Veterinaria } from '../../../models/usuarios';
import { DbaService } from '../../../services/dba.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {
  vet:Veterinaria;
  busqueda:string = '';
  constructor(private dba:DbaService) { }

  ngOnInit() {
    this.vet = this.dba.getUsuario();
  }
  llamar(numero){
    console.log(numero);
  }
  buscar_usuarios(event){
    this.busqueda = event.target.value;
  }
}
