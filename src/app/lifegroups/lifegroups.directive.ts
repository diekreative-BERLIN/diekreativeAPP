//Directive to detect iframe click because iOS does not allwo href=_top inside iframe
//taken from https://gist.github.com/micdenny/db03a814eaf4cd8abf95f77885d9316f

import {
    Directive,
    ElementRef,
    OnInit,
    Renderer2,
    Input,
    Output,
    EventEmitter,
    HostListener
  } from '@angular/core';
  
  @Directive({
    selector: '[appIframeTracker]'
  })
  export class IframeTrackerDirective implements OnInit {
    private iframeMouseOver: boolean;
  
    @Input() debug: boolean;
  
    @Output() iframeClick = new EventEmitter<ElementRef>();
  
    constructor(private el: ElementRef, private renderer: Renderer2) {}
  
    ngOnInit(): void {
      this.renderer.listen(window, 'blur', () => this.onWindowBlur());
    }
  
    @HostListener('mouseover')
    private onIframeMouseOver() {
      this.log('Iframe mouse over');
      this.iframeMouseOver = true;
      this.resetFocusOnWindow();
    }
  
    @HostListener('mouseout')
    private onIframeMouseOut() {
      this.log('Iframe mouse out');
      this.iframeMouseOver = false;
      this.resetFocusOnWindow();
    }
  
    private onWindowBlur() {
      if (this.iframeMouseOver) {
        this.log('WOW! Iframe click!!!');
        this.resetFocusOnWindow();
        this.iframeClick.emit(this.el);
      }
    }
  
    private resetFocusOnWindow() {
      setTimeout(() => {
        this.log('reset focus to window');
        window.focus();
      }, 100);
    }
  
    private log(message: string) {
      if (this.debug) {
        console.log(message);
      }
    }
  }