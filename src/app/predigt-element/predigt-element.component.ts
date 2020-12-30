import { Component, OnInit, Input } from '@angular/core';
import { NewsRss } from '../communications/news-rss';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Platform } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

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
  constructor(
    private socialSharing: SocialSharing,
    private platform: Platform,
    private iab: InAppBrowser,) { }

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


}
