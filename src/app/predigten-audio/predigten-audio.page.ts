import { Component, OnInit } from '@angular/core';
import { FeedsService } from '../communications/feeds.service';
import { NewsRss } from '../communications/news-rss';


@Component({
  selector: 'app-predigten-audio',
  templateUrl: './predigten-audio.page.html',
  styleUrls: ['./predigten-audio.page.scss'],
})
export class PredigtenAudioPage implements OnInit {
  rssData:NewsRss;
  predigten;
  constructor(private feedservice:FeedsService) { 
    
  }

  ngOnInit() {
    this.getRssData();
  }

  
  getRssData() {
    this.rssData = this.feedservice.RssData;
    this.predigten = this.rssData.rss.channel[0].item
    //console.log(JSON.stringify(this.rssData));
  }

  doRefresh(event) {
    if (event) {
      console.log('re-read feeds');
      this.predigten = [];
      
      this.feedservice.GetRssFeedData(this.feedservice.PREDIGTEN_URL);
      this.getRssData();
      
      event.target.complete();
    }
     
  }

  


}
