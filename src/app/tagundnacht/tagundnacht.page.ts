import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UserstateService } from '../userstate.service';
import { TueroeffnerService } from '../tueroeffner.service';
import { MatAccordion } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { ChurchapiService } from '../connectors/churchapi.service';

import {  AfterViewChecked } from '@angular/core';
import { Network } from '@capacitor/network';
import { interval } from 'rxjs';
import { ViewDidEnter } from '@ionic/angular';


@Component({
  selector: 'app-tagundnacht',
  templateUrl: './tagundnacht.page.html',
  styleUrls: ['./tagundnacht.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TagundnachtPage implements ViewDidEnter{
  items:any[];
  WeekTopics:any;
  PersecutedTopic:any;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  constructor(
    public userState:UserstateService,
    public tueroeffner:TueroeffnerService,
    private router: Router,
    private churchtools:ChurchapiService,
    private translate:TranslateService
  ) {
    this.WeekTopics = this.translate.instant('TUN.LOADING_TOPICS');
    this.PersecutedTopic = this.translate.instant('TUN.PERSECUTED_DEFAULT');
    this.items= [];
    /*
      this.churchtools.getGebetsschichten(5).then((result)=>{
        console.log(JSON.stringify(result.data));
        this.items = JSON.parse(result.data);
        })
      this.churchtools.getTopicWeek().then((result)=>{
        this.WeekTopics = result.data;
      })
      this.churchtools.getTopicPersecuted().then((result)=>{
        this.PersecutedTopic = result.data;
      })
      */
  }

  ionViewDidEnter(){
      if(this.userState.isOnline){
        this.accordion.closeAll();
        this.churchtools.getGebetsschichten(5,null,'').then((result)=>{
          console.log("TEST"+JSON.stringify(result.data));
          this.items = result.data;
          console.log("Count");
        })
        this.churchtools.getTopicWeek().then((result)=>{
          console.log('week topic result'+JSON.stringify(result));
          this.WeekTopics = result;
        })
        this.churchtools.getTopicPersecuted().then((result)=>{
          this.PersecutedTopic = result.data;
        })
      }
    interval(60000).subscribe(()=>{
      if(this.userState.isOnline){
        this.accordion.closeAll();
        this.churchtools.getGebetsschichten(5,null,'').then((result)=>{
          console.log(JSON.stringify(result.data));
          this.items = JSON.parse(result.data);
        })
        this.churchtools.getTopicWeek().then((result)=>{
          console.log('week topic result'+JSON.stringify(result));
          this.WeekTopics = result;
        })
        this.churchtools.getTopicPersecuted().then((result)=>{
          this.PersecutedTopic = result.data;
        })
      }});
  }

  

  meineSchichtenActivated(){
    this.router.navigate(["/tabs/itemslide"]);
    //this.close();
  }
  GebetskalenderActivated(){
    this.router.navigate(["/tabs/tun-gebetscal"]);
    //this.close();
  }
  freieSchichtenActivated(){
    this.router.navigate(["/tabs/tun-takewatches"]);
    //this.close();
  }
  GebetskalenderHNActivated(){
    this.router.navigate(["/tabs/tun-gebetscalHN"]);
    //this.close();
  }


}
