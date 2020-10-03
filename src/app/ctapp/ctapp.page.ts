import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { ChurchapiService } from '../connectors/churchapi.service';
import { UserstateService } from '../userstate.service';

@Component({
  selector: 'app-ctapp',
  templateUrl: './ctapp.page.html',
  styleUrls: ['./ctapp.page.scss'],
})
export class CtappPage implements OnInit {
  loginstring = "";

  constructor(
    private iab: InAppBrowser,
    private platform: Platform,
    private churchtools:ChurchapiService,
    public userState:UserstateService) { }

  ngOnInit() {
  }

  openCtApp(){
    let personid = this.userState.personid;
    this.churchtools.getLoginString(personid).then((res)=>{
      
      console.log(JSON.stringify(res.data));
      this.loginstring = (JSON.parse(res.data)).loginString;
      console.log("nun, loginstr="+this.loginstring);

      let url = "churchtools://login?instanceurl=https://diekreative.org/churchtools/&loginstring="+this.loginstring+"&personid="+personid;
      console.log("CT App oeffnen mit:");
      console.log(url);

      this.openWebsite(url);

    }).catch((err)=>{
      this.loginstring = "";
    })
  }

  openWebsite(url){
    this.platform.ready().then(() => {
      this.iab.create(url,'_system');
    });
  }

}
