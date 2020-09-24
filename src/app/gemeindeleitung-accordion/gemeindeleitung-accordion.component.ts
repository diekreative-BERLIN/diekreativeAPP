import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-gemeindeleitung-accordion',
  templateUrl: './gemeindeleitung-accordion.component.html',
  styleUrls: ['./gemeindeleitung-accordion.component.scss'],
})
export class GemeindeleitungAccordionComponent implements OnInit {

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
