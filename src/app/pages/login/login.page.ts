import { Component, OnInit } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import { AlertController } from '@ionic/angular';
import { DbaService } from '../../services/dba.service';
import { Router } from '@angular/router';
import { Facebook,FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { User } from '../../models/usuarios';




@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email:string;
  password:string;
  load:boolean = false;
  constructor(private dba:DbaService,
    private router:Router,
    private fireauth:AngularFireAuth,
    private alertCtrl:AlertController,
    private fcb:Facebook) { }
  
  back(){
    this.router.navigate(['/tabs/home']);
  }
    
  ngOnInit() {
  }
  facebook(){
    this.fcb.login(['email','public_profile']).then((response:FacebookLoginResponse)=>{
      this.fcb.api('me?fields=id,name,email,first_name,picture.width(720).as(picture_large)',[])
      .then((profile)=>{
        console.log(profile);
      })
    }).catch(err=>{
      console.log(err)
    });
    
  }
  async show_alert (title,mensaje){
    let alert = await this.alertCtrl.create({
      header:title,
      animated:true,
      message:mensaje,
      buttons:[
        {
          text:'Confirmar',
          role:'Ok'
        }
      ]
    });
    alert.present();
  }

  async usuario_login(){
    
    this.load = true;
    let result:any = await this.fireauth.auth.signInWithEmailAndPassword(this.email,this.password)
    .then((data)=>{
      
      result = data; 
      this.dba.loggear(this.email).subscribe((usuario)=>{
        let us:any = {};
        for (let user of usuario){
          for (let key in user){
            us[key] = user[key];
          } 
        }
        
        this.load = false;
        let respuesta = this.dba.setUsuario(us);
        if (respuesta){ // si true el usuario se loggeo
          this.router.navigate(['/main']);
        }
      },err=>{
        this.show_alert(err.code,err.message);  
        this.load = false;
      })
      
    }).catch((err)=>{
      this.load = false;
      this.show_alert(err.code,err.message);
    })
     
    

  }

  

}
