import { Component, OnInit } from '@angular/core';
import { DbaService } from 'src/app/services/dba.service';
import { Veterinaria, User, Mascota } from 'src/app/models/usuarios';
import { AlertController, ModalController } from '@ionic/angular';
import { ImagePicker,ImagePickerOptions } from '@ionic-native/image-picker/ngx';

// firebase

import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { MascotaPage } from '../mascota/mascota.page';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  type:string;
  services:any[] = [];
  vet = {} as Veterinaria;
  user = {} as User;
  servicios:any[] = [];
  image64:string;
  password:string;
  count:number;
  pets:Mascota[] = [];
  load:boolean = false;
  is_image:boolean;

  constructor(private dba:DbaService,
    private alertCtrl:AlertController,
    private image:ImagePicker,
    private fireAuth:AngularFireAuth,
    private router:Router,
    private modalCtrl:ModalController) {
    
    this.type = this.dba.getTipo();
    this.is_image = false;
    this.services = [
    {
        nombre: 'Guarderia',
        img: 'assets/img/home.png'
    },
    {
        nombre: 'Peluqueria',
        img: 'assets/img/tijeras.png'
    },
    {
        nombre: 'Urgencias',
        img: 'assets/img/warning.jpg'
    },
    {
        nombre: 'Veterinaria',
        img: 'assets/img/veterinaria.png'
    },
    {
        nombre: 'Hotel mascotas',
        img: 'assets/img/hotel.png'
    },
    {
        nombre: 'Transporte mascotas',
        img: 'assets/img/warning.jpg'
    }
    ]

  }
  back(){
    this.router.navigate(['/tabs/home']);
  }
  ngOnInit() {
  }
  /**
   * En este metodo se van agregando los usuarios de Veterinaria
   */
  setServices(servicio){
    let pos = this.servicios.indexOf(servicio);
    if (pos == -1){
      // se agrega el servicio
      this.servicios.push(servicio);
    }
    else{
      this.servicios.splice(pos);
      // se elimina el servicio
    }
  }
  async ingresar(){
    
    let alert = await this.alertCtrl.create({
      animated:true,
      header: 'Quieres agregar una imagen',
      buttons:[
        {
          text:'Si',
          role: 'Confirmar',
          handler:()=>{
            
            this.agregar_vet(true)
          }
        },
        {
          text:'No',
          role:'cancelar',
          handler:()=>{
            
            this.agregar_vet(false)
          }
        }
      ]
    })
    alert.present();
  }
  /**
   * Permite seleccionar una imagen del celular
   */
  
  async numero_mascotas( titulo:string, mensaje:string ){
    const alert = await this.alertCtrl.create({
      header:'Cuenatas',
      subHeader:'Mascotas tienes?',
      inputs:[
        {
          name: 'n_mascotas',
          type:'number',
          min: 1
        }

      ],
      buttons:[
        {
          text: 'Ok',
          role: 'Ok',
          cssClass: 'primary',
          // numero mascotas del usuario en cuestion
          handler: cuenta =>{
            this.user.nMascotas = cuenta.n_mascotas;
            this.count = this.user.nMascotas; // le mando al contador el numero de mascotas de a persona 
            //console.log(this.count)
            
            this.crear_mascota();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: ()=>{
            console.log('no hay mascotas');
            
          }
        }
      ]
    });
    await alert.present();
  }


  async crear_mascota(){
    for (let x = 0; x < this.count; x++){
      let modal = await this.modalCtrl.create({
        component: MascotaPage
      })
      modal.present();
      let data = await modal.onDidDismiss();
      //console.log(data.data.mascota);
      if (data.data.mascota == "cancelo"){
        return; // si el usuario cancela entonces se cierra el metodo
      }
      this.pets.push(data.data.mascota);
      this.is_image = data.data.is_image;
      //console.log(this.pets)
    }
    this.user.mascotas = this.pets;
    
  }

  async mensaje(titulo,mensaje){
    let alert = await this.alertCtrl.create({
      header:titulo,
      message:mensaje,
      buttons:[
        {
          text:'ok',
          role:'ok'
          
        }
      ]
    });
    alert.present();
  }

  async agregar_vet(imagen){
    console.log(imagen);
    this.vet.services = this.servicios;
    this.vet.type = this.type;
    if (imagen){
      let options:ImagePickerOptions = {
        quality: 70,
        outputType: 1, // indica que la imagen va ser en base 64bits
        maximumImagesCount:1
      }
      this.image.getPictures(options).then(img=>{
        for (let x = 0; x < img.length; x++){
          this.image64 = img[x];
        }
        this.vet.url = this.image64;
      },(err)=>console.log(JSON.stringify(err)));

    }
    else {
      try{
        let result = await this.fireAuth.auth
        .createUserWithEmailAndPassword(this.vet.email,this.password);
        if(result){
          this.load = true;
          let respuesta = await this.dba.registrar_vet(this.vet);
          console.log('la respuesta:',respuesta);
          if (!respuesta){
            this.load = false;
            this.mensaje('error',':( no se puso subir el usuario');
          }
          else {
            console.log('se registro con exito');
            
            this.router.navigate(['/main']);
            
          }
        }
      }
      catch(err){
        console.log(err);
        console.log(JSON.stringify(err));
        this.mensaje(':(', err.mensaje);
      }
    }

    
  }
/**
 * permite agregar el usuario de tipo mascota a la dba
 */

  async agregar_user(){
    
    try{
      this.user.type = this.type;
      let result = await this.fireAuth.auth
      .createUserWithEmailAndPassword(this.user.email,this.password)
      if (result){
        this.load = true;
        let respuesta = await this.dba.registrar_user(this.user,this.is_image);
        console.log('la respuesta:',respuesta);
        if (!respuesta){
          this.mensaje('error',':( no se puso subir el usuario');
          this.load = false;
        }
        else {
          console.log('se registro con exito')
          this.router.navigate(['/main']);
          this.load = false;
        }
                                

      }
    }
    catch(err){
      console.log(err);
      console.log(JSON.stringify(err));
      this.mensaje(':(', err.mensaje);
    }
    
  }
  

}
