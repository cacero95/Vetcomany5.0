import { Component, OnInit } from '@angular/core';
import { DbaService } from '../../../services/dba.service';
import { Events } from '@ionic/angular';
import { Router } from '@angular/router';
import { SocialService } from '../../../services/social.service';
import { Postear_tweet, Cuerpo } from '../../../models/twitter_tweets';
import { Tareas } from '../../../models/usuarios';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';


@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.page.html',
  styleUrls: ['./notificaciones.page.scss'],
})
export class NotificacionesPage implements OnInit {
  usuario:any;
  tareas:Postear_tweet[] = [];
  notificaciones:Tareas[] = [];
  opcion:string = 'publicaciones';
  change_clases:boolean = true;
  constructor(private dba:DbaService,
    private event:Events,
    private router:Router,
    private sharing:SocialService,
    private iab:InAppBrowser) { }

  back(){
    this.router.navigate(['/main']);
  }
  ngOnInit() {
    this.usuario = this.dba.getUsuario();
    if (this.usuario.tasks){
      this.notificaciones = this.usuario.tasks;
    }
    this.event.subscribe('usuario',(user)=>{
      this.usuario = user;
      if (this.usuario.tasks){
        this.notificaciones = this.usuario.tasks;
      }
    });
    
    this.sharing.getPublicaciones().subscribe((posts)=>{
      this.tareas = posts;
      this.getTweets();
    })

    
  }
  async getTweets(){
    let respuesta:Cuerpo = await this.sharing.get_tweets();
    
    if(respuesta.statuses){
      let contador = 0;
      
      for (let index = this.tareas.length-1; index>=0; index--){
        
        if (this.tareas[index].imagen){
          
          this.tareas[index].direccion = respuesta.statuses[contador].extended_entities.media[0].expanded_url;
        }
        contador = contador+1;
      }
    }
  }

  change_views(option){
    this.opcion = option;
    this.change_clases = !this.change_clases;
  }
  async explorar(direccion?:string){
    this.iab.create(`${direccion}/`,"_blank");
  }

}
