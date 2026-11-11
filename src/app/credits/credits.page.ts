import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {MatAccordion} from '@angular/material/expansion';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-credits',
  templateUrl: './credits.page.html',
  styleUrls: ['./credits.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CreditsPage implements OnInit {

  /** Einträge der App-Historie (Schlüssel in CREDITS.H.*), neueste zuerst */
  historie = ['V204', 'V203', 'V202', 'V201', 'V200', 'V108', 'V107', 'V106', 'V105', 'RELEASE', 'APPSTORE',
    'TROPFEN', 'PARTY', 'HACKATON', 'KICKOFF', 'TEAM', 'IDEE'];

  constructor(
    private platform: Platform,
    private router: Router
  ) { }

  ngOnInit() {
  }

  @ViewChild(MatAccordion) accordion: MatAccordion;

}
