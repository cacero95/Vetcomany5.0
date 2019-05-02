import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { DbaService } from 'src/app/services/dba.service';
import { User, Veterinaria } from 'src/app/models/usuarios';

@Component({
  selector: 'app-central',
  templateUrl: './central.page.html',
  styleUrls: ['./central.page.scss'],
})
export class CentralPage implements OnInit {

  user:User;
  vet:Veterinaria;
  public menu = [];
  selectedPath = '';
  constructor(private router:Router, private dba:DbaService) {
    let usuario = this.dba.getUsuario();
    if(usuario){
      
      if(usuario.type == 'institute'){
        this.vet = usuario;
        this.menu = [
          {title: 'Grupos', url: '/grupos',icon:'chatbubbles'},
          {title: 'Enterate', url:'/pet-info', icon:'help'},
          {title: 'calendario', url:'/central/calendar', icon:'calendar'},
          {title: 'usuarios',url:'/central/users',icon:'people'},
          {title: 'cuenta', url:'/central/user',icon:'md-contact'}
        ];
        this.router.events.subscribe((address:RouterEvent)=>{
          this.selectedPath = address.url;
          if(this.vet.tasks){
            this.dba.setNotifications(this.vet.tasks);
          }
        })
      }
      else {
        this.user = usuario;
        this.menu = [
          
          {title: 'Enterate', url: '/pet-info', icon: 'information-circle-outline'},
          {title: 'Grupos', url:'/grupos', icon:'chatbubbles'},
          {title: 'calendario', url:'/central/calendar', icon:'calendar'},
          {title: 'entidades mascota',url:'/central/veterinarias',icon:'people'},
          {title: 'cuenta', url:'/central/user',icon:'md-contact'}
        ]
      }
      this.router.events.subscribe((address:RouterEvent)=>{
        this.selectedPath = address.url;
        let day = new Date();
        let notificacion = new Date()
        if(this.user.tasks){
          this.dba.setNotifications(this.user.tasks);
        }
      });



    }
    else {
      this.router.navigate(['/tabs/home']);
    }
  }

  ngOnInit() {
  }

  locate(url){
    this.router.navigate([`/${url}`]);
  }

}
