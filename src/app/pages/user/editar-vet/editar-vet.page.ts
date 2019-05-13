import { Component, OnInit } from '@angular/core';
import { Veterinaria } from '../../../models/usuarios';
import { DbaService } from 'src/app/services/dba.service';
import { ModalController } from '@ionic/angular';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';

@Component({
  selector: 'app-editar-vet',
  templateUrl: './editar-vet.page.html',
  styleUrls: ['./editar-vet.page.scss'],
})
export class EditarVetPage implements OnInit {
  
  imagePreview:string;
  image64:string;
  vet:Veterinaria;
  servicios:any[] = [];
  change:boolean = false;
  constructor(private dba:DbaService,
    private modal:ModalController,
    private imagePicker:ImagePicker) { }

  ngOnInit() {

    this.vet = this.dba.getUsuario();
    console.log(this.vet);
    this.servicios = [
      {
          nombre: 'guarderia',
          img: 'assets/img/home.png',
          tick: false
      },
      {
          nombre: 'peluqueria',
          img: 'assets/img/tijeras.png',
          tick: false
      },
      {
          nombre: 'urgencias',
          img: 'assets/img/warning.jpg',
          tick: false
      },
      {
          nombre: 'veterinaria',
          img: 'assets/img/veterinaria.png',
          tick: false
      },
      {
          nombre: 'hotel mascotas',
          img: 'assets/img/hotel.png',
          tick: false
      },
      {
          nombre: 'transporte mascotas',
          img: 'assets/img/warning.jpg',
          tick: false
      }
      ];
      let index = 0;
      for (let servicio of this.servicios){
        let find = this.vet.services.find((element)=>{
          return element === servicio.nombre
        });
        if (find){
          servicio.tick = true;
          this.servicios[index] = servicio;
        }
        index = index+1;
      }
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
         
         // quiere decir que la imagen esta en la mascota
         this.change = true;
      }
    }).then(()=>{
      this.vet.url = this.image64;
    })
  }

  setServices(nombre){
    console.log(nombre);
    this.change = true;
    let find = this.vet.services.findIndex((element)=>{
      return nombre === element
    });
    console.log(find);
    if (find == -1){
      this.vet.services.push(nombre);
    }
    else {
      this.vet.services.splice(find);
    }
  }
  cerrar(){
    this.modal.dismiss({
      'result':false
    });
  }
  async confirmar(nombre,direccion,telefono){
    
    
    if (nombre != this.vet.name){
      this.vet.name = nombre;
      this.change = true;
    }
    if (direccion != this.vet.direccion){
      this.vet.direccion = direccion;
      this.change = true;
    }
    if(telefono != this.vet.telefono){
      this.vet.telefono = telefono;
       this.change = true;
    }

    console.log(this.vet);
    if(this.change){
      let respuesta = await this.dba.registrar_vet(this.vet);
      if(respuesta){
        this.modal.dismiss({
          'result':true
        })
      }
    }
  }

}
