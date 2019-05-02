import { Component, OnInit } from '@angular/core';
import { DbaService } from 'src/app/services/dba.service';
import { User, Veterinaria } from 'src/app/models/usuarios';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { AlertController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { SocialService } from '../../services/social.service';
import { TwitterSharedPage } from './twitter-shared/twitter-shared.page';
import { Postear_tweet } from '../../models/twitter_tweets';

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
  twitter_url = 'https://twitter.com/CompaniVet';

  public menu = [
    
    {title: 'Tips mascotas', url: '/tips', icon: 'people'},
    {title: 'informacion para mascotas', url:'/pet-info', icon:'analitics'}
  
  ]
  constructor(private dba:DbaService,
    private social:SocialSharing,
    private alertCtrl:AlertController,
    private router:Router,
    private sharing:SocialService,
    private modalCtrl:ModalController) { }

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
    else {
      this.router.navigate(['/tabs/home']);
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

  async twitter_shared(origen,imagen:string){
    
    let cuerpo = {} as Postear_tweet;
    let alert = await this.alertCtrl.create({
      header:'Quieres',
      subHeader: 'Agregar un mensaje?',
      inputs:[
        {
          name:'mensaje',
          type:'text',
          placeholder:'Tu mensaje'
        }
      ],
      buttons:[
        {
          text:'Confirmar',
          role:'ok',
          handler:(data)=>{
            console.log(data);
            
            cuerpo = {
              origen,
              imagen,
              mensaje:data.mensaje
            }
            
            alert.dismiss();
          }
        },
        {
          text:'Cancelar',
          role:'cancelar',
          handler:()=>{
            //this.sharing.twitter_sharing(origen,imagen).subscribe((data)=>{
            //  console.log(JSON.stringify(data));
            //},err=>{
            //  console.log(JSON.stringify(err));
            //})
            cuerpo = {
              origen,
              imagen
            }
            alert.dismiss();
          }
        }
      ]
    })
    alert.present();
    alert.onDidDismiss().then(()=>{
      this.sharing.twitter_sharing(cuerpo).subscribe(()=>{
        this.alert_message('Exito :)', 'Al postear');
      },err=>{
        this.alert_message('Error :(', 'Al tuitear');
        console.log(JSON.stringify(err));
      })
    })
    
    //console.log(imagen);
    //this.sharing.twitter_sharing(origen,imagen,mensaje).subscribe((data)=>{
    //  console.log(JSON.stringify(data));
    //},err=>{
    //  console.log(JSON.stringify(err));
    //})
  }
  
  async alert_message(titulo:string , mensaje:string){
    const alert = await this.alertCtrl.create({
      header: titulo,
      subHeader: mensaje,
      buttons:[
        {
          text: 'Confirmar',
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
  
  async comenta(origen){
    let modal = await this.modalCtrl.create({
      component:TwitterSharedPage
    });
    modal.present();
    let { data } = await modal.onDidDismiss();
    let cuerpo:Postear_tweet = {
      origen,
      imagen:data.imagen,
      mensaje:data.mensaje 
    }
    if(!data.result){
      this.sharing.twitter_sharing(cuerpo)
      .subscribe(data=>{
        this.alert_message('Exito :)','Al publicar');
      },err=>{
        this.alert_message('Error :(', 'Al publicar');
        console.log(JSON.stringify(err));
      })
    }
    else {
      // quiere decir que se cancelo share 
      console.log(JSON.stringify(data));
    }
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
