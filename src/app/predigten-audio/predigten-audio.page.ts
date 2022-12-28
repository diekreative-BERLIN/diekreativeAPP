import { Component, OnInit } from '@angular/core';
//import { rawListeners } from 'process';
import { FeedsService } from '../communications/feeds.service';
import { NewsRss } from '../communications/news-rss';

import { Platform } from '@ionic/angular';
import { File } from '@ionic-native/File/ngx';
import { UserstateService } from '../userstate.service';

const MEDIA_FOLDER_NAME = 'temp_files';

@Component({
  selector: 'app-predigten-audio',
  templateUrl: './predigten-audio.page.html',
  styleUrls: ['./predigten-audio.page.scss'],
})
export class PredigtenAudioPage implements OnInit {
  isViewCompact=true;
  rssData:NewsRss;
  predigten;
  //localFiles = [];
  constructor(
    private feedservice:FeedsService,
    private platform: Platform,
    private file: File,
    private userState:UserstateService
  ) {  }


  ngOnInit() {
    this.getRssData();

    //console.log('ngInit predigt.element. AppPageMedienInit='+this.userState.AppPageMedienInit);
    this.platform.ready().then(() => {
      if(this.userState.AppPageMedienInit){
        this.userState.AppPageMedienInit = false;
        console.log('Page is now ready. reset AppMageMedienInit');
        let path = this.file.dataDirectory;
        this.file.checkDir(path, MEDIA_FOLDER_NAME).then(
          () => {
            this.loadFiles();
          },
          err => {
            this.file.createDir(path, MEDIA_FOLDER_NAME, false);
          }
        );
      }
    });
  }

  //read files in local storage
  loadFiles() {
    console.log('====> lade local files in array');
    
    this.file.listDir(this.file.dataDirectory, MEDIA_FOLDER_NAME).then(
      res => {
        this.userState.SermonLocalFiles = res;
        //this.localFiles = res;
        console.log('local files='+JSON.stringify(this.userState.SermonLocalFiles));
      },
      err => console.log('error loading files: ', err)
    );
  }
  
  getRssData() {
    this.rssData = this.feedservice.RssData;
    this.predigten = this.rssData.rss.channel[0].item
    //console.log(JSON.stringify(this.rssData));
  }

  async doRefresh(event) {
    if (event) {
      console.log('re-read feeds');
      this.predigten = [];
      this.isViewCompact = true;
      
      await this.feedservice.GetRssFeedData(this.feedservice.PREDIGTEN_URL,'').then((res)=>{
        //console.log("Feed gelesen"+JSON.stringify(res));
        //console.log('=> set rss Data from feed');
        this.rssData = this.feedservice.RssData;
        this.predigten = this.rssData.rss.channel[0].item;
      });
      
      event.target.complete();
    }
     
  }

  public async getMoreSermons() {
    this.isViewCompact = false;

    await this.feedservice.GetRssFeedData(this.feedservice.PREDIGTEN_URL,'more').then((res)=>{
      //console.log("Feed gelesen"+JSON.stringify(res));
      //console.log('=> set rss Data from feed');
      this.rssData = this.feedservice.RssData;
      this.predigten = this.predigten.concat(this.rssData.rss.channel[0].item);
    });
  }

}
