import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-type-user',
  templateUrl: './type-user.page.html',
  styleUrls: ['./type-user.page.scss'],
})
export class TypeUserPage implements OnInit {

  
  constructor(private modalCtrl:ModalController) {
    
    
   }
  cerrar(){
    this.modalCtrl.dismiss();
  }
  ngOnInit() {
  }
  ingresar(type:string){
    this.modalCtrl.dismiss({
      'result':type
    })
  }
  

}
