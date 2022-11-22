import { Component, OnInit } from '@angular/core';
import { rawListeners } from 'process';
import { FeedsService } from '../communications/feeds.service';
import { NewsRss } from '../communications/news-rss';


@Component({
  selector: 'app-predigten-audio',
  templateUrl: './predigten-audio.page.html',
  styleUrls: ['./predigten-audio.page.scss'],
})
export class PredigtenAudioPage implements OnInit {
  isViewCompact=true;
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

  async doRefresh(event) {
    if (event) {
      console.log('re-read feeds');
      this.predigten = [];
      this.isViewCompact = true;
      
      await this.feedservice.GetRssFeedData(this.feedservice.PREDIGTEN_URL,'').then((res)=>{
        //console.log("Feed gelesen"+JSON.stringify(res));
        //console.log('=> set rss Data from feed');
        this.rssData = this.feedservice.RssData;
        this.predigten = this.rssData.rss.channel[0].item;
      });
      
      event.target.complete();
    }
     
  }

  public async getMoreSermons() {
    this.isViewCompact = false;

    await this.feedservice.GetRssFeedData(this.feedservice.PREDIGTEN_URL,'more').then((res)=>{
      //console.log("Feed gelesen"+JSON.stringify(res));
      //console.log('=> set rss Data from feed');
      this.rssData = this.feedservice.RssData;
      this.predigten = this.predigten.concat(this.rssData.rss.channel[0].item);
    });
  }

}
