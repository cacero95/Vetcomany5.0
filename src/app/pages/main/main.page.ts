import { Component, OnInit } from '@angular/core';
import { DbaService } from 'src/app/services/dba.service';
import { User, Veterinaria } from 'src/app/models/usuarios';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  user:User;
  vet:Veterinaria;
  url:'https://ionicacademy.com';
  facebook_url = 'https://www.facebook.com/V1-309863869440390/';

  public menu = [
    
    {title: 'Tips mascotas', url: '/tips', icon: 'people'},
    {title: 'informacion para mascotas', url:'/pet-info', icon:'analitics'}
  
  ]
  constructor(private dba:DbaService,
    private social:SocialSharing,
    private alertCtrl:AlertController,
    private router:Router) { }

  ngOnInit() {
    let usuario = this.dba.getUsuario();
    console.log(usuario);
    if (usuario){

      if(usuario.type == 'institute'){
        this.vet = usuario;
      }
      else {
        this.user = usuario;
      }

    }
  }

  async face_shared(imagen:string){
    console.log(imagen);
    
    this.social.shareViaFacebook('esta es mi mascota',imagen,this.facebook_url)
    .then((data)=>{
      console.log(data);
    }).then(()=>{
      this.alert_message('Exito :)','Al postear');
    }).catch((data)=>{
      console.log(data);

      this.alert_message('Error :(', 'No se pudo postear');
    });
    
    

  }

  async alert_message(titulo:string , mensaje:string){
    const alert = await this.alertCtrl.create({
      header: titulo,
      subHeader: mensaje,
      buttons:[
        {
          text: 'Ok',
          role: 'Ok',
          cssClass: 'primary',
          handler: ()=>{
            alert.dismiss();
          }
        }

      ]
    });
    await alert.present();
  }
  async twitter_shared(imagen:string){
    console.log(imagen);
    this.social.shareViaTwitter(null,imagen,this.url);
  }
  async whats_shared(imagen:string){
    console.log(imagen);
    this.social.shareViaWhatsApp('publicando desde ionic',imagen,this.url);
    this.social.shareViaWhatsApp('Esta es mi mascota',imagen,this.url)
    .then((data)=>{
      console.log(data);
    }).catch(err=>{
      console.log(err);
    })

  }
  async shared(imagen:string){
    /**
     * Da la opcion de publicar una imagen
     * en las redes sociales 
     */
    let alert = await this.alertCtrl.create({
      header:'Donde quieres',
      subHeader: 'publicar?',
      buttons:[

        {
          text:'Facebook',
          role:'Facebook',
          cssClass:'primary',
          handler: ()=>{
            this.face_shared(imagen);
          }
        },
        {
          text:'Twitter',
          role:'Twitter',
          cssClass:'secondary',
          handler: ()=>{
            this.twitter_shared(imagen);
          }

        }
        

      ]
    });
    await alert.present();
  }

  contactar(number){

  }
  ubicar (locate){
    this.router.navigate([`/central/${locate}`]);
  }
  async add(){
    let alert = await this.alertCtrl.create({
      header: 'Agrega',
      buttons:[
        {
          text:'Servicios',
          role: 'Servicios',
          handler:()=>{
            console.log('agregar servicios');
          }
        },
        {
          text: 'Clientes',
          role: 'clientes',
          handler:()=>{
            console.log('agregar clientes');
          }
        }
      ]
    });

    alert.present();
  }

}
