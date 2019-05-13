import { Component, OnInit } from '@angular/core';
import { DbaService } from '../../../services/dba.service';
import { Events } from '@ionic/angular';
import { Router } from '@angular/router';
import { SocialService } from '../../../services/social.service';
import { Postear_tweet } from '../../../models/twitter_tweets';
import { Tareas } from '../../../models/usuarios';

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
    private sharing:SocialService) { }

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
    })

    
  }

  change_views(option){
    this.opcion = option;
    this.change_clases = !this.change_clases;
  }

}
