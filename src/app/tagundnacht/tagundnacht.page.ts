import { Component, OnInit, ViewChild } from '@angular/core';
import { UserstateService } from '../userstate.service';
import { TueroeffnerService } from '../tueroeffner.service';
import { MatAccordion } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { ChurchapiService } from '../connectors/churchapi.service';


//toto
import {  AfterViewChecked } from '@angular/core';


@Component({
  selector: 'app-tagundnacht',
  templateUrl: './tagundnacht.page.html',
  styleUrls: ['./tagundnacht.page.scss'],
})
export class TagundnachtPage implements OnInit,
  AfterViewChecked {
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
    
  }

  meineSchichtenActivated(){
    this.router.navigate(["/itemslide"]);
    //this.close();
  }
  GebetskalenderActivated(){
    this.router.navigate(["/tun-gebetscal"]);
    //this.close();
  }
  freieSchichtenActivated(){
    this.router.navigate(["/tun-takewatches"]);
    //this.close();
  }

  @ViewChild(MatAccordion) accordion: MatAccordion;


  ngAfterViewChecked(): void {
    if(this.userState.AppPageTUNInit){
      console.log("setze ZURUECK");
      console.log("time stamp old"+this.userState.AppPageTunTimestamp);
      let diffMin = Math.round((((Date.now()-this.userState.AppPageTunTimestamp) % 86400000) % 3600000) / 60000);
      console.log("difference in min"+ diffMin); // minutes
      let diffHour = Math.floor(( (Date.now()-this.userState.AppPageTunTimestamp) % 86400000) / 3600000);
      console.log("differenz stunde alt - neu: "+ diffHour); // hours

      if(diffMin>60 || diffHour>=1){
        this.userState.AppPageTunTimestamp = Date.now();
        this.userState.AppPageTUNInit = false;

        this.accordion.closeAll();
        
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
      }
    }  
  }
  
}
