import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { SlideShowComponent } from '../slide-show/slide-show.component'
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { GridHomescreenComponent } from '../grid-homescreen/grid-homescreen.component';
import { Tab1PageRoutingModule } from './tab1-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab1PageRoutingModule
  ],
  declarations: [Tab1Page,GridHomescreenComponent,SlideShowComponent]
})
export class Tab1PageModule {}
