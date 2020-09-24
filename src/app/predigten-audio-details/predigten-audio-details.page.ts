import { Component, OnInit } from '@angular/core';
import { Router, Navigation } from '@angular/router';

@Component({
  selector: 'app-predigten-audio-details',
  templateUrl: './predigten-audio-details.page.html',
  styleUrls: ['./predigten-audio-details.page.scss'],
})
export class PredigtenAudioDetailsPage implements OnInit {
  predigtUrl;
  title;
  description;
  constructor(private router: Router) { 
    console.log("state data" + JSON.stringify(window.history.state.data.predigt.enclosure[0].$.url));
    this.predigtUrl = window.history.state.data.predigt.enclosure[0].$.url;
    this.title = window.history.state.data.predigt.title;
    this.description = window.history.state.data.predigt.description
  }

  ngOnInit() {
    
  }

}
