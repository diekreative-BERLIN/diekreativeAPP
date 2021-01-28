import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GdCheckinPage } from './gd-checkin.page';

describe('GdCheckinPage', () => {
  let component: GdCheckinPage;
  let fixture: ComponentFixture<GdCheckinPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GdCheckinPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GdCheckinPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
