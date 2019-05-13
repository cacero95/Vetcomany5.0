import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ImagePicker,ImagePickerOptions } from '@ionic-native/image-picker/ngx';
import { SocialService } from '../../../services/social.service';

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
    private imagePicker:ImagePicker,
    private social:SocialService) { }

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
  async comentar(mensaje){
    if (this.image64){
      let url = await this.social.upload_file(this.image64);
      console.log(url);
      if (url){

        this.modalCtrl.dismiss({
          imagen:url,
          mensaje
        })

      }
    }
  }
  close(){
    this.modalCtrl.dismiss({
      'result':'cancelar'      
    })
  }
}
