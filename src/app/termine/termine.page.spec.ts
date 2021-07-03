import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TerminePage } from './termine.page';

describe('TerminePage', () => {
  let component: TerminePage;
  let fixture: ComponentFixture<TerminePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TerminePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
