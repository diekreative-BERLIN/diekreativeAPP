import { Component, Input } from '@angular/core';
//import { NewsRss } from '../communications/news-rss';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
// add File

import { UserstateService } from '../userstate.service';
//import { runInThisContext } from 'vm';
import { NgZone } from '@angular/core';

//modal popover
import { PopoverController } from '@ionic/angular';
import { SermonplayerPage } from '../sermonplayer/sermonplayer.page';

import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { FileOpener } from '@capacitor-community/file-opener';
import { DefaultSystemBrowserOptions, InAppBrowser } from '@capacitor/inappbrowser';
import { Capacitor } from '@capacitor/core';

const MEDIA_FOLDER_NAME = 'temp_files';

@Component({
  selector: 'app-predigt-element',
  templateUrl: './predigt-element.component.html',
  styleUrls: ['./predigt-element.component.scss'],
})
export class PredigtElementComponent {
  //rssData:NewsRss;
  fulltext = false;
  sermonlocal = false;
  @Input() predigt;
  //localFiles = [];
  //currentSermonURL: any;
  progress = -1;
  //here creating object to access file transfer object.  
  local_or_online = true;
  download_in_progress = false;

  constructor(
    public userState:UserstateService,
    private platform: Platform,
    private router: Router,
    private popover: PopoverController,
    private _zone: NgZone,
  ) { }

  //check if a sermon is saved locally
  first_set_local_or_online(sermonURL) {
    if (this.download_in_progress) {return true}
    if ( this.isLocal(sermonURL) ) {
      this.sermonlocal = true;
    }

    if (this.sermonlocal || this.userState.isOnline) {
      this.local_or_online=true;
      return true;
    } else {
      this.local_or_online=false;
      return false;
    }
  }


  //start modal player
  popoverPlay(sermonTitle,sermonURL, sermonFile?) {
    this.popover.create({component:SermonplayerPage,
      componentProps: {
        sermonTitle: sermonTitle,
        sermonURL: sermonURL,
        sermonFile: sermonFile
      },
      cssClass: 'modal_sermonplayer',
      backdropDismiss: false,
      showBackdrop: false}).then((popoverElement)=>{
        popoverElement.onDidDismiss().then((ret)=>{
          console.log(JSON.parse(JSON.stringify(ret)).data );
          if(JSON.parse( JSON.stringify(ret) ).data == "close" ) {
            console.log("Player geschlossen");
          }
        });
        popoverElement.present();
      })
  }


  //check if mp3 file is in localDB
  isLocal(mp3file) {
    if (typeof this.userState.isFileInArray(mp3file) == "string") {
      return true;
    } else {
      return false;
    }
  }

  expandTab(){
    this.fulltext = true;
  }

  closeTab(){
    this.fulltext = false;
  }

  toggleTab(){
    if(this.fulltext){
      this.fulltext=false;
    }else{
      this.fulltext=true;
    }
  }

  //Open mp3 file (local or online) in sermon player
  async openPlayer(sermonTitle,sermonURL){
    console.log('openPlayer: '+sermonURL, this.sermonlocal);
    if (this.sermonlocal) {
      let fileName = sermonURL.substr(sermonURL.lastIndexOf('/') + 1);
      const sermonFile = sermonURL;
      let sermonFileURL = Capacitor.convertFileSrc((await Filesystem.getUri({directory: Directory.Data, path: MEDIA_FOLDER_NAME + '/' + fileName})).uri);
      console.log('sermon file: '+sermonFile);
      console.log('sermon FileURL: '+sermonFileURL);
      this.popoverPlay(sermonTitle,sermonFileURL,sermonFile);
    } else {
      //let sermonFile = sermonURL;
      this.popoverPlay(sermonTitle,sermonURL);
    }
  }


  //social sharing of current sermon
  async shareLink(predigturl,titel,excerpt){
    var message = "Hör dir diese Predigt an!\n\n"+excerpt
    var subject = ""+titel
    var url = ""+predigturl
    var options = {
      message:message,
      subject:subject,
      url:url
    }
    await Share.share(options);
    console.log('share subject='+subject+'  url='+predigturl+'   und msg='+message);
  }

  //display Skript with fileopener
  public async showLocalScript(skript) {
    await FileOpener
        .open({filePath:skript,
               contentType: "application/pdf"})
        .then(() => console.log("File is opened"))
        .catch(e => console.log("Error opening file", e));
  }

