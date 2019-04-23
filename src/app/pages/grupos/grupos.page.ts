import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TwitterListData } from 'src/app/models/twitter_data';
import { ModalController } from '@ionic/angular';
import { TwitterGroupPage } from './twitter-group/twitter-group.page';

@Component({
  selector: 'app-grupos',
  templateUrl: './grupos.page.html',
  styleUrls: ['./grupos.page.scss'],
})
export class GruposPage implements OnInit {

  /**
   * 
   * Identificador
   * 
   * 161045641500359
   * 
   * secret key facebook
   * 
   * b7ed7ce97a93bb8e414f1290524541b7
   */

  busqueda:any = {};
  tweets:TwitterListData[] = [];
  team_busqueda:string;
  load:boolean = false;
  
  constructor(private http:HttpClient,
    private modalCtrl:ModalController) {
    
    
      
  }

  async ngOnInit() {
    
    this.busqueda = {
      tema:'@Muy_mascotas',
      type:'normal'
    }
    this.load = true;
    let tweets:any = await this.cargar_tweets();
    console.log(tweets);
    if(tweets.users){
      this.tweets = tweets.users;
      this.load = false;
    }
    else {
      console.log(JSON.stringify(tweets));
      this.load = false;
    }
  }
  async cargar_tweets(){
    return new Promise((resolve,reject)=>{
      this.http.post('https://vetcompany.herokuapp.com/twitter',this.busqueda)
      .subscribe((data:any)=>{
        resolve(data.cuerpo);
      },err=>{
        reject(err)
      })
    })
  }
  segmentChanged(event){
    this.team_busqueda = event.target.value;
    console.log(this.team_busqueda);
  }
  async ingresa(entidad_mascota:TwitterListData){
    let picture = '';
    let screen_name = entidad_mascota.screen_name;
    if (entidad_mascota.profile_banner_url){
      picture = entidad_mascota.profile_banner_url;
    }
    else {
      picture = entidad_mascota.profile_image_url_https;
    }
    let modal = await this.modalCtrl.create({
      component:TwitterGroupPage,
      componentProps:{
        nombre:screen_name,
        img:picture
      }
    })
    
    modal.present();

  }


}
