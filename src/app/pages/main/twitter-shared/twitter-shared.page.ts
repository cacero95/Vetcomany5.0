import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ImagePicker,ImagePickerOptions } from '@ionic-native/image-picker/ngx';

@Component({
  selector: 'app-twitter-shared',
  templateUrl: './twitter-shared.page.html',
  styleUrls: ['./twitter-shared.page.scss'],
})
export class TwitterSharedPage implements OnInit {

  image64:string;
  imagePreview:string = "";
  is_image:boolean = false;

  constructor(private modalCtrl:ModalController,
    private imagePicker:ImagePicker) { }

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
        console.log(this.image64.length);
        this.is_image = true; // quiere decir que la imagen esta en la mascota
      }
    },(err)=>console.log(JSON.stringify(err)))
  }
  comentar(mensaje){
    this.modalCtrl.dismiss({
      imagen:this.image64,
      mensaje
    })
  }
  close(){
    this.modalCtrl.dismiss({
      'result':'cancelar'      
    })
  }
}
