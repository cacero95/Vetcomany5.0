import { Component, OnInit } from '@angular/core';
import { Mascota, User } from '../../../models/usuarios';
import { ModalController } from '@ionic/angular';
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
    private imagePicker:ImagePicker) { }

  ngOnInit() {
    this.user = this.dba.getUsuario();
    
  }
  
  update_user(name,apellido,direccion,telefono){
    let usuario:User = {
      name,
      apellido,
      direccion,
      telefono,
      type:'mascota',
    }
  }
  cerrar(){
    this.modalCtrl.dismiss();
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
      this.user.mascotas[index] = pet;
            
    })
    

  }
   
}
