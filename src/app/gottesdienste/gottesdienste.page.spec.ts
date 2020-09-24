import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GottesdienstePage } from './gottesdienste.page';

describe('GottesdienstePage', () => {
  let component: GottesdienstePage;
  let fixture: ComponentFixture<GottesdienstePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GottesdienstePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GottesdienstePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
