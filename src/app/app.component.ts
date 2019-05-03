import { Component } from '@angular/core';

import { Platform, ModalController, Events } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { TypeUserPage } from './pages/type-user/type-user.page';
import { DbaService } from './services/dba.service';
import { FCM, NotificationData } from '@ionic-native/fcm/ngx';
import { Notifications } from './models/notifications';
import { User, Veterinaria } from './models/usuarios';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  
  user:User;
  vet:Veterinaria;
  confirmar:boolean = true;
  decision:string = 'sin';
  appMenu = [
    
    {title: 'Entrar', url: '/login', icon: 'md-contact'},
    {title: 'Registrarse', url:'/register', icon:'md-arrow-round-up'},
    {title: 'Enterate', url: '/pet-info', icon: 'information-circle-outline'},
    {title: 'Grupos', url:'/grupos', icon:'chatbubbles'}
  
  ];
  menuUser = [
    {title: 'Enterate', url: '/pet-info', icon: 'information-circle-outline'},
    {title: 'Grupos', url:'/grupos', icon:'chatbubbles'},
    {title: 'calendario', url:'/calendar', icon:'calendar'},
    {title: 'entidades mascota',url:'/veterinarias',icon:'people'},
    {title: 'cuenta', url:'/user',icon:'md-contact'} 
  ];
  menuVet = [
    {title: 'Grupos', url: '/grupos',icon:'chatbubbles'},
    {title: 'Enterate', url:'/pet-info', icon:'help'},
    {title: 'calendario', url:'/calendar', icon:'calendar'},
    {title: 'usuarios',url:'/users',icon:'people'},
    {title: 'cuenta', url:'/user',icon:'md-contact'}
  ]
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router:Router,
    private modalCtrl:ModalController,
    private dba:DbaService,
    private fcm:FCM,
    private event:Events
  ) {

    this.initializeApp();
    
  }

  

  
  async navegar(url){
    
    switch (url){
      case '/login':
        this.router.navigate(['/login']);
        break;
      case '/register':
          let modal = await this.modalCtrl.create({
            component:TypeUserPage,
            componentProps:{
              tipo:url
            }
          });
          modal.present();
          const data = await modal.onDidDismiss();
          this.dba.setTipo(data.data.result);
          this.router.navigate([`/${url}`]);
          break;
      case '/grupos':
          this.router.navigate(['/grupos']);
          break;
      case '/pet-info':
          this.router.navigate(['/pet-info']);
          break;
    }
    
   

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      /**
       * notification
       */
      
      this.event.subscribe('usuario',(usuario)=>{
        
        if(usuario){
          
          if(usuario.type == 'mascota'){
            console.log('actualizando..');
            this.confirmar = false;
            this.user = usuario;
            
          console.log(this.appMenu);
          this.decision = 'user';
          }
          if(usuario.type == 'institute') {
    
            this.vet = usuario;
            this.decision = 'vet';
            
          }
        }
        else {
          
          this.decision = 'sin';
        }
        console.log(this.decision);
      });
      
      this.fcm.getToken() // clave que se le designa a todo token
      .then((token:string)=>{
        this.dba.setTokenNotifications(token);
        console.log(`token del dispositivo es ${token}`);
      }).catch(err=>{
        console.log(JSON.stringify(err));
      })
      this.fcm.onTokenRefresh().subscribe((token:string)=>{
        this.dba.setTokenNotifications(token);
        console.log(`se actualizo el token mira ${token}`);
      });
      
      this.fcm.onNotification().subscribe( data =>{
        if(data.wasTapped){ // indica si la aplicacion esta en segundo plano
          console.log(`estoy en segun plano`);
          console.log(data);
        }
        else {
          // significa que la aplicacion esta en primer plano
          console.log(`èstoy en primer plano`);
          console.log(data);
        }
      },err=>{
        console.log(JSON.stringify(err));
      })


    });
  }
}
