import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Status,Body } from '../../../models/twitter_tweets';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-twitter-group',
  templateUrl: './twitter-group.page.html',
  styleUrls: ['./twitter-group.page.scss'],
})
export class TwitterGroupPage implements OnInit {
  imagen:string;
  url:string;
  tema_busqueda:string;
  tweets:Status[] = [];
  load:boolean = false;
  constructor(private modalCtrl:ModalController,
    private params:NavParams,
    private http:HttpClient,
    private iab:InAppBrowser) {
      
      this.imagen = this.params.get('img');
      this.tema_busqueda = this.params.get('nombre');
      console.log(this.imagen,this.tema_busqueda);
    }

  async ngOnInit() {
    this.load = true;
    let tweets:any = await this.cargar_tweets();
    if(tweets.statuses){
      this.tweets = tweets.statuses;
      this.load = false;
    }
    else{
      console.log(JSON.stringify(tweets));
      this.load = false;
    }
  }
  async cargar_tweets(){
    let busqueda = {
      type:'tweets',
      tema:this.tema_busqueda
    }
    return new Promise((resolve, reject)=>{
      this.http.post(`https://vetcompany.herokuapp.com/twitter`,busqueda)
      .subscribe((data:Body)=>{
        resolve(data.cuerpo);
      },err=>{
        reject(err);
      })
    })
  }
  close(){
    this.modalCtrl.dismiss();
  }
  open(url){
    console.log(url);
    this.iab.create(`${url}/`,"_blank");
  }
}
