import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { DbaService } from '../../../../services/dba.service';
import { Veterinaria } from '../../../../models/usuarios';

@Component({
  selector: 'app-show-veterinaria',
  templateUrl: './show-veterinaria.page.html',
  styleUrls: ['./show-veterinaria.page.scss'],
})
export class ShowVeterinariaPage implements OnInit {
  is_transporte:boolean;
  entidad:Veterinaria;
  constructor(private modalCtrl:ModalController,
    private dba:DbaService,
    private alertCtrl:AlertController) {

    }

  ngOnInit() {
    this.entidad = this.dba.getEntidad_user();
    console.log(this.entidad);
    for(let servicio of this.entidad.services){
      if (servicio == 'Transporte mascotas'){
        this.is_transporte = true;
      }
    }
  }
  cerrar(){
    this.modalCtrl.dismiss();
  }
  pedir_transporte(){

  }
  async add_event(){
    let alert = await this.alertCtrl.create({
      header:'Cada cuanto',
      message:'Se repetira el <strong>evento</strong>!!!',
      buttons:[
        {
          text:'Cada mes',
          role:'mes',
          handler:()=>{
            
          }
        },
        {
          text:'Cada 15 dias',
          role:'quince',
          handler:()=>{

          }
        },
        {
          text:'Otro',
          role:'otro',
          handler:()=>{

          }
        },
        {
          text:'Nunca',
          role:'Nunca',
          handler:()=>{

          }
        }
      ]
    });
    alert.present();
  }
}