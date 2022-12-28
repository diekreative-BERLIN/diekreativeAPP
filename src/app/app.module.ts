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
import { EventsService } from './connectors/events.service';
import { UserstateService } from './userstate.service';
import { PredigtElementComponent } from './predigt-element/predigt-element.component';
import { HTTP } from '@ionic-native/http/ngx';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UnescapePipe } from './unescape.pipe';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
// add MediaCapture
import { MediaCapture } from '@ionic-native/media-capture/ngx';
//File
import { File } from '@ionic-native/File/ngx';
//Filetransfer
import { FileTransfer } from '@awesome-cordova-plugins/file-transfer/ngx';
//File Opener
import { FileOpener } from '@ionic-native/file-opener/ngx';

//Streaming media (player)
import { StreamingMedia } from '@ionic-native/streaming-media/ngx';
//Email Composer
import { EmailComposer } from '@ionic-native/email-composer/ngx';

//modal pages
import { TunSwapPageModule } from './tun-swap/tun-swap.module';
import { TunReleasePageModule } from './tun-release/tun-release.module';
import { TunTakeoverPageModule } from './tun-takeover/tun-takeover.module';
import { GdCheckinPageModule } from './gd-checkin/gd-checkin.module';

//Safari View Controller for iOS
import { SafariViewController } from '@awesome-cordova-plugins/safari-view-controller/ngx';
import { WebView } from '@awesome-cordova-plugins/ionic-webview/ngx';


@NgModule({
  declarations: [
    AppComponent
  ],
  entryComponents: [],
  imports: [ 
    FormsModule, BrowserModule, IonicModule.forRoot(), 
    AppRoutingModule, HttpClientModule, BrowserAnimationsModule, 
    TunSwapPageModule, TunReleasePageModule, TunTakeoverPageModule,
    GdCheckinPageModule],
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
    EventsService,
    UserstateService,
    SocialSharing,
    InAppBrowser,
    NativeStorage,
    Platform,
    MediaCapture,
    StreamingMedia,
    File,
    FileTransfer,
    FileOpener,
    EmailComposer,
    SafariViewController,
    WebView
    //LocalNotifications
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  
}