  //open pdf skript either with fileopener (if pdf is local) or with InAppBrowser (online)
  openSkript(skript){
    if (skript!='') {
      this.platform.ready().then(async () => {
        if (this.sermonlocal) {
          skript = await Filesystem.getUri({directory: Directory.Data, path: MEDIA_FOLDER_NAME + '/' + skript.split('/').pop()});
          console.log('open pdf: ',skript);
          await this.showLocalScript(skript.uri); 
        } else {
          console.log('open pdf: ',skript);
          await InAppBrowser.openInSystemBrowser({url:skript,options:DefaultSystemBrowserOptions});
        }
      });
    }
  }

  //open YT Player
  playYT(YTlink){
    if (YTlink!='') {
      this.platform.ready().then(async () => {
        await InAppBrowser.openInSystemBrowser({url:YTlink,options:DefaultSystemBrowserOptions});
      });
    }
  }

  async saveSermon(mp3link,skript) {
    let url = encodeURI(mp3link);
    let fileName = mp3link.substr(mp3link.lastIndexOf('/') + 1);
    //console.log('sichere Predigt Datei '+fileName+' von '+mp3link+' und skript '+skript);
    //20230521 fuer Android dataDirectory statt documentsDirectory (ergibt null)

    this.download_in_progress = true;

    //lege eine leere Datei an - durch recursive 'true' wird das Verzeichnis erstellt
    const file = await Filesystem.writeFile({
      path: MEDIA_FOLDER_NAME + '/' + fileName,
      data: 'init',
      directory: Directory.Data,
      recursive: true
    })

    if (skript != "") {
      await Filesystem.downloadFile({
        url: skript,
        directory: Directory.Data, 
        path: MEDIA_FOLDER_NAME + '/' + skript.split('/').pop()}
      ).then((entry) => {
        console.log('skript downloaded!: ' + entry.path);
      }, (error) => {  
        //here logging our error its easier to find out what type of error occured.  
        console.log('download failed: ' + error);  
      });
    }
    //here initializing object

    const listener = await Filesystem.addListener('progress',(progressEvent) => {
        this._zone.run(() => {
          var perc = (progressEvent.contentLength) ?  Math.floor(progressEvent.bytes / progressEvent.contentLength * 100) : -1;
          this.progress = perc;
        });
      });
  

    await Filesystem.downloadFile({
      url: url,
      directory: Directory.Data,
      path: MEDIA_FOLDER_NAME + '/' + fileName,
      progress: true
    }).then(async (entry) => {
        listener.remove();
        //here logging our success downloaded file path in mobile.  
        this.progress = -1;
        this.download_in_progress = false;
        //window.location.reload(); //refresh view
        this.sermonlocal = true;
        this.predigt.enclosure[0].$.url = entry.path;
        //console.log('predigt Info vorhanden..:');
        //console.log(this.predigt);
        this.addEpisode2localDB(this.predigt);
        //this.userState.saveLocalSermons(this.predigt);
        await this.userState.saveLocalSermons();
    }, (error) => {  
        //here logging our error its easier to find out what type of error occured.  
        console.log('download failed: ' + error);  
    });
  }

  //delete Sermon from filesystem and from localFiles Array
  freeUpSermon(mp3name,skript) {
    let fname = mp3name.split('/').pop();
    console.log('remove '+fname+'  (mp3name='+mp3name+')');

    if (skript != "") {
      Filesystem.deleteFile({
        directory: Directory.Data,
        path: MEDIA_FOLDER_NAME + '/' + skript.split('/').pop()
      }).then(() => {
        console.log('skript deleted?');
      }, (error) => {
        console.log('error deleting: '+error);
      });
    }

    Filesystem.deleteFile({
      directory: Directory.Data,
      path: MEDIA_FOLDER_NAME + '/' + fname
    }).then(() => {
      console.log('file ' + MEDIA_FOLDER_NAME, fname+' deleted?');
      this.sermonlocal = false;
      //
      this.userState.removeLocalSermon(mp3name);
      //
      this.userState.saveLocalSermons();
    }, (error) => {
      console.log('error deleting: '+error);
    });
  }

  //add a new episode to local db
  addEpisode2localDB(predigt) {
    //console.log('add episode to local DB');
    //console.log(predigt);
    this.userState.addLocalSermon(predigt);
  }

}
