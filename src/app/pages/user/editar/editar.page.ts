import { Component, OnInit } from '@angular/core';
import { Mascota, User } from '../../../models/usuarios';
import { ModalController, AlertController, NavParams } from '@ionic/angular';
import { DbaService } from '../../../services/dba.service';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.page.html',
  styleUrls: ['./editar.page.scss'],
})
export class EditarPage implements OnInit {
  image64:string;
  mascotas:Mascota[] = [];
  imagePreview:string = "";
  is_image:boolean = false;
  user:User;
  constructor(private modalCtrl:ModalController,
    private dba:DbaService,
    private imagePicker:ImagePicker,
    private alert:AlertController,
    private navParams:NavParams) { }

  ngOnInit() {

    this.user = this.navParams.get('usuario');
    
  }
  
  async update_user(name,apellido,direccion,telefono){
    
    if (name != this.user.name){
      this.user.name;
    }
    if (apellido != this.user.apellido){
      this.user.apellido;
    }
    if (direccion != this.user.direccion){
      this.user.direccion;
    }
    if(telefono != this.user.telefono){
      this.user.telefono = telefono;
    }


    let update = await this.dba.registrar_user(this.user,this.is_image);
    if(update){
       this.modalCtrl.dismiss({
         'result':true
       });
    }
    else if(!update){
      this.show_mess('Usuario','No actualizado');
    }
  }
  async show_mess(title:string,mensaje:string){
    let alert = await this.alert.create({
      header:title,
      subHeader:mensaje,
      buttons:['Confirmar']
    });
    alert.present();
  }
  cerrar(){
    this.modalCtrl.dismiss({
      'result':false
    });
  }
  
  change_img(pet:Mascota,index:number){
    console.log(pet);
    const options:ImagePickerOptions = {
      quality: 70,
      outputType: 1, // indica que la imagen va ser en base 64bits
      maximumImagesCount:1
    };
    this.imagePicker.getPictures(options).then((results)=>{
      for (var i = 0; i < results.length; i++){
        this.imagePreview = 'data:image/jpeg;base64,' + results[i];
        this.image64 = results[i];
         
        this.is_image = true; // quiere decir que la imagen esta en la mascota
      }
        
    },(err)=>console.log(JSON.stringify(err))).then(()=>{
      
      pet.url = this.image64;
      console.log(pet);
      this.user.mascotas[index] = pet;
            
    })
    

  }
   
}
