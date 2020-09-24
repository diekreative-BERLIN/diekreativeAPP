import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-text-accordion',
  templateUrl: './text-accordion.component.html',
  styleUrls: ['./text-accordion.component.scss'],
})
export class TextAccordionComponent implements OnInit {

  @Input() title;
  @Input() text;
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
