import { Component, OnInit, Input } from '@angular/core';
import { NewsRss } from '../communications/news-rss';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

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
  constructor(private socialSharing: SocialSharing) { }

  ngOnInit() {}

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

  openPlayer(){
    this.playervisible = true;
  }

  closePlayer(){
    this.playervisible = false;
  }

  shareLink(predigturl,titel){
    var message = "Hör dir das an!"
    var subject = ""+titel
    var url = ""+predigturl
    var options = {
      message:message,
      subject:subject,
      url:url

    }
    this.socialSharing.shareWithOptions(options);
  }

}
