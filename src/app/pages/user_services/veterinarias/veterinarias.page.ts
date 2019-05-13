import { Component, OnInit } from '@angular/core';
import { DbaService } from '../../../services/dba.service';
import { Veterinaria, User } from '../../../models/usuarios';
import { ModalController, AlertController, Events } from '@ionic/angular';
import { ShowVeterinariaPage } from './show-veterinaria/show-veterinaria.page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-veterinarias',
  templateUrl: './veterinarias.page.html',
  styleUrls: ['./veterinarias.page.scss'],
})
export class VeterinariasPage implements OnInit {

  entidades:Veterinaria[] = [];
  
  filtrar:string = '';
  user:User;
  opcion = 'Todas';
  constructor(private dba:DbaService,
    private modalCtrl:ModalController,
     private alertCtrl:AlertController,
     private event:Events,
     private router:Router) {
    
  }
  back(){
    this.router.navigate(['/main']);
  }
  async ngOnInit() {

    /**
     * Se manda un mensaje si el usuario no tiene ninguna 
     * veternaria registrada
     */
    this.user = this.dba.getUsuario();
    this.event.subscribe('usuario',(usuario)=>{
      this.user = usuario;
    })
    console.log(this.user);

    
    this.dba.getVeterinarias().subscribe(async(vet)=>{
      this.entidades = [];
      for (let entidad of vet){
        /**
         * estructura viene data:Veterinaria
         */
        let entity:Veterinaria = entidad.data; 
        this.entidades.push(entity);
        if (entity.users){
          console.log(entity);
          let find = await entity.users.find((element)=>{
            return element.email === this.user.email;
          });
          if(find){

            let buscar = await this.user.veterinarias.find((element)=>{
              return element.name === entity.name;
            })
            if (!buscar){
              this.actualiza_user(entity);
            }
            
          }
        }
      }
      

    });
    
  }
  async actualiza_user(entity:Veterinaria){
    // agrego la veterinaria al usuario en cuestion
    delete entity.users;
    this.user.veterinarias.push(entity);
    console.log(this.user.veterinarias);
    let respuesta = await this.dba.actualizar_user(this.user);
    if(!respuesta){
      this.show_alert('Error :(','No se pudo registrar la entidad');
    }
  }
  change(opcion){
    
    this.opcion = opcion.target.value;
    
  }
  buscar(info){
    this.filtrar = info.target.value;
    
  }
  async show_firstMensaje(){
    let alert = await this.alertCtrl.create({
      header: 'Al registrarte',
      subHeader: 'En una entidad reciviras',
      message: 'Notificaciones de eventos, y recordatorios',
      buttons:['Confirmar']
    });
    alert.present();
  }
  async registrarse(entidad:Veterinaria){
        
    let find = await this.user.veterinarias.find((element:Veterinaria)=>{
      return element.name === entidad.name;
    });
    if(!find){

      if (!this.user.veterinarias){
        this.show_firstMensaje();
      }

      let usuario:User = {
        name:this.user.name,
        type:this.user.type,
        apellido:this.user.apellido,
        email:this.user.email,
        direccion:this.user.direccion,
        telefono:this.user.telefono,
        mascotas:this.user.mascotas,
        nMascotas:this.user.nMascotas,
      }
      if (entidad.users){
        entidad.users.push(usuario);
      }
      else {
        entidad.users = [];
        entidad.users.push(usuario);
      }
      console.log(entidad.users);
      let respuesta = await this.dba.actualizar_vet(entidad);
      if (!respuesta){
        this.show_alert('Error :(','No se pudo registrar la entidad');
      }
      
    }
    
    
    
  }
  /**
   * 
   * permite ver la informacion de la veterinaria registrada 
   */
  async ver(entidad:Veterinaria){
    console.log(entidad);
    let modal = await this.modalCtrl.create({
      component:ShowVeterinariaPage,
      componentProps:{
        entidad
      }
    });
    modal.present();
  }
  async show_alert(title:string,mensaje:string){
    let alert = await this.alertCtrl.create({
      header:title,
      subHeader:mensaje,
      buttons:['Confirmar']
    });
    alert.present();
  }
}
