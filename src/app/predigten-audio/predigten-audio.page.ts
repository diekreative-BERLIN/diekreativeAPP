import { Component, OnInit } from "@angular/core";
import { FeedsService } from "../communications/feeds.service";
import { NewsRss } from "../communications/news-rss";

@Component({
  selector: "app-predigten-audio",
  templateUrl: "./predigten-audio.page.html",
  styleUrls: ["./predigten-audio.page.scss"],
})
export class PredigtenAudioPage implements OnInit {
  rssData: NewsRss;
  predigten;
  reversedRssData = false;
  constructor(private feedservice: FeedsService) {}

  ngOnInit() {
    this.getRssData();
  }

  getRssData() {
    this.rssData = this.feedservice.RssData;
    this.predigten = this.rssData.rss.channel[0].item;
    console.log(JSON.stringify(this.rssData));
  }

  reverseRssData() {
    this.predigten.reverse();
    this.reversedRssData = !this.reversedRssData;
  }
  doRefresh(event) {
    if (event) {
      this.getRssData();
      
      event.target.complete();
    }
     
  }

  


}
