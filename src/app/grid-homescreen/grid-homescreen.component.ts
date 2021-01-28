import { Component, OnInit } from '@angular/core';
import { UserstateService } from '../userstate.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-grid-homescreen',
  templateUrl: './grid-homescreen.component.html',
  styleUrls: ['./grid-homescreen.component.scss'],
})
export class GridHomescreenComponent implements OnInit {

  constructor(
    private userState:UserstateService,
    private router: Router) { }

  ngOnInit() {}

  tagundnachtGoto(){
    this.userState.AppPageTUNInit = true;
    this.router.navigate(["/tabs/tagundnacht"]);
  }

  MedienGoto(){
    this.userState.AppPageMedienInit = true;
    this.router.navigate(["/tabs/predigten-audio"]);
  }

  GoDiGoto(){
    //this.userState.AppPageGodiInit = true;
    this.router.navigate(["/tabs/gottesdienste"]);
  }

}
