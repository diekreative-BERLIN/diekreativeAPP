import { Component, OnInit, ViewChild } from '@angular/core';
import { UserstateService } from '../userstate.service';
import { TueroeffnerService } from '../tueroeffner.service';
import { MatAccordion } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { ChurchapiService } from '../connectors/churchapi.service';

import {  AfterViewChecked } from '@angular/core';


@Component({
  selector: 'app-tagundnacht',
  templateUrl: './tagundnacht.page.html',
  styleUrls: ['./tagundnacht.page.scss'],
})
export class TagundnachtPage implements OnInit, AfterViewChecked {
  items:any;
  WeekTopics:any;
  PersecutedTopic:any;
  constructor(
    public userState:UserstateService,
    public tueroeffner:TueroeffnerService,
    private router: Router,
    private churchtools:ChurchapiService
  ) {
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
      ;
  }

  ngOnInit(){
    this.WeekTopics = "<ul><li>..einen kleinen Moment bitte..</li><li>..Daten werden geladen</li></ul>";
    this.PersecutedTopic = "Gebet f&uuml;r Verfolgte";
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

  @ViewChild(MatAccordion) accordion: MatAccordion;


  ngAfterViewChecked(): void {
    if(this.userState.AppPageTUNInit && this.userState.isOnline){
      console.log("setze ZURUECK");
      console.log("time stamp old"+this.userState.AppPageTunTimestamp);
      let timediff = Date.now()-this.userState.AppPageTunTimestamp;
      console.log("time difference in millisec"+ timediff);
      //compute if we have a new hour than the old timestamp
      let diffInHour = Math.floor(( Date.now() % 86400000) / 3600000) - Math.floor(( this.userState.AppPageTunTimestamp % 86400000) / 3600000);
      console.log("differenz stunde alt - neu: "+ diffInHour); // hours

      this.userState.AppPageTUNInit = false;

      if(diffInHour>0 || timediff > 3600000){
        this.userState.AppPageTunTimestamp = Date.now();
        
        this.accordion.closeAll();
        
        this.churchtools.getGebetsschichten(5,null,'').then((result)=>{
          console.log(JSON.stringify(result.data));
          this.items = JSON.parse(result.data);
        })
        this.churchtools.getTopicWeek().then((result)=>{
          this.WeekTopics = result.data;
        })
        this.churchtools.getTopicPersecuted().then((result)=>{
          this.PersecutedTopic = result.data;
        })
      }
    }  
  }
  
}
