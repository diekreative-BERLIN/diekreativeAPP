import { FormsModule } from '@angular/forms';
import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy, Platform } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChurchapiService } from './connectors/churchapi.service';
import { FeedsService } from './communications/feeds.service';
import { EventsService } from './connectors/events.service';
import { UserstateService } from './userstate.service';
//import { PredigtElementComponent } from './predigt-element/predigt-element.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//modal pages
import { TunSwapPageModule } from './tun-swap/tun-swap.module';
import { TunReleasePageModule } from './tun-release/tun-release.module';
import { TunTakeoverPageModule } from './tun-takeover/tun-takeover.module';
import { GdCheckinPageModule } from './gd-checkin/gd-checkin.module';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

registerLocaleData(localeDe, 'de');


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [ 
    FormsModule, BrowserModule, IonicModule.forRoot(), 
    AppRoutingModule, HttpClientModule, BrowserAnimationsModule, 
    TunSwapPageModule, TunReleasePageModule, TunTakeoverPageModule,
    GdCheckinPageModule],
  providers: [
    ChurchapiService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LOCALE_ID, useValue: 'de' },
    HttpClientModule,
    FeedsService,
    EventsService,
    UserstateService,
    Platform,
    provideAnimationsAsync('noop'),
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  
}
