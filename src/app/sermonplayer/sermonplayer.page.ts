import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

import {PopoverController} from '@ionic/angular';
import { AudioService } from './audio.service';
//import { Directory, Filesystem } from '@capacitor/filesystem';
//import { Capacitor } from '@capacitor/core';
//import { MediaSession } from '@jofr/capacitor-media-session'

@Component({
  selector: 'app-sermonplayer',
  templateUrl: './sermonplayer.page.html',
  styleUrls: ['./sermonplayer.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SermonplayerPage implements OnInit {


// updateTime() {
//   this.current = this.audio.currentTime ;
// }

  sermonTitle;
  sermonURL;
  sermonImageURL;
  sermonFile;
  
  current: number = 0;
  
  @ViewChild('audioRef', { static: false }) audioRef!: ElementRef<HTMLAudioElement>;
  audio: HTMLAudioElement = new Audio();

  @ViewChild('metaaudioRef', { static: false }) metaaudioRef!: ElementRef<HTMLAudioElement>;
  metaaudio: HTMLAudioElement = new Audio();


  isLoaded= false;

  constructor(
    private popover:PopoverController,
    protected audioService: AudioService,
  ) {
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.audio = this.audioRef.nativeElement;
    this.metaaudio = this.metaaudioRef.nativeElement;
    console.log('(1) AUDIO: Enter!');
    if(!this.audioService.getPlayingSermonURL()){
      console.log('(1a)');
      this.audio.src = this.sermonURL;
      this.audio.load();
    } else {
      console.log('(1b)');
      if(this.audioService.getPlayingSermonURL() === this.sermonURL) {
        this.audio = this.audioService.audio;
        this.sermonImageURL = this.audioService.sermonImageURL;
        this.isLoaded = true;
      }
    }
  }

  ClosePopover()
  {
    this.popover.dismiss("close");
  }

  controlSeconds(action) {
    const step = 15.0;
    const numberRange = this.audioService.audio.currentTime + 0.0;
    if(this.isLoaded === false) {
      this.load();
    }
    switch (action) {
      case 'back':
        this.audioService.audio.currentTime = numberRange < step ? 0.001 : numberRange - step;
        // update position for display
        break;
      case 'forward':
        if(!isNaN(this.audioService.audio.currentTime)) {
          this.audioService.audio.currentTime = (numberRange + step) < this.metaaudio.duration 
            ? numberRange + step : this.metaaudio.duration;
        }
        // update position for display
        break;
      default:
        break;
    }
  }

  setCurrentTime(event) {
    if(this.isLoaded === false) {
      this.load();
    }
    if(!isNaN(event.detail.value)){
      this.audioService.audio.currentTime = event.detail.value;
    }
  }

  async load(){
    this.audioService.loadAudio(this.sermonURL,this.sermonTitle, this.sermonFile );
    this.audio = this.audioService.audio;
    this.isLoaded = true;
    console.log('(B) AUDIO: audio load');
    this.audioService.audio.ontimeupdate = (ev) => {
      console.log("ev",ev);
      this.current = ev.timeStamp;
      // update position for display
    }
    // this.audioService.audio.ondurationchange = (ev) => {
    //     console.log("ev2",ev);
    //   this.duration = this.audio.duration;
    // }
    this.audioService.play();
  }

  

  
  // extractMetadataImage() {
  //   console.log('Extracting metadata image from MP3...', this.sermonURL);
  //   jsmediatags.read(this.sermonURL, {
  //     onSuccess: (tag) => {
  //       const picture = tag.tags.picture;
  //       if (picture) {
  //         const base64String = this.arrayBufferToBase64(picture.data);
  //         this.sermonImageURL = `data:${picture.format};base64,${base64String}`;
  //         console.log('Extracted metadata image:', this.sermonImageURL);

  //         // Set media metadata with the extracted image
  //         this.setMediaMetadata();
  //       } else {
  //         console.warn('No image found in MP3 metadata.');
  //       }
  //     },
  //     onError: (error) => {
  //       console.error('Error reading MP3 metadata:', error);
  //     },
  //   });
  // }


  isSameSermon() {
    return (this.audioService.getPlayingSermonURL() === this.sermonURL);
  }

  durationNaN() {
    return isNaN(this.metaaudio.duration);
  }

  ngOnDestroy() {
  }

  play() {
    this.audioService.play();
  }
}
