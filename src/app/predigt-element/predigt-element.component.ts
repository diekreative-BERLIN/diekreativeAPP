import { Component, Input } from '@angular/core';
//import { NewsRss } from '../communications/news-rss';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
// add File
import { File } from '@ionic-native/File/ngx';
import { FileTransfer, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';

import { UserstateService } from '../userstate.service';
//import { runInThisContext } from 'vm';
import { WebView } from '@awesome-cordova-plugins/ionic-webview/ngx';
//Media Player
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { NgZone } from '@angular/core';

//modal popover
import { PopoverController } from '@ionic/angular';
import { SermonplayerPage } from '../sermonplayer/sermonplayer.page';

//File Opener
import { FileOpener } from '@ionic-native/file-opener/ngx';

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
  private fileTransfer: FileTransferObject;
  local_or_online = true;
  download_in_progress = false;

  constructor(
    public userState:UserstateService,
    private socialSharing: SocialSharing,
    private platform: Platform,
    private router: Router,
    private iab: InAppBrowser,
    private file: File,
    private transfer: FileTransfer,
    private webview: WebView,
    private popover: PopoverController,
    private _zone: NgZone,
    private fileOpener: FileOpener
  ) {
    //this.platform.backButton.subscribeWithPriority(10, () => {
    //  this.router.navigate(["/tabs/tab1"]);
    //});
  }

  //check if a sermon is saved locally
  first_set_local_or_online(sermonURL) {
    if (this.download_in_progress) {return true}
    //console.log('first set local-or-online for '+sermonURL);
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
  popoverPlay(sermonTitle,sermonURL) {
    this.popover.create({component:SermonplayerPage,
      componentProps: {
        sermonTitle: sermonTitle,
        sermonURL: sermonURL
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
    if (this.userState.isFileInArray(mp3file) > -1) {
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
  openPlayer(sermonTitle,sermonURL){
    let sermonFile = sermonURL;
    if (this.sermonlocal) {
      let fileName = sermonURL.substr(sermonURL.lastIndexOf('/') + 1);
      sermonFile = this.file.documentsDirectory + MEDIA_FOLDER_NAME + '/' + fileName;
    } else {
      //let sermonFile = sermonURL;
    }
    
    this.popoverPlay(sermonTitle,sermonFile);
  }


  //social sharing of current sermon
  shareLink(predigturl,titel,excerpt){
    var message = "Hör dir diese Predigt an!\n\n"+excerpt
    var subject = ""+titel
    var url = ""+predigturl
    var options = {
      message:message,
      subject:subject,
      url:url

    }
    this.socialSharing.shareWithOptions(options);
    console.log('share subject='+subject+'  url='+predigturl+'   und msg='+message);
  }

  //display Skript with fileopener
  public showLocalScript(skript) {
    this.fileOpener
        .open(skript, "application/pdf")
        .then(() => console.log("File is opened"))
        .catch(e => console.log("Error opening file", e));
  }
  //open pdf skript either with fileopener (if pdf is local) or with InAppBrowser (online)
  openSkript(skript){
    if (skript!='') {
      this.platform.ready().then(() => {
        if (this.sermonlocal) {
          skript = this.file.documentsDirectory + MEDIA_FOLDER_NAME + '/' + skript.split('/').pop();
          console.log('open pdf: '+skript);
          this.showLocalScript( skript );
        } else {
          console.log('open pdf: '+skript);
          this.iab.create(skript,'_system');
        }
      });
    }
  }

  //open YT Player
  playYT(YTlink){
    if (YTlink!='') {
      this.platform.ready().then(() => {
        this.iab.create(YTlink,'_system');
      });
    }
  }

  saveSermon(mp3link,skript) {
    let url = encodeURI(mp3link);
    let fileName = mp3link.substr(mp3link.lastIndexOf('/') + 1);
    console.log('sichere Predigt Datei '+fileName+' von '+mp3link+' und skript '+skript);

    this.download_in_progress = true;
    //here initializing object
    if (skript != "") {
      this.fileTransfer = this.transfer.create();
      this.fileTransfer.download(encodeURI(skript), this.file.documentsDirectory + MEDIA_FOLDER_NAME + '/' + skript.split('/').pop(), true).then((entry) => {
        console.log('skript downloaded!: ' + entry.toURL());
      }, (error) => {  
        //here logging our error its easier to find out what type of error occured.  
        console.log('download failed: ' + error);  
      });
    }

    //here initializing object
    this.fileTransfer = this.transfer.create();
    this.fileTransfer.onProgress((progressEvent) => {
      this._zone.run(() =>{
        var perc = (progressEvent.lengthComputable) ?  Math.floor(progressEvent.loaded / progressEvent.total * 100) : -1;
        //console.log(progressEvent,'%',perc);
        this.progress = perc;
      });
    });  

    this.fileTransfer.download(url, this.file.documentsDirectory + MEDIA_FOLDER_NAME + '/' + fileName, true).then((entry) => {
        //here logging our success downloaded file path in mobile.  
        console.log('download completed: ' + entry.toURL());
        this.download_in_progress = false;
        //window.location.reload(); //refresh view
        this.sermonlocal = true;
        //console.log('predigt Info vorhanden..:');
        //console.log(this.predigt);
        this.addEpisode2localDB(this.predigt);
        //this.userState.saveLocalSermons(this.predigt);
        this.userState.saveLocalSermons();
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
      this.file.removeFile(this.file.documentsDirectory + MEDIA_FOLDER_NAME, skript.split('/').pop()).then((ret) => {
        console.log('skript deleted?');
        console.log(ret);
      }, (error) => {
        console.log('error deleting: '+error);
      });
    }

    this.file.removeFile(this.file.documentsDirectory + MEDIA_FOLDER_NAME, fname).then((ret) => {
      console.log('file '+this.file.documentsDirectory + MEDIA_FOLDER_NAME, fname+' deleted?');
      console.log(ret);
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
