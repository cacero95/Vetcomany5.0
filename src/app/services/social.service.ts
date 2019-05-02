import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Postear_tweet } from '../models/twitter_tweets';

@Injectable({
  providedIn: 'root'
})
export class SocialService {

  constructor(private http:HttpClient) { }

  /**
   * origen: quien va tuitear
   * img: la imagen de las mascota
   * mensaje: Que va tuitear
   * hashtag: si va hacer hashtag
   */
  twitter_sharing(body:Postear_tweet){
    
    let message = `${body.origen}:${body.mensaje}`;
    if(body.hashtag){
      // compartimos contenido y ademas agregamos un hashtag
      message = `${body.origen}:${body.mensaje} ${body.hashtag}`;
      
    }
    body.mensaje = message;
      
    return this.http.post(`https://vetcompany.herokuapp.com/twitter_post`,body)

  }
  
}
