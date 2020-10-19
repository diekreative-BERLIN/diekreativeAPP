import { Component, OnInit } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx'

@Component({
  selector: 'app-tun-gebetscal',
  templateUrl: './tun-gebetscal.page.html',
  styleUrls: ['./tun-gebetscal.page.scss'],
})
export class TunGebetscalPage implements OnInit {

  constructor(private iab: InAppBrowser) { }

  openBlank() {
    this.iab.create('https://diekreative.org/churchtools/?q=churchcal&amp;embedded=true&amp;viewname=calView&amp;category_id=17&amp;title=Gebetskalender&amp;cal4web=true',
    '_blank', {
      location:'yes',
      footer:'yes'
    });
  }

  openSystem() {
    this.iab.create('https://diekreative.org/churchtools/?q=churchcal&amp;embedded=true&amp;viewname=calView&amp;category_id=17&amp;title=Gebetskalender&amp;cal4web=true','_system');
  }

  ngOnInit() {
  }

}
