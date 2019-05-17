import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Postear_tweet,Body } from '../models/twitter_tweets';
import * as firebase from 'firebase';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class SocialService {


  actualiza:Observable<any[]>;
  constructor(private http:HttpClient,
    private firedba:AngularFireDatabase) { }

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
  upload_file(imagen){
    return new Promise((resolve,reject)=>{

      let fireStorage = firebase.storage().ref();
         let file_name = new Date().valueOf().toString();
         fireStorage.child(`img/${file_name}`)
         let upload_task:firebase.storage.UploadTask =
         fireStorage.child(`img/${file_name}`)
         .putString(imagen,'base64',{contentType: 'image/jpeg'});
         upload_task.on(firebase.storage.TaskEvent.STATE_CHANGED,
          ()=>{
            
          },
          (err)=>{
            console.log(JSON.stringify(err));
            reject(false);
          },()=>{
            // success
            fireStorage.child(`img/${file_name}`).getDownloadURL().then((url)=>{
              resolve(url);
            })
          })
    })
  }
 
  publicar_noticia(cuerpo:Postear_tweet){
    let key = new Date().toISOString();
        key = key.replace("@","_");
        while(key.indexOf(".") != -1){
          key = key.replace(".","_");
        }
    return new Promise((resolve,reject)=>{
      this.firedba.object(`publicaciones/${key}/`).update(cuerpo).then(()=>{
        this.twitter_sharing(cuerpo).subscribe((data)=>{
          console.log(data);
          resolve(true);
        })
      }).catch((err)=>{
        reject(false);
      })
    })
      
  }
  getHashTags(tema){
    let busqueda = {
      type:'hashtag',
      tema
    }
    console.log(busqueda);
    return new Promise((resolve,reject)=>{
      this.http.post(`https://vetcompany.herokuapp.com/twitter`,busqueda)
      .subscribe((data)=>{
        resolve(data);
      },err=>{
        reject(null);
      })
    })
  }
  get_tweets(){
    let busqueda = {
      type:'tweets',
      tema:'cacero95'
    }
    return new Promise((resolve,reject)=>{
      this.http.post(`https://vetcompany.herokuapp.com/twitter`,busqueda)
      .subscribe((data:Body)=>{
        resolve(data.cuerpo);
      },err=>{
        reject(null);
      })
    })
  }
  getPublicaciones(){
    this.actualiza = this.firedba.list(`publicaciones`).snapshotChanges()
    .pipe(map(posts=>{
      return posts.map(value=>{
        let data = value.payload.val();
        return data;
      });
    }));
    return this.actualiza;
  }
}
