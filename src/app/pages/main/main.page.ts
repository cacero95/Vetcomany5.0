import { Component, OnInit } from '@angular/core';
import { DbaService } from 'src/app/services/dba.service';
import { User, Veterinaria } from 'src/app/models/usuarios';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { AlertController, ModalController, Events } from '@ionic/angular';
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
    private modalCtrl:ModalController,
    private event:Events) { }

  ngOnInit() {
    
    let usuario = this.dba.getUsuario();
    
    if (usuario){

      if(usuario.type == 'institute'){
        this.vet = usuario;
      }
      else {
        this.user = usuario;
      }
      this.fix_notifications(usuario);
    }
    else {
      this.router.navigate(['/tabs/home']);
    }

    
    this.event.subscribe('usuario',(user)=>{
      usuario = user;
      if(usuario.type == 'institute'){
        this.vet = usuario;
      }
      else {
        this.user = usuario;
      }
      this.fix_notifications(usuario);
    })  
    
  }
  async fix_notifications(usuario){
    if(usuario.tasks){
      let fecha = new Date();
      this.dba.setNotifications(usuario.tasks,fecha);
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

  async twitter_shared(origen,imagen?:string){
    
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
        },
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
        }
      ]
    })
    /**
     * this.sharing.twitter_sharing(cuerpo).subscribe(()=>{
        this.alert_message('Exito :)', 'Al postear');
      },err=>{
        this.alert_message('Error :(', 'Al tuitear');
        console.log(JSON.stringify(err));
      })
     */
    alert.present();
    alert.onDidDismiss().then(async()=>{
      
        let posting = await this.sharing.publicar_noticia(cuerpo)
        if(posting){
          this.alert_message('Exito :)', 'Al postear');
        }
        else {
          this.alert_message('Error :(', 'Al postear');
        }
      
      
    });
    
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
      let postear = await this.sharing.publicar_noticia(cuerpo);
      console.log('y la respuesta al postear');
      console.log(postear);
      if (postear){
        this.alert_message('Exito :)','Al publicar');
      }
      else {
        this.alert_message('Error :(','Al publicar');
      }
    }
    else {
      // quiere decir que se cancelo share 
      console.log(JSON.stringify(data));
    }
  }
  contactar(number){

  }
  ubicar (locate){
    this.router.navigate([`/${locate}`]);
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
