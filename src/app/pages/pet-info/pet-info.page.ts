import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DbaService } from 'src/app/services/dba.service';

import { ModalController } from '@ionic/angular';
import { FullViewPage } from './full-view/full-view.page';

import { PetInfo,PetData } from '../../models/pets_data';

@Component({
  selector: 'app-pet-info',
  templateUrl: './pet-info.page.html',
  styleUrls: ['./pet-info.page.scss'],
})
export class PetInfoPage implements OnInit {

  title:string;
  tips:PetData [] = [];
  info:PetData [] = [];
  // se va intercalando la informacion entre los dos arreglos
  pet_information:PetData[] = []; // este arreglo es el que se va mostrar en el html
  load:boolean = false;
  selection:string;
  constructor(private router:Router,
    private dba:DbaService, private modalCtrl:ModalController) {}
    
ngOnInit() {
  
  this.load = true;
  this.dba.pet_info().subscribe(async(data:any)=>{
    
    for(let pet_info of data){
      switch(pet_info.key){
        case 'policial':
          this.info = pet_info.data;
          break;
        case 'tips':
          this.tips = pet_info.data;
      }
    }
    let complete = await this.tips;
    if(complete){
      this.pet_information = this.tips;
      this.load = false;
      this.title = 'Consejos';
    }
    
  });

  
}
  change_info(event){

    this.selection = event.target.value;   
    switch(this.selection){
      case 'tips':
        this.pet_information = this.tips;
        this.title = 'Consejos'
      break;
      case 'policial':
        this.title = 'Mascotas en el codigo de policía'
        this.pet_information = this.info;
    }
  }
  ubicar(ubicacion){
    this.router.navigate([`/${ubicacion}`]);
  }

  async full_view(data){
    let modal = await this.modalCtrl.create({
      component:FullViewPage,
      componentProps:{
        info:data
      }
    });
    modal.present(); 
  }

}
