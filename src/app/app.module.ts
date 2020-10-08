import { FormsModule } from '@angular/forms';
import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FirebaseX } from "@ionic-native/firebase-x/ngx";
import '@angular/common/locales/global/de';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChurchapiService } from './connectors/churchapi.service';
import { FeedsService } from './communications/feeds.service';
import { UserstateService } from './userstate.service';
import { PredigtElementComponent } from './predigt-element/predigt-element.component';
import { HTTP } from '@ionic-native/http/ngx';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UnescapePipe } from './unescape.pipe';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

//modal pages
import { TunSwapPageModule } from './tun-swap/tun-swap.module';
import { TunReleasePageModule } from './tun-release/tun-release.module';
import { TunTakeoverPageModule } from './tun-takeover/tun-takeover.module';

@NgModule({
  declarations: [AppComponent, UnescapePipe],
  entryComponents: [],
  imports: [ 
    FormsModule, BrowserModule, IonicModule.forRoot(), 
    AppRoutingModule, HttpClientModule, BrowserAnimationsModule, 
    TunSwapPageModule, TunReleasePageModule, TunTakeoverPageModule],
  providers: [
    StatusBar,
    SplashScreen,
    FirebaseX,
    ChurchapiService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LOCALE_ID, useValue: 'de' },
    HttpClientModule,
    HTTP,
    FeedsService,
    ChurchapiService,
    UserstateService,
    SocialSharing,
    InAppBrowser,
    NativeStorage,
    Platform
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  
}
