import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SlideShowComponent } from './slide-show.component';

describe('SlideShowComponent', () => {
  let component: SlideShowComponent;
  let fixture: ComponentFixture<SlideShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlideShowComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SlideShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
