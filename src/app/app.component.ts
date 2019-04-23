import { Component } from '@angular/core';

import { Platform, ModalController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { TypeUserPage } from './pages/type-user/type-user.page';
import { DbaService } from './services/dba.service';
import { FCM, NotificationData } from '@ionic-native/fcm/ngx';
import { Notifications } from './models/notifications';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  
  

  public appMenu = [
    
    {title: 'Entrar', url: '/login', icon: 'md-contact'},
    {title: 'Registrarse', url:'/register', icon:'md-arrow-round-up'}
  
  ]
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router:Router,
    private modalCtrl:ModalController,
    private dba:DbaService,
    private fcm:FCM
  ) {
    this.initializeApp();
  }

  


  async navegar(url){

    
    if (url == '/login'){
      this.router.navigate(['/login']);
    }
    else {
      
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
      

    }

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      /**
       * notification
       */
      
      
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
