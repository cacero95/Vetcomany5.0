import { Component, OnInit } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import { AlertController } from '@ionic/angular';
import { DbaService } from '../../services/dba.service';
import { Router } from '@angular/router';
import { Facebook,FacebookLoginResponse } from '@ionic-native/facebook/ngx';




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
          text:'Ok',
          role:'Ok'
        }
      ]
    });
    alert.present();
  }
  async login(){
    this.load = true;
    
    let result:any = await this.fireauth.auth.signInWithEmailAndPassword(this.email,this.password)
    .then((data)=>{
      let data_user;
      result = data;
      this.dba.login(this.email);
        setTimeout(()=>{
          data_user = this.dba.getUsuario();
          console.log(data_user);
          if (data_user.name){
            this.load = false;
            this.router.navigate(['/central/main']);
            
          }
          else {
            this.load = false;
            this.show_alert('Usuario','No encontrado');
            
          }
          this.load = false;
        },3000)
    }).catch(err=>{
      this.load = false;
      this.show_alert(err.code,err.message);
    })
    
    
    
  }

}
