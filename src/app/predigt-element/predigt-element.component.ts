import { Component, OnInit, Input } from '@angular/core';
import { NewsRss } from '../communications/news-rss';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
// add File
import { File, FileEntry } from '@ionic-native/File/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';

import { UserstateService } from '../userstate.service';
//import {  AfterViewChecked } from '@angular/core';

const MEDIA_FOLDER_NAME = 'temp_files';

@Component({
  selector: 'app-predigt-element',
  templateUrl: './predigt-element.component.html',
  styleUrls: ['./predigt-element.component.scss'],
})
export class PredigtElementComponent implements OnInit {
  rssData:NewsRss;
  fulltext = false;
  playervisible = false;
  @Input() predigt;
  localFiles = [];
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
    private transfer: FileTransfer
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

  //with initialization check if DIR exists and then load files. If not, create DIR.
  ngOnInit() {
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
    this.file.listDir(this.file.dataDirectory, MEDIA_FOLDER_NAME).then(
      res => {
        this.localFiles = res;
        console.log('local files='+JSON.stringify(this.localFiles));
      },
      err => console.log('error loading files: ', err)
    );
  }

  isLocal(mp3file) {
   // this.localFiles.find();
   //let fileName = '/' + MEDIA_FOLDER_NAME + '/' + mp3file.substr(mp3file.lastIndexOf('/') + 1);
   //console.log('check if file '+fileName+' is local');

   let fileName = mp3file.substr(mp3file.lastIndexOf('/') + 1);
   console.log('check if file '+fileName+' is local');

   return this.localFiles.find(e => e.name === fileName);
  }


  expandTab(){
    this.fulltext = true;
  }

  closeTab(){
    this.fulltext = false;
    this.playervisible = false;
  }

  toggleTab(){
    this.fulltext = !this.fulltext;
  }



//  {"isFile":true,"isDirectory":false,"name":"20201220_von_guten_maechten.mp3","fullPath":"/temp_files/20201220_von_guten_maechten.mp3","filesystem":"<FileSystem: library-nosync>","nativeURL":"file:///Users/marc/Library/Developer/CoreSimulator/Devices/A8AD7578-C472-4367-9830-2817C7DD1A8C/data/Containers/Data/Application/8F85850F-B8E6-4625-978C-5ECD3903D42F/Library/NoCloud/temp_files/20201220_von_guten_maechten.mp3"}
//2021-01-04 18:39:21.529492+0100 diekreative APP[17219:6452015] Login With token{"status":200,"data":"{\"status\":\"success\",\"data\":\"Already logged in\"}","headers":{"content-type":"application/json","access-control-allow-origin":"http://localhost:8100","pragma":"no-cache","content-security-policy":"default-src 'self'; script-src 'self' js.stripe.com 'unsafe-eval' ; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src * data: blob *.church.tools; child-src * data; connect-src *; object-src 'self' www.youtube.com","x-powered-by":"PHP/7.3.25","age":"0","server":"Apache","access-control-allow-methods":"POST, GET, OPTIONS, PUT, DELETE","content-encoding":"gzip","expires":"Thu, 19 Nov 1981 08:52:00 GMT","access-control-allow-headers":"Content-Type, csrf-token","via":"1.1 varnish (Varnish/6.5)","cache-control":"no-store, no-cache, must-revalidate","date":"Mon, 04 Jan 2021 17:39:21 GMT","access-control-allow-credentials":"true","content-length":"66","accept-ranges":"bytes","vary":"Accept-Encoding","x-varnish":"907510684"},"url":"https://diekreative.org/churchtools/index.php?q=login/ajax&func=loginWithToken&q=login/ajax&token=nHh0hf3qDmkR7gerTiTFOrwkOWiDsOja6FiAC88w4625xSu8jWeJwSDRWiHikhqVI0NmG8DMQPBDyd4zqkNJC5KSBkOTmVWmYo3oLKC3wSBqGpe1Yjp9aPVXZ2YlazVqrGW4a26X7F5guj3kdjI1kc7IETNRLJdRHx5x6yPxCjdCgjzMqb76uvgkaELopGdbowfOhTy4JNdUajytsWe6AlrVQxKVSuh4vNG6avDDVVo6pHs1X6bIzYhjmKXeGTjQ&id=2"}
//2021-01-04 18:39:21.530248+0100 diekreative APP[17219:6452015] login status=success
//console.log("Login With token"+JSON.stringify(res));
//console.log("login status="+ (JSON.parse(res.data)).status)
// if((JSON.parse(res.data)).status=="fail")..


  openPlayer(sermonURL){
    this.playervisible = true;
    let fileresult = this.isLocal(sermonURL);
    if(fileresult) {
      console.log('currentSermonURL aus isLocal auslesen:'+JSON.stringify(fileresult));
      console.log('Test1:');
      //console.log( JSON.parse(fileresult.fullPath) );
      console.log('Test2:');
      //console.log( JSON.parse(fileresult).fullPath );
      console.log('Test3:');
      console.log( JSON.parse(JSON.stringify(fileresult)).fullPath );



      this.currentSermonURL = JSON.parse(JSON.stringify(fileresult)).fullPath;
    } else {
      console.log('currentSermonURL aus original URL');
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


}
