import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { Router } from '@angular/router';

import { DomSanitizer } from "@angular/platform-browser";

import { Platform } from '@ionic/angular';
import { DefaultSystemBrowserOptions, InAppBrowser } from '@capacitor/inappbrowser';

import { EventsService } from '../connectors/events.service';

@Component({
  selector: 'app-ministryteam',
  templateUrl: './ministryteam.page.html',
  styleUrls: ['./ministryteam.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MinistryteamPage implements OnInit {
  loading;
  MVideo;
  MScript;


  isInit=false;

  constructor(
    private router: Router,
    private sanitizer: DomSanitizer,
    private platform: Platform,
    private events:EventsService
  ) {

  }

  ngOnInit(){
    //links coming from diekreative.org/addons/dkEvents/index.php
      this.events.getEventLinks().then((result)=>{
        this.MVideo = (result.data).mvideo;
        this.MScript = (result.data).mscript;
        /*
        console.log('Ministry Video =');
        console.log(this.MVideo);
        console.log('Ministry Script =');
        console.log(this.MScript);
        */
      });
  }    


  openWebsite(url){
    this.platform.ready().then(async () => {
      InAppBrowser.openInSystemBrowser({url, options:DefaultSystemBrowserOptions});
    });
  }
  showMinistryVideo(){
    this.openWebsite(this.MVideo);
  }
  
  openSkript(){
    this.platform.ready().then(async () => {
        console.log('open pdf: ',this.MScript);
        await InAppBrowser.openInSystemBrowser({url:this.MScript,options:DefaultSystemBrowserOptions});
    });
  }

  /*
//TODO: Temp Test
  async initialisire_hier() {
    console.log('in init');
    await AudioPlayer.create({
      audioId: 'my-audio',
      audioSource: 'https://example.com/audio.mp3',
      useForNotification: true,
      friendlyTitle: 'meine Audio Datei'
    });
    this.isInit = true;
  }
*/

  
}
