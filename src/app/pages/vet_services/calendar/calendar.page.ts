import { Component, ViewChild, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { CalendarComponent } from 'ionic2-calendar/calendar';
import { AlertController, Events } from '@ionic/angular';
import { DbaService } from '../../../services/dba.service';
import { formatDate } from '@angular/common';
import { Tareas, Veterinaria, User } from '../../../models/usuarios';
import { Router } from '@angular/router';
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit {

  user:User;
  vet:Veterinaria;
  agregar_eventos:boolean;

  event = {
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    allDay: false
  };
  
  minDate = new Date().toISOString();
 
  eventSource:any[] = [];
  viewTitle;
 
  calendar = {
    mode: 'month',
    currentDate: new Date(),
    locale: 'es'
  };
 
  @ViewChild(CalendarComponent) myCal: CalendarComponent;
 
  constructor(private alertCtrl: AlertController,
     @Inject(LOCALE_ID) private locale: string, private eventos:Events,
     private dba:DbaService,
     private router:Router
     ) {
    console.log(locale);
    console.log(this.locale);
    //this.calendar.locale = this.locale;
  }
  volver(){
    this.router.navigate(['/main']);
  }
  ngOnInit() {
    
    let usuario = this.dba.getUsuario();
    this.eventos.subscribe('usuario',(user)=>{
      usuario = user;
      if (usuario.tasks){
        console.log(usuario.tasks);
        for(let task of usuario.tasks){
          this.update_tasks(task);
        }
      }
      if(usuario.type == 'mascota'){
        this.user = usuario;
      }
      if(usuario.type == 'institute') {
        this.vet = usuario;
      }
  
      this.resetEvent();
    })
    if (usuario.tasks){
      
      for(let task of usuario.tasks){
        this.update_tasks(task);
      }
    }
    if(usuario.type == 'mascota'){
      this.user = usuario;
    }
    if(usuario.type == 'institute') {
      this.vet = usuario;
    }

    this.resetEvent();
  }
  update_tasks(task) {
    
    let eventCopy = {
      title: task.title,
      startTime:  new Date(task.startTime),
      endTime: new Date(task.endTime),
      allDay: task.allDay,
      description: task.description
    }

   console.log(eventCopy);
    if (eventCopy.allDay) {
      let start = eventCopy.startTime;
      let end = eventCopy.endTime;
 
      eventCopy.startTime = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));
      eventCopy.endTime = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate() + 1));
    }
 
    this.eventSource.push(eventCopy);
    
    this.myCal.loadEvents();
    this.resetEvent();
    
  }
  resetEvent() {
    this.event = {
      title: '',
      description: '',
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      allDay: false
    };
  }
 
  // Create the right event format and reload source
  addEvent() {
    let eventCopy = {
      title: this.event.title,
      startTime:  new Date(this.event.startTime),
      endTime: new Date(this.event.endTime),
      allDay: this.event.allDay,
      description: this.event.description
    }
   console.log(eventCopy);
    if (eventCopy.allDay) {
      let start = eventCopy.startTime;
      let end = eventCopy.endTime;
 
      eventCopy.startTime = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));
      eventCopy.endTime = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate() + 1));
    }
 
    this.eventSource.push(eventCopy);
    
    this.dba.setEvent(eventCopy);
    this.agregar_eventos = false;
    this.myCal.loadEvents();
    this.resetEvent();
    
  }
  next() {
    var swiper = document.querySelector('.swiper-container')['swiper'];
    swiper.slideNext();
  }
   
  back() {
    var swiper = document.querySelector('.swiper-container')['swiper'];
    swiper.slidePrev();
  }
   
  // Change between month/week/day
  changeMode(mode) {
    
    this.calendar.mode = mode.target.value;
  }
   
  // Focus today
  today() {
    this.calendar.currentDate = new Date();
  }
   
  // Selected date reange and hence title changed
  onViewTitleChanged(title) {
    this.viewTitle = title;
  }
   
  // Calendar event was clicked
  async onEventSelected(event) {
    // Use Angular date pipe for conversion
    let start = formatDate(event.startTime, 'medium', this.locale);
    let end = formatDate(event.endTime, 'medium', this.locale);
   
    const alert = await this.alertCtrl.create({
      header: event.title,
      subHeader: event.description,
      message: 'From: ' + start + '<br><br>To: ' + end,
      buttons: ['OK']
    });
    alert.present();
  }
  onTimeSelected(ev) {
    let selected = new Date(ev.selectedTime);
    this.event.startTime = selected.toISOString();
    selected.setHours(selected.getHours() + 1);
    this.event.endTime = (selected.toISOString());
  }

}
