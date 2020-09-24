import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CtappPage } from './ctapp.page';

describe('CtappPage', () => {
  let component: CtappPage;
  let fixture: ComponentFixture<CtappPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CtappPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CtappPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
