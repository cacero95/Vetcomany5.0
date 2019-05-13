import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HttpClientModule } from '@angular/common/http';
import { TypeUserPage } from './pages/type-user/type-user.page';

// plugins
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Facebook } from '@ionic-native/facebook/ngx';

import { FCM } from '@ionic-native/fcm/ngx';

// firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { FullViewPage } from './pages/pet-info/full-view/full-view.page';
import { TwitterGroupPage } from './pages/grupos/twitter-group/twitter-group.page';
import { ShowVeterinariaPage } from './pages/user_services/veterinarias/show-veterinaria/show-veterinaria.page';
import { MascotaPage } from './pages/mascota/mascota.page';
import localeCO from '@angular/common/locales/es-CO';
import localeCOExtra from '@angular/common/locales/extra/es-CO';
import { registerLocaleData } from '@angular/common';
import { TwitterSharedPage } from './pages/main/twitter-shared/twitter-shared.page';
import { EditarPage } from './pages/user/editar/editar.page';
import { EditarVetPage } from './pages/user/editar-vet/editar-vet.page';

// firebase credentials

export const firebaseConfig = {
  apiKey: "AIzaSyBVY89FFlPr00IH6TuWsszn0CgpFn0ZkA0",
  authDomain: "gag-6f2a5.firebaseapp.com",
  databaseURL: "https://gag-6f2a5.firebaseio.com",
  projectId: "gag-6f2a5",
  storageBucket: "gag-6f2a5.appspot.com",
  messagingSenderId: "645855939410"
};

registerLocaleData(localeCO,'es',localeCOExtra);
@NgModule({
  declarations: [
    AppComponent,
    TypeUserPage,
    FullViewPage,
    TwitterGroupPage,
    ShowVeterinariaPage,
    MascotaPage,
    TwitterSharedPage,
    EditarPage,
    EditarVetPage
  ],
  entryComponents: [
    TypeUserPage,
    FullViewPage,
    TwitterGroupPage,
    ShowVeterinariaPage,
    MascotaPage,
    TwitterSharedPage,
    EditarPage,
    EditarVetPage
  ],
  imports: [BrowserModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    HttpClientModule,
    AngularFireAuthModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule],
  providers: [
    StatusBar,
    SplashScreen,
    ImagePicker,
    SocialSharing,
    InAppBrowser,
    Facebook,
    
    FCM,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
