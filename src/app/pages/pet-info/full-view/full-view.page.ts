import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { PetData } from '../../../models/pets_data';

@Component({
  selector: 'app-full-view',
  templateUrl: './full-view.page.html',
  styleUrls: ['./full-view.page.scss'],
})
export class FullViewPage implements OnInit {
  data:PetData;
  constructor(private params:NavParams,
    private modalCtrl:ModalController) { }

  ngOnInit() {
    this.data = this.params.get('info');
    console.log(this.data);
  }
  cerrar(){
    this.modalCtrl.dismiss();
  }
}
