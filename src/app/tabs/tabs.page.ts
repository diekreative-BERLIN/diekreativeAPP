import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(private menu: MenuController) {}
  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

}
