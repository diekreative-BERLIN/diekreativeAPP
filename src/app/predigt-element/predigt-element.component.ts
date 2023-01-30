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
    private _zone: NgZone
  ) {
    //this.platform.backButton.subscribeWithPriority(10, () => {
    //  this.router.navigate(["/tabs/tab1"]);
    //});
  }

  first_set_local_or_online(sermonURL) {
    console.log('first set local-or-online for '+sermonURL);
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
  //can this episode be accessed because we're either online or it has been downloaded before?
  /*
  public local_or_online() {
    //console.log('is local? '+this.sermonlocal+'  isonline? '+this.userState.isOnline);
    if (this.sermonlocal || this.userState.isOnline) {
      return true;
    } else {
      return false;
    }
  }
  */


  popoverPlay(sermonTitle,sermonURL) {
    this.popover.create({component:SermonplayerPage,
      componentProps: {
        sermonTitle: sermonTitle,
        sermonURL: sermonURL
      },
      cssClass: 'modal_tun_confirm',
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
    return false;
   let fileName = mp3file.substr(mp3file.lastIndexOf('/') + 1);
   
   console.log('check if file '+fileName+' is local');
   console.log('finde in ');
   console.log(this.userState.SermonLocalFiles);
return false; //todo
   /*
   //let res = this.userState.SermonLocalFiles.find(e => e.name === fileName);
   let res = this.userState.SermonLocalFiles.find( e => e.enclosure[0].$.url == mp3file );
   console.log('res=');
   console.log(res);

    if (res !== undefined) {
      //console.log(res.isFile);
      
      return true;
      //res.isFile;
      
    } else {
      console.log('not found');
      return false;
    }
    */
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

  openPlayer(sermonTitle,sermonURL){
    let sermonFile;
    if (this.sermonlocal) {
      let fileName = sermonURL.substr(sermonURL.lastIndexOf('/') + 1);
      let sermonFile = this.file.documentsDirectory + MEDIA_FOLDER_NAME + '/' + fileName;
    } else {
      let sermonFile = sermonURL;
    }
    
    this.popoverPlay(sermonTitle,sermonFile);
  }



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

  openSkript(skript){
    if (skript!='') {
      this.platform.ready().then(() => {
        this.iab.create(skript,'_system');
      });
    }
  }

  playYT(YTlink){
    if (YTlink!='') {
      this.platform.ready().then(() => {
        this.iab.create(YTlink,'_system');
      });
    }
  }

  saveSermon(mp3link) {
    //is file already there?
    //let fileresult = this.isLocal(mp3link);
    //here encoding path as encodeURI() format.  
    let url = encodeURI(mp3link);
    let fileName = mp3link.substr(mp3link.lastIndexOf('/') + 1);
    console.log('sichere Predigt Datei '+fileName+' von '+mp3link);

    //console.log('this.predigt = ');
    //console.log( JSON.stringify(this.predigt) );

    this.addEpisode2localDB( this.predigt );

/*
    //here initializing object. 
    this.fileTransfer = this.transfer.create();
    this.fileTransfer.onProgress((progressEvent) => {
      this._zone.run(() =>{
        var perc = (progressEvent.lengthComputable) ?  Math.floor(progressEvent.loaded / progressEvent.total * 100) : -1;
        console.log(progressEvent,'%',perc);
        this.progress = perc;
      });
    });  

    this.fileTransfer.download(url, this.file.documentsDirectory + MEDIA_FOLDER_NAME + '/' + fileName, true).then((entry) => {
        //here logging our success downloaded file path in mobile.  
        console.log('download completed: ' + entry.toURL());
        //window.location.reload(); //refresh view
        this.sermonlocal = true;
        //console.log('predigt Info vorhanden..:');
        //console.log(this.predigt);
        this.addEpisode2localDB(this.predigt);
        //this.userState.saveLocalSermons(this.predigt);
    }, (error) => {  
        //here logging our error its easier to find out what type of error occured.  
        console.log('download failed: ' + error);  
    });
*/
  }

  freeUpSermon(mp3name) {
    let fname = mp3name.split('/').pop();
    console.log('remove '+fname);
    this.file.removeFile(this.file.documentsDirectory + MEDIA_FOLDER_NAME, fname).then((ret) => {
      console.log('file deleted?');
      console.log(ret);
      this.sermonlocal = false;
    }, (error) => {
      console.log('error deleting: '+error);
    });
    //window.location.reload(); //refresh view
  }

  //add a new episode to local db
  addEpisode2localDB(predigt) {
    console.log('add episode to local DB');
    console.log(predigt);
    this.userState.addLocalSermon(predigt);
    /*
    this.userState.SermonLocalFiles.push(predigt);
    console.log('now we have ');
    console.log(this.userState.SermonLocalFiles);
    console.log('dont forget to save');
    this.userState.saveLocalSermons(this.userState.SermonLocalFiles);
    */
  }

}
