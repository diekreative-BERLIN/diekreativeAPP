import { Component, OnInit, ViewChild } from '@angular/core';
import { MbscFormOptions } from '@mobiscroll/angular';

@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.page.html',
  styleUrls: ['./aboutus.page.scss'],
})
export class AboutusPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @ViewChild('run1')
    r1: any;
    @ViewChild('run2')
    r2: any;
    @ViewChild('run3')
    r3: any;

    formSettings: MbscFormOptions = {
        lang: 'de',
        theme: 'ios',
        themeVariant: 'light'
    };

}
