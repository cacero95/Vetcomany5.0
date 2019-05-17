import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { DbaService } from 'src/app/services/dba.service';
import { Events, AlertController } from '@ionic/angular';
import { SocialService } from '../../services/social.service';
import { Postear_tweet, Status, Cuerpo } from '../../models/twitter_tweets';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  
  usuarios:any[] = [];
  tweets:Postear_tweet[] = [];
  constructor(private router:Router,
    private storage:Storage,
    private dba:DbaService,
    private event:Events,
    private alert:AlertController,
    private social:SocialService,
    private iab:InAppBrowser) {
      
      
      this.storage.get('usuarios').then(values=>{
        
        if(values){
          this.dba.setUsuario(values[0]);
          this.router.navigate(['/main']);  
        }
      });

      
    }

  
  async ngOnInit() {
    
    this.event.subscribe('usuario',(usuario)=>{
      this.router.navigate(['/main']);
    });
    this.event.subscribe('close_session',(usuario_vacio)=>{
      this.show_message('Cerro','Sesión satisfactoriamente');
    });
    
    this.cargar_publicaciones();
  }
  cargar_publicaciones(){
    this.social.getPublicaciones().subscribe(async(data)=>{
      this.tweets = data;
      this.getTweets();
    })
  }
  async getTweets(){
    let respuesta:Cuerpo = await this.social.get_tweets();
    
    if(respuesta.statuses){
      let contador = 0;
      
      for (let index = this.tweets.length-1; index>=0; index--){
        
        if (this.tweets[index].imagen){
          
          this.tweets[index].direccion = respuesta.statuses[contador].extended_entities.media[0].expanded_url;
        }
        contador = contador+1;
      }
    }
  }
  
  async show_message(title:string,mensaje:string){
    let alert = await this.alert.create({
      header:title,
      subHeader:mensaje,
      mode:'ios',
      animated:true,
      buttons:['Confirmar']
    });
    alert.present();
  }
  async explorar(place:string,direccion?:string){
    if(direccion){
      console.log(direccion);
      this.iab.create(`${direccion}/`,"_blank");
    }
    else {
      this.router.navigate([`/${place}`]);
    }
  }

}
