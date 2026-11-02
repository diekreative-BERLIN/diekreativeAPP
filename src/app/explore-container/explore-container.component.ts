import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-explore-container',
  templateUrl: './explore-container.component.html',
  styleUrls: ['./explore-container.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ExploreContainerComponent implements OnInit {
  @Input() name: string;

  constructor() { }

  ngOnInit() {}

}
