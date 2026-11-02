import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {MatAccordion} from '@angular/material/expansion';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.page.html',
  styleUrls: ['./aboutus.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AboutusPage implements OnInit {
  constructor(
    private platform: Platform,
    private router: Router
  ) { }

  ngOnInit() {
  }
  
  @ViewChild(MatAccordion) accordion: MatAccordion;
}
