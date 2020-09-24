import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LgMapComponent } from './lg-map.component';

describe('LgMapComponent', () => {
  let component: LgMapComponent;
  let fixture: ComponentFixture<LgMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LgMapComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LgMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
