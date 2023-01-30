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
    public userState:UserstateService,
    private nativeStorage: NativeStorage
  ) {  }


/*
ionViewWillEnter() {
  return;
    console.log('ionView-Will-Enter: AppPageMedienInit='+this.userState.AppPageMedienInit + ' is online? '+this.userState.isOnline);
    // Code goes here...
    //this.getLocalSermons();
    let test = [{"title":["Jesus – wenn du Rettung brauchst"],"link":["https://diekreative.org/predigten/2022/20221218_jesus_retter/"],"pubDate":["Sun, 18 Dec 2022 09:30:05 +0000"],"basedate":["221218"],"guid":[{"_":"https://diekreative.org/?p=23359","$":{"ispermalink":"false"}}],"comments":["https://diekreative.org/predigten/2022/20221218_jesus_retter/#respond"],"category":["2022"],"description":["Die frohe Botschaft von Advent und Weihnachten ist: Jesus, der Retter ist gekommen! Diese Botschaft hat nichts von ihrer Aktualität verloren. Christophe nennt etliche Punkte, von was uns Jesus errettet hat und weiter will:\n• von Schmerzen und Krankheit\n• von dämonischen Bindungen\n• von finanzieller Not\n• aus sozialem Status, ausgegrenzt, verachtet zu sein, auch aus eigener Schuld heraus\n• aus Verstrickung von Sünde\n• aus Hoffnungslosigkeit – kann mir vergeben werden?\n• aus Herzenshaltungen von Gier, Sorge, Menschengefälligkeit, Rache und Unvergebenheit\n• aus falschen Bünden, Allianzen, Finsternis, Esoterik, geistl. Lügen … u.v.m.\nWarum ist Jesu Rettung so dringend notwendig? Es gibt einen Feind, der lügt, täuscht, betrügt mit einem einzigen Ziel – zu zerstören, rauben, anzuklagen.\nGenau darum ist Jesus gekommen, um uns von all dem zu retten, zu vergeben, zu befreien! Was ist unser Anteil? Der Kampf im Gebet, kein Aufbruch ohne Gebet! Christophe selbst kam zum Glauben durch das Gebet seiner Mutter. Mit Proklamation und Segnungen endet der Gottesdienst.\nLk 2,10-12| Lk 4 und 5 | Joh 4,11ff | Mt 5-6 | Joh 10,10 | Joh 8,44 | Off 12,10 | 1.Joh 1,9-10 | 2.Kor 10,3-5 | 1.Petr 5,8-9"],"enclosure":[{"$":{"url":"https://diekreative.org/audio/20221218_jesus_retter.mp3","length":"75860861","type":"audio/mpeg"}}],"skript":["https://diekreative.org/audio/20221218_jesus_retter.pdf"],"youtube":[""]},
    {"title":["Gerechtigkeit, Friede und Freude im Heiligen Geist | Königreich Realitäten"],"link":["https://diekreative.org/predigten/2022/gerechtigkeit-friede-und-freude-im-heiligen-geist/"],"pubDate":["Sun, 17 Jul 2022 15:42:41 +0000"],"basedate":["220717"],"guid":[{"_":"https://diekreative.org/?p=22544","$":{"ispermalink":"false"}}],"comments":["https://diekreative.org/predigten/2022/gerechtigkeit-friede-und-freude-im-heiligen-geist/#respond"],"category":["2022"],"description":["Predigt von Marc Andersohn\nPhil 4,4 | Neh 8,10 | Röm 15,13 | Röm 14,17\n[ux_products_list cat=”93″]"],"enclosure":[{"$":{"url":"https://diekreative.org/audio/20220717_friede_und_freude_im_geist.mp3","length":"46650823","type":"audio/mpeg"}}],"skript":["https://diekreative.org/audio/20220717_friede_und_freude_im_geist.pdf"],"youtube":["https://youtu.be/-G3VPfltyiI"]},
    {"title":["Test von Hand"],"link":["https://diekreative.org/termine/"],"pubDate":["Sun, 10 Jul 2022 15:42:41 +0000"],"basedate":["220710"],"guid":[{"_":"-","$":{"ispermalink":"false"}}],"comments":["-"],"category":["2022"],"description":["das ist die Beschreibung..."],"enclosure":[{"$":{"url":"https://diekreative.org/audio/20220717_friede_und_freude_im_geist.mp3","length":"46650823","type":"audio/mpeg"}}],"skript":[""],"youtube":[""]}];
    this.predigten = test;
    //this.predigten = [];
}
ionViewWillLeave() {
    console.log('ionView-Will-Leave: AppPageMedienInit='+this.userState.AppPageMedienInit + ' is online? '+this.userState.isOnline);
    // Code goes here...
}
*/

