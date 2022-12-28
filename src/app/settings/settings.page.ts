import { Component, ViewChild } from '@angular/core';
import { UserstateService } from '../userstate.service';
import { IonReorderGroup } from '@ionic/angular';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage {
  form:any = [];
  public isDisabled = true;

  @ViewChild(IonReorderGroup) reorderGroup: IonReorderGroup;

  constructor(private userState:UserstateService) {
    //this.form = this.form.concat(this.userState.AppHomescreen);
    console.log('in settings Constructor von settings.page');
    //this.form = this.userState.AppHomescreen;
    this.userState.homescreen.subscribe((form2)=>{
      //console.log(form2);
      this.form=form2;
    });
  }

  doReorder(ev: any) {
    // Before complete is called with the items they will remain in the
    // order before the drag
    //console.log('Before complete', this.form);
    //console.log('anzahl elemente='+this.form.length);

    // The `from` and `to` properties contain the index of the item
    // when the drag started and ended, respectively
    //console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);

    // Finish the reorder and position the item in the DOM based on
    // where the gesture ended. This method can also be called directly
    // by the reorder group
    this.form = ev.detail.complete(this.form);
  }

  modifyHomescreen() {
    this.isDisabled = false;
  }

  applyHomescreen() {
    this.isDisabled = true;
    //console.log('new layout', this.form);
    this.userState.saveHomeSettings(this.form);
  }
  resetHomescreen() {
    this.isDisabled = true;
    this.userState.resetHomeSettings();
    //console.log('resetted layout', this.form);
    //this.form = this.userState.h;
  }

}
