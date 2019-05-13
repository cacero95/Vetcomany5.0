import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { DbaService } from 'src/app/services/dba.service';
import { Events, AlertController } from '@ionic/angular';
import { SocialService } from '../../services/social.service';
import { Postear_tweet, Status } from '../../models/twitter_tweets';

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
      let contador = 0;
      for(let post of data){
        this.tweets.push(post);
        if(post.imagen.length > 0){
          console.log(post);
          post = await this.cargar_tweets(post,contador);
          console.log(post);
        }
        contador = contador+1;
      }
      
    })
  }
  async cargar_tweets(publicacion:Postear_tweet,index:number){
    
    let sharing:any = await this.social.get_tweets();
    console.log(sharing);
    if(sharing){
      
      
      let tweet:any = sharing.statuses[index].extended_entities;
       
      publicacion.direccion = tweet.media[0].expanded_url;
        
    }
    console.log(publicacion);
    return publicacion;
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
