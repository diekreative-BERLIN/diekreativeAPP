import { Component, OnInit } from '@angular/core';
//import { rawListeners } from 'process';
import { FeedsService } from '../communications/feeds.service';
import { NewsRss } from '../communications/news-rss';

import { Platform } from '@ionic/angular';
import { File } from '@ionic-native/File/ngx';
import { UserstateService } from '../userstate.service';

import { NativeStorage } from '@ionic-native/native-storage/ngx';

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
  currentListWasSetByLocalDb=false;

  constructor(
    private feedservice:FeedsService,
    private platform: Platform,
    private file: File,
    public userState: UserstateService,
    private nativeStorage: NativeStorage
  ) {  }

  ngOnInit() {
    //hier bei ngOnInit initial sermonLocalFiles setzen (am besten in userstate service) indem wir local storage auslesen
    //dann arbeiten wir die ganze zeit einfach mit dem sermonLocalFiles im Speicher und erst beim onLeave schreiben wir localStorage zurück!
    //console.log('ngInit predigt.element. AppPageMedienInit='+this.userState.AppPageMedienInit);
    //console.log('is online? '+this.userState.isOnline);
    this.platform.ready().then(() => {

      //if(this.userState.AppPageMedienInit){
      //  this.userState.AppPageMedienInit = false;
      //  console.log('Page is now ready. reset AppMageMedienInit');
        let path = this.file.documentsDirectory;
        this.file.checkDir(path, MEDIA_FOLDER_NAME).then(
          () => {
            //this.loadFiles();
          },
          err => {
            this.file.createDir(path, MEDIA_FOLDER_NAME, false);
          }
        );
      //}

      //set SermonLocalArray
      if (this.userState.SermonLocalFiles.length < 1) {
        this.nativeStorage.getItem('localSermons').then((localSermons)=>{
          let data = JSON.parse(localSermons);
          this.userState.SermonLocalFiles = data;
        });
      }
      
      if (this.userState.isOnline) {
        this.getRssData();
        this.currentListWasSetByLocalDb = false;
      } else {
        this.getLocalSermons();
        this.currentListWasSetByLocalDb = true;
      }
    });
  }

  //needed if we enter mediathek after reset cache in settings!
  ionViewWillEnter() {
    console.log('ionViewWillEnter -> AppPageMedienInit? '+this.userState.AppPageMedienInit);
    if(this.userState.AppPageMedienInit){
      this.userState.AppPageMedienInit = false;

      this.userState.SermonLocalFiles = [];
      this.predigten = [];
      this.isViewCompact = true;
      
      if (this.userState.isOnline) {
        this.getRssData();
        this.currentListWasSetByLocalDb = false;
      } else {
        this.getLocalSermons();
        this.currentListWasSetByLocalDb = true;
      }
      window.location.reload();
    }
  }

  //read saved Sermons aus native Storage and passes to localSermonsArr
  private getLocalSermons() {
    this.nativeStorage.getItem('localSermons').then((localSermons)=>{
      //console.log('local Sermons aus nativeStorage - read and also set userState with it!');
      //console.log(localSermons);

      let data = JSON.parse(localSermons);

      //console.log( data );

      let localSermonsArr=[];
      //console.log("----for-----");
      for(var index in data) {
        console.log(data[index]);
        const predigt: Array<{title: Array<any>, pubDate: Array<any>, basedate: Array<any>, description: Array<any>, enclosure: Array<{$: {url: string}}>, skript: Array<any>, youtube: Array<any>}> = [{
          title: [data[index].title],
          pubDate: [new Date(data[index].pubDate)],
          basedate: [data[index].basedate],
          description: [data[index].description],
          enclosure: [{$: {url:data[index].url}}],
          skript: [data[index].skript],
          youtube: [data[index].youtube]
        }];
        //console.log('add... data line=');
        //console.log(predigt);
        localSermonsArr.push(predigt[0]);
      }

      //console.log('ende feuer.. localSermonsArr=');
      //console.log(localSermonsArr);

      this.predigten = [];
      this.isViewCompact = true;
      this.predigten = localSermonsArr;
    });
}  

  getRssData() {
    this.rssData = this.feedservice.RssData;
    this.predigten = this.rssData.rss.channel[0].item;
    //console.log('initial getRss -> predigten: =====>');
    //console.log(JSON.stringify(this.predigten));
  }

  async doRefresh(event) {
    if (event) {
      if (this.userState.isOnline) {
        console.log('re-read feeds');
        //window.location.reload();

        this.predigten = [];
        this.isViewCompact = true;
        
        await this.feedservice.GetRssFeedData(this.feedservice.PREDIGTEN_URL,'').then((res)=>{
          //console.log("Feed gelesen"+JSON.stringify(res));
          //console.log('=> set rss Data from feed');
          this.rssData = this.feedservice.RssData;
          this.predigten = this.rssData.rss.channel[0].item;
          //this.predigten.next(this.rssData.rss.channel[0].item);
        });

        this.currentListWasSetByLocalDb = false;

        window.location.reload();
      } else {
        //no refresh wenn offline
      }
      
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
