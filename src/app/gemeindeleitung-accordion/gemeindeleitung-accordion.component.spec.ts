import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GemeindeleitungAccordionComponent } from './gemeindeleitung-accordion.component';

describe('GemeindeleitungAccordionComponent', () => {
  let component: GemeindeleitungAccordionComponent;
  let fixture: ComponentFixture<GemeindeleitungAccordionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GemeindeleitungAccordionComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GemeindeleitungAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