test_add2arr() {
  this.userState.SermonLocalFiles.push({title: "Jesus - wenn du Rettung brauchst",
      pubDate: new Date("Sun, 18 Dec 2022 09:30:05 +0000"),
      basedate: "221218",
      description: "blabla",
      url: "https://diekreative.org/audio/20221218_jesus_retter.mp3",
      skript: "https://diekreative.org/audio/20221218_jesus_retter.pdf",
      youtube: "",
      savedlocal: new Date()
    }
  );
  this.userState.SermonLocalFiles.push({title: "Gerechtigkeit, Friede und Freude im Heiligen Geist | Königreich Realitäten",
    pubDate: new Date("Sun, 17 Jul 2022 15:42:41 +0000"),
    basedate: "220717",
    description: "Predigt von Marc Andersohn\nPhil 4,4 | Neh 8,10 | Röm 15,13 | Röm 14,17",
    url: "https://diekreative.org/audio/20220717_friede_und_freude_im_geist.mp3",
    skript: "https://diekreative.org/audio/20220717_friede_und_freude_im_geist.pdf",
    youtube: "https://youtu.be/-G3VPfltyiI",
    savedlocal: new Date()
   }
  );
  console.log('testdaten array:');
  console.log(this.userState.SermonLocalFiles);
}

readLocalFiles() {
  console.log('read userState.SermonLocalFiles:');
  console.log( JSON.parse(JSON.stringify(this.userState.SermonLocalFiles)) );
}


