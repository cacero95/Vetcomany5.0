import { Component, OnInit } from '@angular/core';
import { Veterinaria, Tareas, Mascota,User } from '../../../models/usuarios';
import { DbaService } from '../../../services/dba.service';
import { Events, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';



@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {
  vet:Veterinaria;
  busqueda:string = '';
  tasks = {} as Tareas;
  constructor(private dba:DbaService,
    private event:Events,
    private alertCtrl:AlertController,
    private router:Router) { }
  
  back(){
    this.router.navigate(['/main']);
  }

  ngOnInit() {
    this.vet = this.dba.getUsuario();
    console.log(this.vet);
    this.event.subscribe('usuario',(usuario)=>{
      this.event = usuario;
    })
  }
  llamar(numero){
    console.log(numero);
  }
  buscar_usuarios(event){
    this.busqueda = event.target.value;
  }
  async add_event(usuario:User,mascota:Mascota){
    let date = new Date();
    
    let tarea:Tareas;
    let alert = await this.alertCtrl.create({
      header:'Ingresar evento',
      mode:'ios',
      animated:true,
      inputs:[
        {
          name:'title',
          placeholder:'Titulo',
          type:'text'

        },
        {
          name:'descripcion',
          placeholder:'Descripcion',
          type:'text'
        }
      ],
      buttons:[
        {
          text:'Mañana',
          role:'tomorrow',
          handler:(values)=>{
            
            let tomorrow = new Date(date.getTime()+24*60*60*1000);
            tarea = {
              
              startTime:tomorrow,
              title:values.title,
              description:values.descripcion,
              origen:this.vet.name,
              destino:usuario.email
              
            }
          }
        },
        {
          text:'Mensual',
          role:'Mensual',
          handler:(values)=>{
            let aumento = (24*60*60*1000)*7;
            aumento = aumento * 4;
            let mes = new Date(date.getTime()+aumento)
            tarea = {
              
              startTime:mes,
              title:values.title,
              description:values.descripcion,
              origen:this.vet.name,
              destino:usuario.email
              
            }
          }
        },
        {
          text:'Cada 15',
          role:'15 dias',
          handler:(values)=>{
            
            let aumento = (24*60*60*1000)*7;
            aumento = aumento * 2;
            let fifteen = new Date(date.getTime()+aumento);
            tarea = {

              startTime:fifteen,
              title:values.title,
              description:values.descripcion,
              origen:this.vet.name,
              destino:usuario.email
              
            }
          }
        },
        {
          text:'Semanal',
          role:'7 dias',
          handler:(values)=>{
            
            let next_week = new Date(date.getTime()+(24*60*60*1000)*7);
            tarea = {
              
              startTime:next_week,
              title:values.title,
              description:values.descripcion,
              origen:this.vet.name,
              destino:usuario.email
              
            }
          }
        },
        {
          text:'cancelar',
          role:'cancelar',
          handler:()=>{
            alert.dismiss();
          }
        }
      ]
    });
    alert.present();
    alert.onDidDismiss().then(()=>console.log(tarea))
  }
  
}
