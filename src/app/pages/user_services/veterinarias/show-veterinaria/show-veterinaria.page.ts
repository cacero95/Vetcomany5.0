import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, NavParams } from '@ionic/angular';
import { DbaService } from '../../../../services/dba.service';
import { Veterinaria, Tareas, User } from '../../../../models/usuarios';

@Component({
  selector: 'app-show-veterinaria',
  templateUrl: './show-veterinaria.page.html',
  styleUrls: ['./show-veterinaria.page.scss'],
})
export class ShowVeterinariaPage implements OnInit {
  is_transporte:boolean;
  entidad:Veterinaria;
  user:User;
  
  constructor(private modalCtrl:ModalController,
    private dba:DbaService,
    private alertCtrl:AlertController,
    private params:NavParams) {
      
    }

  ngOnInit() {
    this.user = this.dba.getUsuario();
    this.entidad = this.params.get('entidad')
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
    let date = new Date();
    let tick:boolean = true;
    let tarea:Tareas;
    let alert = await this.alertCtrl.create({
      header:'Que dia',
      message:'es el evento <strong>evento</strong>?',
      mode:'ios',
      inputs:[
        {
          name:'title',
          placeholder:'Titulo',
          type:'text'
        },
        {
          name:'descripcion',
          placeholder:'Descripción',
          type:'text'
        }
      ],
      buttons:[
        {
          text:'Proximo mes',
          role:'mes',
          handler:(values)=>{
            let aumento = (24*60*60*1000)*7;
            aumento = aumento * 4;
            let mes = new Date(date.getTime()+aumento)
            tarea = {
              
              startTime:mes,
              title:values.title,
              description:values.descripcion,
              origen:this.entidad.name,
              
              
            }
          }
        },
        {
          text:'En 15 días',
          role:'quince',
          handler:(values)=>{
            let aumento = (24*60*60*1000)*7;
            aumento = aumento * 2;
            let fifteen = new Date(date.getTime()+aumento);
            tarea = {

              startTime:fifteen,
              title:values.title,
              description:values.descripcion,
              origen:this.entidad.name
              
              
            }
          }
        },
        {
          text:'Proxima semana',
          role:'7 dias',
          handler:(values)=>{
            let next_week = new Date(date.getTime()+(24*60*60*1000)*7);
            tarea = {
              
              startTime:next_week,
              title:values.title,
              description:values.descripcion,
              origen:this.entidad.name,
              
              
            }
          }
        },
        {
          text:'Mañana',
          role:'Mañana',
          handler:(values)=>{
            let tomorrow = new Date(date.getTime()+24*60*60*1000);
            tarea = {
              
              startTime:tomorrow,
              title:values.title,
              description:values.descripcion,
              origen:this.entidad.name,
              
              
            }
          }
        },
        {
          text:'Cancelar',
          role:'Cancelar',
          handler:()=>{
            tick = false;
            alert.dismiss();
          }
        }
      ]
    });
    alert.present();
    alert.onDidDismiss().then(()=>{
      if(tick){

        this.dba.setEvent(tarea);
      }
    })
  }
}