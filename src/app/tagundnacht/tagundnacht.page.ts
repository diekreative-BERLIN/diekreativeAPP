import { Component, OnInit } from '@angular/core';
import { UserstateService } from '../userstate.service';
import { TueroeffnerService } from '../tueroeffner.service';

@Component({
  selector: 'app-tagundnacht',
  templateUrl: './tagundnacht.page.html',
  styleUrls: ['./tagundnacht.page.scss'],
})
export class TagundnachtPage implements OnInit {

  constructor(public userState:UserstateService, public tueroeffner:TueroeffnerService) { }

  ngOnInit() {
  }

}
