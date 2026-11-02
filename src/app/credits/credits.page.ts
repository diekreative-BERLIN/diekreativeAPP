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

  constructor(
    private platform: Platform,
    private router: Router
  ) { }

  ngOnInit() {
  }

  @ViewChild(MatAccordion) accordion: MatAccordion;

}
