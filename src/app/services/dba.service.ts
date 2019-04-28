import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User, Veterinaria, Tareas, Mascota } from '../models/usuarios';
import * as firebase from 'firebase';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable,pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { Notifications } from '../models/notifications';

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
    private storage:Storage) { }
  
  login(email){
    let usuario_log = {};
    this.key = email;
        this.key = this.key.replace("@","_");
        while(this.key.indexOf(".") != -1){
          this.key = this.key.replace(".","_");
        }
    
    this.actualiza = this.fireDba.list(`${this.key}`).snapshotChanges()
    .pipe(map(valores=>{
      return valores.map(value=>{

        const data = value.payload.val();
        const key = value.payload.key;
        
        return {key,data};
      });
    }));

    this.actualiza.subscribe(data_user=>{

      let user:any = {};
      // console.log(data_user);
      /**
       * Se recorre el arreglo desde la llave con su data
       */
      for (let us of data_user){ 
        switch(us.key){
          case 'apellido':
            user.apellido = us.data;
          break;
          case 'email':
            user.email = us.data;
          break;
          case 'mascotas':
            user.mascotas = us.data;
          break;
          case 'nMascotas':
            user.nMascotas = us.data;
          break;
          case 'name':
            user.name = us.data;
          break;
          case 'type':
            user.type = us.data;
          break;
          case 'telefono':
            user.telefono = us.data;
          break;
          case 'services':
            user.services = us.data;
          break;
          case 'direccion':
            user.direccion = us.data;
          break;
          case 'url':
            user.url = us.data;
          break;
          case 'users':
            user.users = us.data;
          break;
          case 'tasks':
            user.tasks = us.data;
            this.tasks = us.data;// se agregan las tareas de cada usuario
          break;
        }
      }
      this.setUsuario(user);
      usuario_log = user;
      
      // verifico que el usuario se loggeo
    })
    return usuario_log;
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
    this.usuario = usuario;
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
    this.fireDba.object(`${llave}/`).update(entidad)
    .then(()=>{
      console.log('se subio con exito');
    }).catch(err=>{
      // se muestra si ocasiono algun problema
      // la subida de datos
      console.log(JSON.stringify(err));
    });
    /**
     * se sube los datos al registro de todas las veterinarias
     */
    this.fireDba.object(`veterinarias/${llave}`).update(entidad)
    .then((success:any)=>{
      console.log('se subio con exito');
    }).catch(err=>{
      // se muestra si ocasiono algun problema
      // la subida de datos
      console.log(JSON.stringify(err));
    });

    
  }
  setTokenNotifications(token){
    this.token = token;
  }
  getTokenNotifications(){
    return this.token;
  }
  notifications(noti:Tareas){
    
    this.http.post(`https://vetcompany.herokuapp.com/notificaciones`,noti)
    .subscribe(respuesta=>{
      console.log(JSON.stringify(respuesta));
    })
  }
  /**
   * Actualiza los usurios e tipo mascota
   */
  actualizar_user(user){

    let llave = user.email
    llave = llave.replace("@","_");
    while(llave.indexOf(".") != -1){
      llave = llave.replace(".","_");
    }
    this.fireDba.object(`${llave}/`).update(user)
    .then(()=>{
      console.log('se subio con exito');
    }).catch(err=>{
      // se muestra si ocasiono algun problema
      // la subida de datos
      console.log(JSON.stringify(err));
    });
    /**
     * se sube los datos al registro de todas las veterinarias
     */
    
  }
  

  
}

