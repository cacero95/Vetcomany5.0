import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

import { DbaService } from 'src/app/services/dba.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  user:any;
  usuarios:any[] = [];
  
  constructor(private router:Router,
    private storage:Storage,
    private dba:DbaService) {
      this.user = dba.getUsuario();
      console.log(this.user);
      this.storage.get('usuarios').then(values=>{
        this.usuarios = values;
        
      });
      
      
      
      if(this.usuarios){
        this.user = this.usuarios[0];
      }
      /**
       * se verifica si ya existe un usuario en
       * el localStorage
       */
      if(this.user){
        this.router.navigate(['/main']);
      }
      

    }

  
  ngOnInit() {
  }

  explorar(place:string){
    this.router.navigate([`/${place}`]);
  }

}
