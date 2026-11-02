import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Platform } from '@ionic/angular';
import { DefaultSystemBrowserOptions, InAppBrowser } from '@capacitor/inappbrowser';
import { Router } from '@angular/router';
import { ChurchapiService } from '../connectors/churchapi.service';
import { UserstateService } from '../userstate.service';

@Component({
  selector: 'app-ctapp',
  templateUrl: './ctapp.page.html',
  styleUrls: ['./ctapp.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CtappPage implements OnInit {
  loginstring = "";
  AppPlatform = "";

  constructor(
    private platform: Platform,
    private router: Router,
    private churchtools:ChurchapiService,
    public userState:UserstateService
    ) {  }

  ngOnInit() {
    if(this.platform.is('android')) {
      this.AppPlatform="android";
    } else {
      this.AppPlatform="iOS";
    }
  }

  openCtApp(){
    let personid = this.userState.personid;
    return this.churchtools.getLoginString(personid).then((res)=>{
      
      console.log(res.data);
      this.loginstring = (res.data).loginString;
      console.log("nun, loginstr="+this.loginstring);

      //let url = "churchtools://login?instanceurl=<churchtoolsurl>/&loginstring=..."
      let url = "churchtools://login?instanceurl="+this.churchtools.DK_API_SERVER+"/&loginstring="+this.loginstring+"&personid="+personid;
      
      console.log("CT App oeffnen mit:");
      console.log(url);

      window.open(url);  //TODO Marc 26.05.
   
    }).catch((err)=>{
      this.loginstring = "";
    })
  }

  openWebsite(url){
    this.platform.ready().then(async () => {
      await InAppBrowser.openInSystemBrowser({url:url,options:DefaultSystemBrowserOptions});
    });
  }

   openWebsiteInDefaultBrowser(url){
    this.platform.ready().then(async () => {
      await InAppBrowser.openInExternalBrowser({url:url});
    });
  }

}
