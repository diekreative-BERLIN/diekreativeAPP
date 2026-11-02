import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { IonSearchbar } from '@ionic/angular';
//import { rawListeners } from 'process';
import { FeedsService } from '../communications/feeds.service';
import { NewsRss } from '../communications/news-rss';

import { Platform } from '@ionic/angular';
import { UserstateService } from '../userstate.service';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';

const MEDIA_FOLDER_NAME = 'temp_files';

@Component({
  selector: 'app-predigten-audio',
  templateUrl: './predigten-audio.page.html',
  styleUrls: ['./predigten-audio.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PredigtenAudioPage implements OnInit {
  isViewCompact=true;
  rssData:NewsRss;
  predigten;
  gefiltertePredigten;
  //localFiles = [];
  currentListWasSetByLocalDb=false;
  currentSermons;

  @ViewChild('searchbar', { static: false }) searchbar: IonSearchbar;

  constructor(
    private feedservice:FeedsService,
    private platform: Platform,
    public userState: UserstateService,
  ) {  }

  ngOnInit() {
    //hier bei ngOnInit initial sermonLocalFiles setzen (am besten in userstate service) indem wir local storage auslesen
    //dann arbeiten wir die ganze zeit einfach mit dem sermonLocalFiles im Speicher und erst beim onLeave schreiben wir localStorage zurück!
    //console.log('ngInit predigt.element. AppPageMedienInit='+this.userState.AppPageMedienInit);
    //console.log('is online? '+this.userState.isOnline);
    this.feedservice.RssData2.subscribe((data) => {
      console.log('=> set rss Data from feed'+data);
      this.rssData = data;
      this.predigten = this.rssData?.rss.channel[0].item;
      this.gefiltertePredigten = this.predigten;
    });

    this.platform.ready().then(() => {

      //if(this.userState.AppPageMedienInit){
      //  this.userState.AppPageMedienInit = false;
      //  console.log('Page is now ready. reset AppMageMedienInit');
        //let path = this.file.documentsDirectory;
        Filesystem.getUri({
          directory: Directory.Data,
          path: MEDIA_FOLDER_NAME
        }).then((res) => {
          console.log('Directory Data: '+res.uri);
        },
          err => {
            Filesystem.mkdir({
              directory: Directory.Data,
              path: MEDIA_FOLDER_NAME,
              recursive: false});
          }
        )});
      //}

      //set SermonLocalArray
      if (this.userState.SermonLocalFiles?.length < 1) {

        Preferences.get({ key: 'localSermons' }).then((value) => {
          const localSermons = value.value;
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
    Preferences.get({ key: 'localSermons' }).then((value) => {
      const localSermons = value.value;
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
      this.gefiltertePredigten = this.predigten;
    });
}  

  getRssData() {
    console.log(this.feedservice.RssData);
    this.rssData = this.feedservice.RssData;
    this.predigten = this.rssData?.rss.channel[0].item;
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
        
        this.feedservice.GetRssFeedData(this.feedservice.PREDIGTEN_URL,'').then((res)=>{
          //console.log("Feed gelesen"+JSON.stringify(res));
          //console.log('=> set rss Data from feed');
          this.rssData = this.feedservice.RssData;
          this.predigten = this.rssData?.rss.channel[0].item;
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
    this.searchbar.value = '';
    this.isViewCompact = false;

    this.currentSermons = this.predigten;
    await this.feedservice.GetRssFeedData(this.feedservice.PREDIGTEN_URL,'more').then((res)=>{
      //console.log("Feed gelesen"+JSON.stringify(res));
      //console.log('=> set rss Data from feed');
      this.rssData = this.feedservice.RssData;
      this.predigten = this.currentSermons.concat(this.rssData.rss.channel[0].item);
      this.gefiltertePredigten = this.predigten;
    });
  }

  public filterPredigten(event){
    console.log(event);
    const target = event.target as HTMLIonSearchbarElement;
    const query = target.value?.toLowerCase() || '';
    this.gefiltertePredigten = this.predigten.filter((predigt) => {
      //console.log(predigt);
      return predigt.title[0].toLowerCase().includes(query) 
      || predigt.description[0].toLowerCase().includes(query)
    })
  }
  

}
