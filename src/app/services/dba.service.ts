import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User, Veterinaria, Tareas, Mascota } from '../models/usuarios';
import * as firebase from 'firebase';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable,pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { Events, AlertController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class DbaService {
  
  tipo:string;
  usuario:any;
  actualiza:Observable<any[]>;
  tasks:Tareas[] = [];
  key:string;
  entidad_user:Veterinaria;
  token:string;
  constructor(private http:HttpClient,
    private fireDba:AngularFireDatabase,
    private storage:Storage,
    private events:Events,
    private alertCtrl:AlertController) { }
  

  loggear(email){
    this.key = email;
    this.key = email;
        this.key = this.key.replace("@","_");
        while(this.key.indexOf(".") != -1){
          this.key = this.key.replace(".","_");
        }
    this.actualiza = this.fireDba.list(`${this.key}/`).snapshotChanges()
    .pipe(map(valores=>{
      return valores.map(value=>{
        let key = value.key;
        let data = new Object();
        data[key] = value.payload.val();
        return data;
      });
    }));
    return this.actualiza;
  }
  
  async califica_entidad(entidad:Veterinaria){
    this.key = entidad.email;
    
        this.key = this.key.replace("@","_");
        while(this.key.indexOf(".") != -1){
          this.key = this.key.replace(".","_");
        }
    return new Promise((resolve,reject)=>{
      this.fireDba.object(`${this.key}`).update(entidad).then(()=>{
        this.fireDba.object(`veterinarias/${this.key}`).update(entidad)
        .then(()=>{
          resolve(true);
        }).catch((error)=>{
          console.log(error);
          reject(false);
        })
      }).catch((err)=>{
        console.log(err);
        reject(false);
      })
    })
  }
  async registrar_vet(vet:Veterinaria){
    
    this.key = vet.email
        this.key = this.key.replace("@","_");
        while(this.key.indexOf(".") != -1){
          this.key = this.key.replace(".","_");
        }
    
    return new Promise((resolve,reject)=>{
    if(vet.url){
      /**
       * solo si el usuario tiene una imagen que
       * subir al storage
       */
        /**
         * Hacemos referencia al storage de firebase
         */
       let fireStorage = firebase.storage().ref();
       let file_name = new Date().valueOf().toString();
       fireStorage.child(`img/${file_name}`)
       let upload_task:firebase.storage.UploadTask =
       fireStorage.child(`img/${file_name}`)
       .putString(vet.url,'base64',{contentType: 'image/jpeg'});
       upload_task.on(firebase.storage.TaskEvent.STATE_CHANGED,
        ()=>{
          // middle of the upload image
        },
        (err)=>{
          // an error happen
          console.log(JSON.stringify(err));
          
        },
        ()=>{
          // success
          /**
              * descargo el url segun el storage de google para guardarselo en la 
              * data base
              */
          fireStorage.child(`img/${file_name}`).getDownloadURL().then(direccion=>{
            vet.url = direccion;
          });
          // intento subir el usuario a la dba
          this.fireDba.object(`${this.key}`).update(vet)
          .then(()=>{
            this.setUsuario(vet);
            resolve(true);
          }).catch(err=>{
            if(err){
              
              console.log(JSON.stringify(err));
              reject(false);
            }
          })
          this.fireDba.object(`veterinarias/${this.key}`).update(vet)
          .catch(err=>{
            if(err){
              console.log(JSON.stringify(err));
              reject(false);
            }
          })
        }
        );
        
      }
      else{
        this.fireDba.object(`${this.key}`).update(vet)
        .then(()=>{
          
          this.setUsuario(vet);
          resolve(true);
        
        }).catch(err=>{
          
          if(err){
            console.log(JSON.stringify(err));
            reject(false);
          }

        });
        this.fireDba.object(`veterinarias/${this.key}`).update(vet)
        .catch(err=>{
          console.log(JSON.stringify(err));
          reject(false);
        });
      }

    });
    
    
  }



  async registrar_user(usuario:User,is_image){
    console.log('el usuario antes de registrarse es');
    console.log(usuario);
    
    this.key = usuario.email
        this.key = this.key.replace("@","_");
        while(this.key.indexOf(".") != -1){
          this.key = this.key.replace(".","_");
        }

    
    return new Promise ((resolve,reject)=>{

    if (is_image){
       let mascotas:Mascota[] = usuario.mascotas
       // recorro el arreglo de mascotas que puede tener el usuario
       for (let mascota = 0; mascota < mascotas.length; mascota++){
        // recorro el arreglo de mascotas para ver si tienen imagen
        if (mascotas[mascota].url){

          let fireStorage = firebase.storage().ref(); // hacemos referencia al storage de firebase
          let file_name = new Date().valueOf().toString();
          fireStorage.child(`img/${file_name}`);
          let upload_task:firebase.storage.UploadTask = fireStorage.child(`img/${file_name}`)
          .putString(mascotas[mascota].url,'base64',{contentType:'image/jpeg'});
          upload_task.on(firebase.storage.TaskEvent.STATE_CHANGED,
            ()=>{
              // PROCCESS
            },
            (err)=>{
              console.log(JSON.stringify(err));
            },
            ()=>{
              // success
              fireStorage.child(`img/${file_name}`).getDownloadURL().then((address)=>{
                 // agrego el url de firebase
                
                mascotas[mascota].url = address;
                console.log('ruta de la imagen:' + mascotas[mascota].url);
                
              })
            })
          }
        
        }
        usuario.mascotas = mascotas;
        console.log(`se va a subir el usuario`);
        console.log(usuario);
        this.fireDba.object(`${this.key}/`).update(usuario).then(()=>{
          this.setUsuario(usuario);
          resolve(true);
          
        }).catch(err=>{
          if(err){
            
            console.log(JSON.stringify(err))
            reject(false);
           
          }
        })
        // aca subire los registros a firebase
        // despues de subir las imagenes al storage
        
      }
      else{
        this.fireDba.object(`${this.key}/`).update(usuario).then(()=>{
          this.setUsuario(usuario);
          resolve(true)
        }).catch(err=>{
          if(err){
            console.log(JSON.stringify(err));
             
            reject(false);
          }
        })
        
      }
    });
       
  }
  //
  //cargar_firebase(user){
  //    //let usuarios:any [] = [];
  //    
//
//
  //    ///**
  //    // * con la siguien linea busco los usuarios
  //    // * en el localStorage
  //    // */
  //    //this.storage.get('usuarios').then(values=>{
  //    //  usuarios = values;
  //    //});
  //    ///**
  //    // * almaceno el usuario en el localStorage
  //    // */
  //    //this.storage.set('usuarios','usuarios').then(()=>console.log('usuario almacenado!!!'));
//
  //}
//

  setEntidad(entidad){
    this.entidad_user = entidad;
  }
  getEntidad_user(){
    return this.entidad_user;
  }
  setUsuario(usuario){

    return new Promise ((resolve,reject)=>{
      this.usuario = usuario;
      
      if(usuario){
        this.events.publish('usuario',usuario);
        this.tasks = this.usuario.tasks;
        console.log('inicio de sesion');
        resolve(true);
      }
      else {
        this.events.publish('close_session',null);
        console.log('cerrar session');
        resolve(false);
      }

    })
  }
  getUsuario(){
    return this.usuario;
  }
  
  setTipo(tipo){
    this.tipo = tipo;
  }
  getTipo(){
    return this.tipo;
  }
  get_tips(){

    /**
     * con el snapshotChanges permito que la aplicacion este 
     * atento a cualquier cambio en la base de datos
     */
    this.actualiza = this.fireDba.list('info_mascotas/tips/').snapshotChanges()
    .pipe(map(valores=>{
      return valores.map(value=>{
        const data = value.payload.val();
        const key = value.payload.key;
        
        return {key, data};
      });
    }))
    return this.actualiza;
  }
  pet_info(){
    this.actualiza = this.fireDba.list('info_mascotas').snapshotChanges()
    .pipe(map(value=>{
      return value.map(valores=>{
        const data = valores.payload.val();
        const key = valores.payload.key;
        return {key,data}
      });
    }));
    return this.actualiza;
  }


  codigo_policial(){
    this.actualiza = this.fireDba.list('info_mascotas/policial/').snapshotChanges()
    .pipe(map(value=>{
      return value.map(valores=>{
        const data = valores.payload.val();
        
        return {data}
      })
    }));

    return this.actualiza;
  }
  /**
   * Se agregan las taraes que valla agregando los usuarios
   * en el calendario
   */
  setEvent(task){
    
    this.tasks.push(task);
    this.usuario.tasks = this.tasks;
    this.fireDba.object(`${this.key}`).update(this.usuario);
    
  }
  async show_notification(dia:string,tarea:Tareas){
    let alert = await this.alertCtrl.create({
      header:dia,
      subHeader:tarea.title,
      message:tarea.description,
      buttons:['confirmar']
    });
    alert.present();
  }
  async setNotifications(tasks:Tareas[], fecha){
    // let respuesta = await this.sendNotification(tarea);
    let ayer = new Date(fecha.getTime() - 24*60*60*1000);
    console.log(fecha.getDate());    
    let pos =  0;
    for (let tarea of tasks){
      let evento = new Date(tarea.startTime);
      let yesterday = new Date(evento.getTime() - 24*60*60*1000);
      let tomorrow = new Date(evento.getTime() + 24*60*60*1000);
      console.log(evento.getDate());
      console.log(ayer.getDate());
      console.log(yesterday.getDate());
      console.log(tomorrow);

      if(ayer.getDate() == yesterday.getDate()){
        let respuesta = await this.sendNotification(tarea);
        if(respuesta){
          this.show_notification('Hoy es dia', tarea);
        }
      }
      else if(yesterday.getDay() == fecha.getDay()){
        let response = await this.sendNotification(tarea);
        if(response){
          this.show_notification('Mañana es dia', tarea);
        }
      }
    }
    
  }

  sendNotification(tasks:Tareas){
    let cuerpo = {
      destino:this.token,
      title:tasks.title,
      mensaje:tasks.description,
      origen:this.usuario.name
    }
   return new Promise ((resolve,reject)=>{
     this.http.post(`https://gag-6f2a5.firebaseapp.com/notificaciones`,cuerpo).subscribe((data)=>{
       resolve(true);
     },err=>{
       reject(false);
     })
   })  
  }

  getVeterinarias(){
    this.actualiza = this.fireDba.list(`veterinarias/`).snapshotChanges()
    .pipe(map(valores=>{
      return valores.map(value=>{

        const data = value.payload.val();
        
        
        return {data};
      });
    }));
    return this.actualiza;
  }
  /**
   * Actualiza los usuarios de tipo
   * veterinaria
   */
  actualizar_vet(entidad){
    let llave = entidad.email
        llave = llave.replace("@","_");
        while(llave.indexOf(".") != -1){
          llave = llave.replace(".","_");
        }
    return new Promise((resolve,reject)=>{
      this.fireDba.object(`${llave}/`).update(entidad)
      .then(()=>{
        this.fireDba.object(`veterinarias/${llave}`).update(entidad).then(()=>{
          resolve(true);
        })
      }).catch(()=>{
        reject(false);
      })
    })
    
  }
  setTokenNotifications(token){
    this.token = token;
  }
  getTokenNotifications(){
    return this.token;
  }
  notifications(noti:Tareas){
    
    this.http.post(`https://gag-6f2a5.firebaseapp.com/notificaciones`,noti)
    .subscribe(respuesta=>{
      console.log(JSON.stringify(respuesta));
    },err=>{
      console.log(err);
    })
  }
  /**
   * Actualiza los usurios e tipo mascota
   */
  async actualizar_user(user){

    let llave = user.email
    llave = llave.replace("@","_");
    while(llave.indexOf(".") != -1){
      llave = llave.replace(".","_");
    }
    return new Promise((resolve,reject)=>{
      this.fireDba.object(`${llave}/`).update(user).then(()=>{
        resolve(true);
      }).catch(()=>{
        reject(false);
      });
    });
    
    
  }
  

  
}

