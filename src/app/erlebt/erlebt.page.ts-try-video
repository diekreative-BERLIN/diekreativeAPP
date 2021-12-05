//this tab is a combination from the following tutorials
// https://github.com/nosz/angular-ionic-cordova-capture-and-sharing-image-audio-video
// https://devdactic.com/ionic-4-media-files-guide/

import { Component, OnInit } from '@angular/core';
import { ActionSheetController, Platform } from '@ionic/angular';

// add MediaCapture
import { MediaCapture, MediaFile } from '@ionic-native/media-capture/ngx';
// streaming media
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media/ngx';
// add SocialSharing
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { CaptureError } from '@ionic-native/media-capture/ngx';
// add File
import { File, FileEntry } from '@ionic-native/File/ngx';

const MEDIA_FOLDER_NAME = 'temp_files';

@Component({
  selector: 'app-erlebt',
  templateUrl: './erlebt.page.html',
  styleUrls: ['./erlebt.page.scss'],
})
export class ErlebtPage implements OnInit {

  files = [];
  shareVideo;

  //private streamingMedia: StreamingMedia ..das geht nicht..
  constructor(
    private file: File,
    private mediaCapture: MediaCapture,
    private streamingMedia: StreamingMedia,
    private socialSharing: SocialSharing,
    private actionSheetController: ActionSheetController,
    private plt: Platform
  ) {}

  ngOnInit() {
    this.plt.ready().then(() => {
      let path = this.file.dataDirectory;
      this.file.checkDir(path, MEDIA_FOLDER_NAME).then(
        () => {
          this.loadFiles();
        },
        err => {
          this.file.createDir(path, MEDIA_FOLDER_NAME, false);
        }
      );
    });
  }
 
  loadFiles() {
    this.file.listDir(this.file.dataDirectory, MEDIA_FOLDER_NAME).then(
      res => {
        this.files = res;
      },
      err => console.log('error loading files: ', err)
    );
  }

  // add function ShareMedia
  ShareMedia(message, subject, filepath, url) {
    var options = {
      message:message,
      subject:subject,
      filepath:filepath,
      url:url

    }
    this.socialSharing.shareWithOptions(options);
    console.log('share subject='+subject+'  filepath='+filepath+'   und msg='+message);
  }

  // add function CaptureAndShareVideo()
  CaptureAndShareVideo() {
    this.mediaCapture.captureVideo().then(
      (video: MediaFile[]) => {
        if (video.length > 0) {
          this.copyFileToLocalDir(video[0].fullPath);
        
          this.ShareMedia(
            'video file capture by media capture plugin',
            'media capture',
            this.shareVideo,
            ''
          );
        }
      },
      err => {
        alert(JSON.stringify(err));
      }
    );
  }


  async selectMedia() {
    const actionSheet = await this.actionSheetController.create({
      header: 'What would you like to add?',
      buttons: [
        {
          text: 'Capture Image',
          handler: () => {
            //this.captureImage();
          }
        },
        {
          text: 'Record Video',
          handler: () => {
            this.recordVideo();
          }
        },
        {
          text: 'Record Audio',
          handler: () => {
            //this.recordAudio();
          }
        },
        {
          text: 'Load multiple',
          handler: () => {
            //this.pickImages();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  recordVideo() {
    this.mediaCapture.captureVideo().then(
      (data: MediaFile[]) => {
        if (data.length > 0) {
          this.copyFileToLocalDir(data[0].fullPath);
        }
      },
      (err: CaptureError) => console.error(err)
    );
  }
 
  copyFileToLocalDir(fullPath) {
    let myPath = fullPath;
    // Make sure we copy from the right location
    if (fullPath.indexOf('file://') < 0) {
      myPath = 'file://' + fullPath;
    }
 
    const ext = myPath.split('.').pop();
    const d = Date.now();
    const newName = `${d}.${ext}`;
 
    const name = myPath.substr(myPath.lastIndexOf('/') + 1);
    const copyFrom = myPath.substr(0, myPath.lastIndexOf('/') + 1);
    const copyTo = this.file.dataDirectory + MEDIA_FOLDER_NAME;
 
    this.file.copyFile(copyFrom, name, copyTo, newName).then(
      success => {
        this.loadFiles();
        this.shareVideo = copyTo + '/' + newName;
      },
      error => {
        console.log('error: ', error);
      }
    );
  }
 
  openFile(f: FileEntry) {
    if (f.name.indexOf('.MOV') > -1 || f.name.indexOf('.mp4') > -1) {
      // E.g: Use the Streaming Media plugin to play a video
      //this.streamingMedia.playVideo(f.nativeURL);
      console.log('sollte Video spielen: '+f.nativeURL+'  aber das geht nicht mit StreamingMedia..');

      //let options: StreamingVideoOptions = {
      //  successCallback: () => { console.log('Video played') },
      //  errorCallback: (e) => { console.log('Error streaming') },
      //  orientation: 'landscape',
      //  shouldAutoClose: true,
      //  controls: false
      //};

      this.streamingMedia.playVideo(f.nativeURL);
      //                                       ,options


    }
  }
 
  deleteFile(f: FileEntry) {
    const path = f.nativeURL.substr(0, f.nativeURL.lastIndexOf('/') + 1);
    this.file.removeFile(path, f.name).then(() => {
      this.loadFiles();
    }, err => console.log('error remove: ', err));
  }

  sendVideo(f: FileEntry) {
    const path = f.nativeURL.substr(0, f.nativeURL.lastIndexOf('/') + 1);

    this.ShareMedia(
      'video file capture by media capture plugin',
      'media capture',
      f.fullPath,
      ''
    );
    
  }


}
