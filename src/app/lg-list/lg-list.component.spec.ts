import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LgListComponent } from './lg-list.component';

describe('LgListComponent', () => {
  let component: LgListComponent;
  let fixture: ComponentFixture<LgListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LgListComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LgListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
