import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-vision-accordion',
  templateUrl: './vision-accordion.component.html',
  styleUrls: ['./vision-accordion.component.scss'],
})
export class VisionAccordionComponent implements OnInit {

  @Input() title;

  fulltext = false;
  constructor() { }

  ngOnInit() {}

  expandTab(){
    this.fulltext = true;
  }

  closeTab(){
    this.fulltext = false;
  }

  toggleTab(){
    if(this.fulltext){
      this.fulltext=false;
    }else{
      this.fulltext=true;
    }
  }
}