getLocalSermons() {
  
  /*
  let test = [{"title":["Jesus – wenn du Rettung brauchst"],"link":["https://diekreative.org/predigten/2022/20221218_jesus_retter/"],"pubDate":["Sun, 18 Dec 2022 09:30:05 +0000"],"basedate":["221218"],"guid":[{"_":"https://diekreative.org/?p=23359","$":{"ispermalink":"false"}}],"comments":["https://diekreative.org/predigten/2022/20221218_jesus_retter/#respond"],"category":["2022"],"description":["Die frohe Botschaft von Advent und Weihnachten ist: Jesus, der Retter ist gekommen! Diese Botschaft hat nichts von ihrer Aktualität verloren. Christophe nennt etliche Punkte, von was uns Jesus errettet hat und weiter will:\n• von Schmerzen und Krankheit\n• von dämonischen Bindungen\n• von finanzieller Not\n• aus sozialem Status, ausgegrenzt, verachtet zu sein, auch aus eigener Schuld heraus\n• aus Verstrickung von Sünde\n• aus Hoffnungslosigkeit – kann mir vergeben werden?\n• aus Herzenshaltungen von Gier, Sorge, Menschengefälligkeit, Rache und Unvergebenheit\n• aus falschen Bünden, Allianzen, Finsternis, Esoterik, geistl. Lügen … u.v.m.\nWarum ist Jesu Rettung so dringend notwendig? Es gibt einen Feind, der lügt, täuscht, betrügt mit einem einzigen Ziel – zu zerstören, rauben, anzuklagen.\nGenau darum ist Jesus gekommen, um uns von all dem zu retten, zu vergeben, zu befreien! Was ist unser Anteil? Der Kampf im Gebet, kein Aufbruch ohne Gebet! Christophe selbst kam zum Glauben durch das Gebet seiner Mutter. Mit Proklamation und Segnungen endet der Gottesdienst.\nLk 2,10-12| Lk 4 und 5 | Joh 4,11ff | Mt 5-6 | Joh 10,10 | Joh 8,44 | Off 12,10 | 1.Joh 1,9-10 | 2.Kor 10,3-5 | 1.Petr 5,8-9"],"enclosure":[{"$":{"url":"https://diekreative.org/audio/20221218_jesus_retter.mp3","length":"75860861","type":"audio/mpeg"}}],"skript":["https://diekreative.org/audio/20221218_jesus_retter.pdf"],"youtube":[""]},
    {"title":["Gerechtigkeit, Friede und Freude im Heiligen Geist | Königreich Realitäten"],"link":["https://diekreative.org/predigten/2022/gerechtigkeit-friede-und-freude-im-heiligen-geist/"],"pubDate":["Sun, 17 Jul 2022 15:42:41 +0000"],"basedate":["220717"],"guid":[{"_":"https://diekreative.org/?p=22544","$":{"ispermalink":"false"}}],"comments":["https://diekreative.org/predigten/2022/gerechtigkeit-friede-und-freude-im-heiligen-geist/#respond"],"category":["2022"],"description":["Predigt von Marc Andersohn\nPhil 4,4 | Neh 8,10 | Röm 15,13 | Röm 14,17\n[ux_products_list cat=”93″]"],"enclosure":[{"$":{"url":"https://diekreative.org/audio/20220717_friede_und_freude_im_geist.mp3","length":"46650823","type":"audio/mpeg"}}],"skript":["https://diekreative.org/audio/20220717_friede_und_freude_im_geist.pdf"],"youtube":["https://youtu.be/-G3VPfltyiI"]},
    {"title":["Test von Hand"],"link":["https://diekreative.org/termine/"],"pubDate":["Sun, 10 Jul 2022 15:42:41 +0000"],"basedate":["220710"],"guid":[{"_":"-","$":{"ispermalink":"false"}}],"comments":["-"],"category":["2022"],"description":["das ist die Beschreibung..."],"enclosure":[{"$":{"url":"https://diekreative.org/audio/20220717_friede_und_freude_im_geist.mp3","length":"46650823","type":"audio/mpeg"}}],"skript":[""],"youtube":[""]}];
    console.log('von Hand:');
    console.log(test);
    */
    //this.predigten = test;
    //return;
  
  
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

  ngOnInit() {
    //hier bei ngOnInit initial sermonLocalFiles setzen (am besten in userstate service) indem wir local storage auslesen
    //dann arbeiten wir die ganze zeit einfach mit dem sermonLocalFiles im Speicher und erst beim onLeave schreiben wir localStorage zurück!
    console.log('ngInit predigt.element. AppPageMedienInit='+this.userState.AppPageMedienInit);
    console.log('is online? '+this.userState.isOnline);
    this.platform.ready().then(() => {

      if(this.userState.AppPageMedienInit){
        this.userState.AppPageMedienInit = false;
        console.log('Page is now ready. reset AppMageMedienInit');
        let path = this.file.documentsDirectory;
        this.file.checkDir(path, MEDIA_FOLDER_NAME).then(
          () => {
            //this.loadFiles();
          },
          err => {
            this.file.createDir(path, MEDIA_FOLDER_NAME, false);
          }
        );
      }

      //set SermonLocalArray
      /*
      if (this.userState.isOnline) {
        console.log('ngOnInit: set userState.SermonLocalFiles from db');
        this.nativeStorage.getItem('localSermons').then((localSermons)=>{
          //this.userState.SermonLocalFiles = localSermons.sermon;
          this.userState.SermonLocalFiles = [];
          for(var index in localSermons.sermon) {
            this.userState.SermonLocalFiles.push(localSermons.sermon[index]);
          }
          console.log('now userState.SermonLocalFiles=');
          console.log(this.userState.SermonLocalFiles);
        });
      }
      */
      
      console.log('now get feeds either on or offline!');
      if (this.userState.isOnline) {
        this.getRssData();
        this.currentListWasSetByLocalDb = false;
      } else {
        console.log('.... fixed data - offline try..!');
        this.getLocalSermons();
        this.currentListWasSetByLocalDb = true;
        //this.rssData = {"rss":{"$":{"xmlns:itunes":"http://www.itunes.com/dtds/podcast-1.0.dtd","version":"2.0","xmlns:atom":"http://www.w3.org/2005/Atom"},"channel":[{"item":[{"title":["Jesus – wenn du Rettung brauchst"],"link":["https://diekreative.org/predigten/2022/20221218_jesus_retter/"],"pubDate":["221218"],"basedate":["221218"],"guid":[{"_":"https://diekreative.org/?p=23359","$":{"ispermalink":"false"}}],"comments":["https://diekreative.org/predigten/2022/20221218_jesus_retter/#respond"],"category":["2022"],"description":["Die frohe Botschaft von Advent und Weihnachten ist: Jesus, der Retter ist gekommen! Diese Botschaft hat nichts von ihrer Aktualität verloren. Christophe nennt etliche Punkte, von was uns Jesus errettet hat und weiter will:\n• von Schmerzen und Krankheit\n• von dämonischen Bindungen\n• von finanzieller Not\n• aus sozialem Status, ausgegrenzt, verachtet zu sein, auch aus eigener Schuld heraus\n• aus Verstrickung von Sünde\n• aus Hoffnungslosigkeit – kann mir vergeben werden?\n• aus Herzenshaltungen von Gier, Sorge, Menschengefälligkeit, Rache und Unvergebenheit\n• aus falschen Bünden, Allianzen, Finsternis, Esoterik, geistl. Lügen … u.v.m.\nWarum ist Jesu Rettung so dringend notwendig? Es gibt einen Feind, der lügt, täuscht, betrügt mit einem einzigen Ziel – zu zerstören, rauben, anzuklagen.\nGenau darum ist Jesus gekommen, um uns von all dem zu retten, zu vergeben, zu befreien! Was ist unser Anteil? Der Kampf im Gebet, kein Aufbruch ohne Gebet! Christophe selbst kam zum Glauben durch das Gebet seiner Mutter. Mit Proklamation und Segnungen endet der Gottesdienst.\nLk 2,10-12| Lk 4 und 5 | Joh 4,11ff | Mt 5-6 | Joh 10,10 | Joh 8,44 | Off 12,10 | 1.Joh 1,9-10 | 2.Kor 10,3-5 | 1.Petr 5,8-9"],"enclosure":[{"$":{"url":"https://diekreative.org/audio/20221218_jesus_retter.mp3","length":"75860861","type":"audio/mpeg"}}],"skript":["https://diekreative.org/audio/20221218_jesus_retter.pdf"],"youtube":[""]},{"title":["Just Do It | Werner Nachtigal"],"link":["https://diekreative.org/predigten/2022/20221211_just_do_it/"],"pubDate":<Date>["20222-12-18"],"basedate":["221211"],"guid":[{"_":"https://diekreative.org/?p=23316","$":{"ispermalink":"false"}}],"comments":["https://diekreative.org/predigten/2022/20221211_just_do_it/#respond"],"category":["2022"],"description":["Werners Predigt ist ein spannender Bericht aus seinem Leben. Gott berief ihn als Sein Werkzeug, obwohl er sich völlig ungeeignet fühlte. Doch er war Seinem Ruf gehorsam – das wurde sein Lebensmotto: “Just Do It”. Doch hat Gott für jeden seine spezielle Lebensgeschichte, wenn er nur Schritt für Schritt in Seiner Nachfolge bleibt! Werner nennt 3 allgemeingültige Hauptunkte, die für uns alle relevant sind:\n\n* Die erste Berufung ist die in Gottes bzw. Jesu Gegenwart – suche ständig Seine Nähe!\n* Die Berufung zu predigen gilt nicht nur für Prediger – die beste ist durch unseren Alltag, wie unser ‘normales’ Leben Jesus ausstrahlt!\n* Dann haben wir auch die Kraft und Autorität, Seine Werke zu tun – die Menschen brauchen nichts dringender als Ihn!\n\nMk. 3,13-19 | Mt. 24,14 |Joh. 15,16"],"enclosure":[{"$":{"url":"https://diekreative.org/audio/20221211_just_do_it.mp3","length":"79901371","type":"audio/mpeg"}}],"skript":[""],"youtube":[""]},{"title":["Gerechtigkeit, Friede und Freude im Heiligen Geist | Königreich Realitäten"],"link":["https://diekreative.org/predigten/2022/gerechtigkeit-friede-und-freude-im-heiligen-geist/"],"pubDate":"Sun, 17 Jul 2022 15:42:41 +0000".toLocaleString,"basedate":["220717"],"guid":[{"_":"https://diekreative.org/?p=22544","$":{"ispermalink":"false"}}],"comments":["https://diekreative.org/predigten/2022/gerechtigkeit-friede-und-freude-im-heiligen-geist/#respond"],"category":["2022"],"description":["Predigt von Marc Andersohn\nPhil 4,4 | Neh 8,10 | Röm 15,13 | Röm 14,17\n[ux_products_list cat=”93″]"],"enclosure":[{"$":{"url":"https://diekreative.org/audio/20220717_friede_und_freude_im_geist.mp3","length":"46650823","type":"audio/mpeg"}}],"skript":["https://diekreative.org/audio/20220717_friede_und_freude_im_geist.pdf"],"youtube":["https://youtu.be/-G3VPfltyiI"]}]}]}};
        //this.predigten = this.rssData.rss.channel[0].item;
      }
    });
  }

  //read files in local storage
  /*
  loadFiles() {
    console.log('====> lade local files in array');
    
    this.file.listDir(this.file.documentsDirectory, MEDIA_FOLDER_NAME).then(
      res => {
        this.userState.SermonLocalFiles = res;
        //this.localFiles = res;
        console.log('local files='+JSON.stringify(this.userState.SermonLocalFiles));
      },
      err => console.log('error loading files: ', err)
    );
  }
  */
  

  getRssData() {
    this.rssData = this.feedservice.RssData;
    this.predigten = this.rssData.rss.channel[0].item;
    console.log('initial getRss -> predigten: =====>');
    console.log(JSON.stringify(this.predigten));
  }

  async doRefresh(event) {
    if (event) {
      if (this.userState.isOnline) {
        console.log('re-read feeds');
        window.location.reload();

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

        console.log('nu?');
        console.log(this.predigten);

        //check files already downloaded - TODO: better solve otherwise
        //this.loadFiles();
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


  ionViewWillLeave() {
    console.log('ionViewWillLeave -> save local Sermons..');  // <- In console when leaving
    this.userState.saveLocalSermons();
  }
  

}
