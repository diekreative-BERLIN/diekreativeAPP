import { Component, OnInit, ViewChild } from '@angular/core';
import { UserstateService } from '../userstate.service';
import { TueroeffnerService } from '../tueroeffner.service';
import { MatAccordion } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { ChurchapiService } from '../connectors/churchapi.service';


@Component({
  selector: 'app-tagundnacht',
  templateUrl: './tagundnacht.page.html',
  styleUrls: ['./tagundnacht.page.scss'],
})
export class TagundnachtPage implements OnInit {
  items:any;
  WeekTopics:any;
  PersecutedTopic:any;
  constructor(
    public userState:UserstateService,
    public tueroeffner:TueroeffnerService,
    private router: Router,
    private churchtools:ChurchapiService
  ) {
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
      ;
  }

  ngOnInit() {
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
}
