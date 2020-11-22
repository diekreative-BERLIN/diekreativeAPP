import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PersondetailModalPage } from './persondetail-modal.page';

describe('PersondetailModalPage', () => {
  let component: PersondetailModalPage;
  let fixture: ComponentFixture<PersondetailModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersondetailModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PersondetailModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
