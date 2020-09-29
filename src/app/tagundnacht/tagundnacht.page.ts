import { Component, OnInit, ViewChild } from '@angular/core';
import { UserstateService } from '../userstate.service';
import { TueroeffnerService } from '../tueroeffner.service';
import {MatAccordion} from '@angular/material/expansion';
import { Router } from '@angular/router';


@Component({
  selector: 'app-tagundnacht',
  templateUrl: './tagundnacht.page.html',
  styleUrls: ['./tagundnacht.page.scss'],
})
export class TagundnachtPage implements OnInit {

  constructor(
    public userState:UserstateService,
    public tueroeffner:TueroeffnerService,
    private router: Router
  ) { }

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

  @ViewChild(MatAccordion) accordion: MatAccordion;
}
