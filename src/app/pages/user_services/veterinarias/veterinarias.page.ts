import { Component, OnInit } from '@angular/core';
import { DbaService } from '../../../services/dba.service';
import { Veterinaria, User } from '../../../models/usuarios';
import { ModalController, AlertController } from '@ionic/angular';
import { ShowVeterinariaPage } from './show-veterinaria/show-veterinaria.page';

@Component({
  selector: 'app-veterinarias',
  templateUrl: './veterinarias.page.html',
  styleUrls: ['./veterinarias.page.scss'],
})
export class VeterinariasPage implements OnInit {

  entidades:Veterinaria[] = [];
  mis_entidades:Veterinaria[] = [];
  filtrar:string = '';
  user:User;
  opcion = 'Todas';
  constructor(private dba:DbaService,private modalCtrl:ModalController) {
    this.user = this.dba.getUsuario();
    this.dba.getVeterinarias().subscribe((data)=>{
      let tick = false;
      this.entidades = [];
      for(let index of data){
        let entidad = index.data;
        if(index.data.users){
          let usuarios:User[] = index.data.users;
          
          for(let user of usuarios){
            
            if(user.name == this.user.name && user.email == this.user.email){
              //console.log(user);
              //console.log('this.user: ' , this.user);
              for(let mis of this.mis_entidades){
                if(mis == entidad){
                  tick = true;
                }
              }
              if(!tick){
                this.mis_entidades.push(entidad);
              }
            }
          }
        }
        this.entidades.push(entidad);
      }
      console.log(this.mis_entidades);
      this.user.veterinarias = this.mis_entidades;
      this.dba.actualizar_user(this.user);
    })
  }

  ngOnInit() {
  }
  change(opcion){
    
    this.opcion = opcion.target.value;
    
  }
  buscar(info){
    this.filtrar = info.target.value;
    
  }
  registrarse(entidad:Veterinaria){
    let tick = true;
    if (!entidad.users){
      let usuarios:User[] = [];
      
      usuarios.push(this.user);
      entidad.users = usuarios;
      this.mis_entidades.push(entidad);
      this.dba.actualizar_vet(entidad);
      
    }
    else {
      for(let user of entidad.users){
        if(user.email == this.user.email && user.name == this.user.name){
          tick = false; // quire decir ya esta el usuario y no se necesita agregarlo
        }
      }
      if(tick){
        let usuario:User[] = entidad.users;
        usuario.push(this.user);
        entidad.users = usuario;
        this.dba.actualizar_vet(entidad);
      }
    }
    
    /**
     * ahora registramos la entidad en el usuario
     */
    
    //this.dba.actualizar_vet(entidad);
    //console.log("hola " + this.mis_entidades);
    //this.dba.setEntidades_user(this.mis_entidades);
    //this.dba.actualizar_vet(entidad,this.user);
    
    
    
    
    
  }
  /**
   * 
   * permite ver la informacion de la veterinaria registrada 
   */
  async ver(entidad:Veterinaria){
    this.dba.setEntidad(entidad);
    let modal = await this.modalCtrl.create({
      component:ShowVeterinariaPage
    });
    modal.present();
  }

}
