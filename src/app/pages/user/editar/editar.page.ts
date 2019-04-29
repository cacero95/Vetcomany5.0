import { Component, OnInit } from '@angular/core';
import { Mascota, User } from '../../../models/usuarios';
import { ModalController } from '@ionic/angular';
import { DbaService } from '../../../services/dba.service';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.page.html',
  styleUrls: ['./editar.page.scss'],
})
export class EditarPage implements OnInit {
  image64:string;
  mascota:Mascota;
  imagePreview:string = "";
  is_image:boolean = false;
  user:User
  constructor(private modalCtrl:ModalController,
    private dba:DbaService) { }

  ngOnInit() {
    this.user = this.dba.getUsuario();
  }
  choose_photo(){

  }
  update_user(name,apellido,direccion,telefono){
    console.log(name);
    console.log(apellido);
    console.log(direccion);
    console.log(telefono);
  }
  cerrar(){
    this.modalCtrl.dismiss();
  }
  change_img(pet){
    console.log(pet);
  }
}
