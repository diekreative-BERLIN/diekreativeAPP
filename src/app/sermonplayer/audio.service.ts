import { Injectable } from '@angular/core';
import { Filesystem } from '@capacitor/filesystem';
import { MediaSession } from '@jofr/capacitor-media-session';
import jsmediatags from 'jsmediatags/dist/jsmediatags.min.js';
@Injectable({
  providedIn: 'root'
})
export class AudioService {

  audio: HTMLAudioElement = new Audio();
  sermonURL: string;
  sermonTitle: string;
  sermonImageURL: string;
  sermonFile: string;

  constructor() { }

  updatePositionState = () => {
    MediaSession.setPositionState({
        position: this.audio.currentTime,
        duration: this.audio.duration,
        playbackRate: this.audio.playbackRate
    });
    if (this.audio.paused) {
      MediaSession.setPlaybackState({ playbackState: 'paused' });
    } else {
      MediaSession.setPlaybackState({ playbackState: 'playing' });
    }
  
  }

  async loadAudio(url: string, sermonTitle: string, sermonFile?: string) {
    this.sermonURL = url;
    this.audio.src = url;
    this.sermonFile = sermonFile;
    this.sermonTitle = sermonTitle;

    if (sermonFile==undefined) {
      //Play from web 
      this.extractMetadataImage();
      await MediaSession.setMetadata({
          title: this.sermonTitle,
          artist: 'diekreative BERLIN',
          artwork: [
            { src: 'https://diekreative.org/audio/diekreative_Predigtpodcast.png', sizes: '512x512', type: 'image/png' }
          ]
      }).then(() => {
        MediaSession.setPlaybackState({ playbackState: 'playing' });
      } );
    } else {
      //play from local mp3
      //this.extractMetadataImage(); - error on android > eigentlich brauchen wir das wohl gar nicht mehr weil ich ein
      //Cover aus dem Netz angebe wenn online und wenn offline dann nix
      
      await MediaSession.setMetadata({
          title: this.sermonTitle,
          artist: 'diekreative BERLIN',
          artwork: [] // <-- Das verhindert den Crash
      }).then(() => {
        MediaSession.setPlaybackState({ playbackState: 'playing' });
      } ); 
    }

    this.audio.addEventListener('durationchange', this.updatePositionState);
    this.audio.addEventListener('seeked', this.updatePositionState);
    this.audio.addEventListener('ratechange', this.updatePositionState);
    this.audio.addEventListener('play', this.updatePositionState);
    this.audio.addEventListener('pause', this.updatePositionState);


    await MediaSession.setActionHandler({ action: 'play' }, () => {
      this.audio.play();
    });

    await MediaSession.setActionHandler({ action: 'pause' }, () => {
      this.audio.pause();
    });

    await MediaSession.setActionHandler({ action: 'seekto' }, (details) => {
      this.audio.currentTime = details.seekTime;
    });

    await MediaSession.setActionHandler({ action: 'seekforward' }, (details) => {
      const seekOffset = details.seekTime ?? 30;
      this.audio.currentTime = this.audio.currentTime + seekOffset;
    });

    await MediaSession.setActionHandler({ action: 'seekbackward' }, (details) => {
      const seekOffset = details.seekTime ?? 30;
      this.audio.currentTime = this.audio.currentTime - 30;
    });

    await MediaSession.setActionHandler({ action: 'stop' }, () => {
      this.audio.pause();
    });
  }

  async extractMetadataImage() {
    try {
      console.log('Extracting metadata image from MP3...', this.sermonURL);
  
      // Check if the URL is a remote URL (http/https) or local (capacitor://localhost)
      if (this.sermonFile==undefined) {
        // Handle remote HTTP/HTTPS URL directly
        console.log("in HTTP/HTTPS URL");
        jsmediatags.read(this.sermonURL, {
          onSuccess: (tag) => this.handleMetadataSuccess(tag),
          onError: (error) => this.handleMetadataError(error),
        });
      } else {
        console.log("in local Capacitor URL",this.sermonFile);
        // Handle local Capacitor URL
        // Read file as binary data
        const fileResult = await Filesystem.readFile({
          path: this.sermonFile,
        });
  
        let fileBlob: Blob;
        if (typeof fileResult.data === 'string') {
          // File result is Base64 string
          fileBlob = this.base64ToBlob(fileResult.data, 'audio/mpeg');
        } else if (fileResult instanceof Blob) {
          // File result is Blob
          fileBlob = fileResult;
        } else {
          throw new Error('Unexpected file result type');
        }
  
        // Convert Base64 to a Blob

      // Use jsmediatags with the Blob
      jsmediatags.read(fileBlob, {
        onSuccess: (tag) => this.handleMetadataSuccess(tag),
        onError: (error) => this.handleMetadataError(error),
      });
      }
    } catch (error) {
      console.error('Error reading MP3 file:', error);
    }
  }
  
  base64ToBlob(base64: string, mimeType: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }

  handleMetadataSuccess(tag: any) {
    const picture = tag.tags.picture;
    if (picture) {
      const base64String = this.arrayBufferToBase64(picture.data);
      this.sermonImageURL = `data:${picture.format};base64,${base64String}`;
      console.log('Extracted metadata image:', this.sermonImageURL);
  
      // Set media metadata with the extracted image
      this.setMediaMetadata();
    } else {
      console.warn('No image found in MP3 metadata.');
    }
  }
  
  async handleMetadataError(error: any) {
    console.error('Error reading MP3 metadata:', JSON.stringify(error));
  }
  
  base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }
  async play() {
    await this.audio.play();
  }

  pause() {
    this.audio.pause();
  }

  seekTo(seconds: number) {
    this.audio.currentTime = seconds;
  }

  getDuration(): number {
    return this.audio.duration;
  }

  getPlayingSermonURL(): string {
    return this.sermonURL;
  }

  // Convert ArrayBuffer to Base64 string
  arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  // Set media metadata for the current MP3
  async setMediaMetadata() {
   await MediaSession.setMetadata({
      title: this.sermonTitle,
      artist: 'dieKreative',
      artwork: [
        { src: this.sermonImageURL, sizes: '512x512', type: 'image/jpeg' }
      ]
    });
    console.log('Media metadata set:', this.sermonTitle);
  }



}
