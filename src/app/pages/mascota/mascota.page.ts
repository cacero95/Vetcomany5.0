import { Component, OnInit } from '@angular/core';
import { Mascota } from 'src/app/models/usuarios';

import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';
import { ModalController } from '@ionic/angular';



@Component({
  selector: 'app-mascota',
  templateUrl: './mascota.page.html',
  styleUrls: ['./mascota.page.scss'],
})
export class MascotaPage implements OnInit {

  image64:string;
  mascota:Mascota;
  imagePreview:string = "";
  is_image:boolean = false;

  constructor(private modalCtrl:ModalController,
    private imagePicker:ImagePicker,
    ) { }

  ngOnInit() {
  }
  choose_photo(){

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
    },(err)=>console.log(JSON.stringify(err)))
    
  }

  close(nombre:string, year:number, breed:string){
    this.mascota = {
      pet_name: nombre,
      edad: year,
      raza: breed
    }
    if (this.is_image){
      this.mascota.url = this.image64;
    }
    this.modalCtrl.dismiss({
      'mascota': this.mascota,
      'is_image': this.is_image
    });
  }
  cerrar(){
    this.modalCtrl.dismiss({
      'mascota': 'cancelo'
    })
  }
}
