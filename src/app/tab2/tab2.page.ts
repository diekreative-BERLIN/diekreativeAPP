import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { DefaultSystemBrowserOptions, InAppBrowser } from '@capacitor/inappbrowser';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(
    private platform: Platform,
    private router: Router
  ) {  }

  openWebsite(url){
    this.platform.ready().then(() => {
      InAppBrowser.openInSystemBrowser({url, options:DefaultSystemBrowserOptions});
    });
  }

  TermineActivated() {
    this.router.navigate(["/tabs/termine"]);
    //this.close();
  }

}
