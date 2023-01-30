import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';

//Media Player
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { NgZone } from '@angular/core';
//popover
import {PopoverController} from '@ionic/angular';

@Component({
  selector: 'app-sermonplayer',
  templateUrl: './sermonplayer.page.html',
  styleUrls: ['./sermonplayer.page.scss'],
})
export class SermonplayerPage implements OnInit {

  sermonTitle;
  sermonURL;
  
  //Music Player
  filename: any = 'init';
  duration: any = -1;
  curr_playing_file: MediaObject;
  play_The_track: string = "init";
  position: any = 0;
  get_position_interval: any;
  is_playing = false;
  is_in_play = false;
  is_ready = false;
  get_duration_interval: any;
  display_position: any = '00:00';
  display_duration: any = '00:00';
  //Music Player

  constructor(
    private platform: Platform,
    private popover:PopoverController,
    private media: Media
  ) { }

  ngOnInit() {
    console.log('öffne Player. Muss prepareAudioFile machen mit');
    console.log(this.sermonURL);
    
    this.play_The_track = this.sermonURL;
    this.prepareAudioFile();
  }


  ClosePopover()
  {
    this.stop();
    this.popover.dismiss("close");
  }


  //Media Player
  prepareAudioFile() {
    this.platform.ready().then((res) => {
      this.getDuration();
    });
  }

  getDuration() {
    console.log('GETDuration from '+this.play_The_track);
    this.curr_playing_file = this.media.create(this.play_The_track);
    // on occassions, the plugin only gives duration of the file if the file is played
    // at least once
    this.curr_playing_file.play();

    this.curr_playing_file.setVolume(0.0);  // you don't want users to notice that you are playing the file
    const self = this;
    // The plugin does not give the correct duration on playback start
    // Need to check for duration repeatedly
    let temp_duration = self.duration;
    console.log('da? temp_dur='+temp_duration);
    this.get_duration_interval = setInterval(() => {
      if (self.duration === -1 || !self.duration) {
        self.duration = ~~(self.curr_playing_file.getDuration());  // make it an integer
      } else {
        if (self.duration !== temp_duration) {
          temp_duration = self.duration;
        }
        else {
          self.curr_playing_file.stop();
          self.curr_playing_file.release();

          clearInterval(self.get_duration_interval);
          this.display_duration = this.toHHMMSS(self.duration);
          self.setToPlayback();
        }
      }
    }, 100);
  }

  setToPlayback() {
    this.curr_playing_file = this.media.create(this.play_The_track);
    this.curr_playing_file.onStatusUpdate.subscribe(status => {
      switch (status) {
        case 1:
          break;
        case 2:   // 2: playing
          this.is_playing = true;
          break;
        case 3:   // 3: pause
          this.is_playing = false;
          break;
        case 4:   // 4: stop
        default:
          this.is_playing = false;
          break;
      }
    });
    this.is_ready = true;
    this.getAndSetCurrentAudioPosition();
  }

  getAndSetCurrentAudioPosition() {
    const diff = 1;
    const self = this;
    this.get_position_interval = setInterval(() => {
      const last_position = self.position;
      self.curr_playing_file.getCurrentPosition().then((position) => {
        if (position >= 0 && position < self.duration) {
          if (Math.abs(last_position - position) >= diff) {
            // set position
            self.curr_playing_file.seekTo(last_position * 1000);

          } else {
            // update position for display
            self.position = position;
            this.display_position = this.toHHMMSS(self.position);
          }
        } else if (position >= self.duration) {
          self.stop();
          self.setToPlayback();
        }
      });
    }, 100);
  }

  play() {
    this.curr_playing_file.play();
  }

  pause() {
    this.curr_playing_file.pause();
  }

  stop() {
    this.curr_playing_file.stop();
    this.curr_playing_file.release();
    clearInterval(this.get_position_interval);
    this.position = 0;
  }

  controlSeconds(action) {
    const step = 15;
    const numberRange = this.position;
    switch (action) {
      case 'back':
        this.position = numberRange < step ? 0.001 : numberRange - step;
        // update position for display
        this.display_position = this.toHHMMSS(this.position);
        break;
      case 'forward':
        this.position = numberRange + step < this.duration ? numberRange + step : this.duration;
        // update position for display
        this.display_position = this.toHHMMSS(this.position);
        break;
      default:
        break;
    }
  }
  toHHMMSS(secs) {
    var sec_num = parseInt(secs, 10)
    var minutes = Math.floor(sec_num / 60) % 60
    var seconds = sec_num % 60

    return [minutes, seconds]
      .map(v => v < 10 ? "0" + v : v)
      .filter((v, i) => v !== "00" || i >= 0)
      .join(":")
  }

  ngOnDestroy() {
    this.stop();
  }
  //Media Player

}
