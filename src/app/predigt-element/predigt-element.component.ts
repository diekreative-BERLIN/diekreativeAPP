import { Component, Input } from '@angular/core';
import { NewsRss } from '../communications/news-rss';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
// add File
import { File, FileEntry } from '@ionic-native/File/ngx';
import { FileTransfer, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';

import { UserstateService } from '../userstate.service';
//import { runInThisContext } from 'vm';
import { WebView } from '@awesome-cordova-plugins/ionic-webview/ngx';

const MEDIA_FOLDER_NAME = 'temp_files';

@Component({
  selector: 'app-predigt-element',
  templateUrl: './predigt-element.component.html',
  styleUrls: ['./predigt-element.component.scss'],
})
export class PredigtElementComponent {
  rssData:NewsRss;
  fulltext = false;
  playervisible = false;
  @Input() predigt;
  //localFiles = [];
  currentSermonURL: any;
  //here creating object to access file transfer object.  
  private fileTransfer: FileTransferObject; 

  constructor(
    public userState:UserstateService,
    private socialSharing: SocialSharing,
    private platform: Platform,
    private router: Router,
    private iab: InAppBrowser,
    private file: File,
    private transfer: FileTransfer,
    private webview: WebView
  ) {
    //this.platform.backButton.subscribeWithPriority(10, () => {
    //  this.router.navigate(["/tabs/tab1"]);
    //});
  }

  //ngAfterViewChecked(): void {
    //if(this.userState.AppPageMedienInit){
      //this.userState.AppPageMedienInit = false;
    //}
  //}


  isLocal(mp3file,getpath=false) {

   let fileName = mp3file.substr(mp3file.lastIndexOf('/') + 1);
   /*
   console.log('check if file '+fileName+' is local');
   console.log('finde in ');
   console.log(this.userState.SermonLocalFiles);
   */
   let res = this.userState.SermonLocalFiles.find(e => e.name === fileName);

    if (res !== undefined) {
      //console.log(res.isFile);
      if (getpath) {
        return this.file.dataDirectory + MEDIA_FOLDER_NAME + res.fullPath;
        //nativeURL;
      } else {
        return res.isFile;
      }
    } else {
      //console.log('not found');
      return false;
    }

  }


  expandTab(){
    this.fulltext = true;
  }

  closeTab(){
    this.fulltext = false;
    this.playervisible = false;
  }

  toggleTab(){
    if(this.fulltext){
      this.fulltext=false;
    }else{
      this.fulltext=true;
    }
  }


  openPlayer(sermonURL){
    this.playervisible = true;
    let fileresult = this.isLocal(sermonURL,true);
    if(fileresult) {
      console.log('currentSermonURL aus isLocal auslesen:'+fileresult);

      
      //this.currentSermonURL = "file:///Users/marc/Library/Developer/CoreSimulator/Devices/43A15CDA-6549-4C50-8BB9-5282AAD8F975/data/Containers/Data/Application/4DA84282-1F05-4C93-BAFB-56C1F2199354/Library/NoCloud/temp_files/20221204_vorbereitet_ewigkeit.mp3";
      //this.currentSermonURL = "file://Users/marc/Library/Developer/CoreSimulator/Devices/43A15CDA-6549-4C50-8BB9-5282AAD8F975/data/Containers/Data/Application/4DA84282-1F05-4C93-BAFB-56C1F2199354/Library/NoCloud/temp_files/20221204_vorbereitet_ewigkeit.mp3";
      //this.currentSermonURL = "/Users/marc/Library/Developer/CoreSimulator/Devices/43A15CDA-6549-4C50-8BB9-5282AAD8F975/data/Containers/Data/Application/4DA84282-1F05-4C93-BAFB-56C1F2199354/Library/NoCloud/temp_files/20221204_vorbereitet_ewigkeit.mp3";
      //this.currentSermonURL = "/temp_files/20221204_vorbereitet_ewigkeit.mp3";


      this.currentSermonURL = this.webview.convertFileSrc("file:///Users/marc/Library/Developer/CoreSimulator/Devices/43A15CDA-6549-4C50-8BB9-5282AAD8F975/data/Containers/Data/Application/4DA84282-1F05-4C93-BAFB-56C1F2199354/Library/NoCloud/temp_files/20221204_vorbereitet_ewigkeit.mp3");
      console.log('converted: '+this.currentSermonURL);
      //this.currentSermonURL = fileresult;
    } else {
      console.log('currentSermonURL aus original URL: '+sermonURL);
      this.currentSermonURL = sermonURL;
    }
  }

  closePlayer(){
    this.playervisible = false;
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
//    console.log('share subject='+subject+'  url='+predigturl+'   und msg='+message);
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
    let fileresult = this.isLocal(mp3link);
    //here encoding path as encodeURI() format.  
    let url = encodeURI(mp3link);
    let fileName = mp3link.substr(mp3link.lastIndexOf('/') + 1);
    console.log('sichere Predigt Datei '+fileName+' von '+mp3link);
    //here initializing object. 
    this.fileTransfer = this.transfer.create();  
    // here iam mentioned this line this.file.externalRootDirectory is a native pre-defined file path storage. You can change a file path whatever pre-defined method.  
    this.fileTransfer.download(url, this.file.dataDirectory + MEDIA_FOLDER_NAME + '/' + fileName, true).then((entry) => {  
        //here logging our success downloaded file path in mobile.  
        console.log('download completed: ' + entry.toURL());  
    }, (error) => {  
        //here logging our error its easier to find out what type of error occured.  
        console.log('download failed: ' + error);  
    });  
  }
  freeUpSermon(mp3name) {
    console.log('remove '+mp3name);
  }


}
