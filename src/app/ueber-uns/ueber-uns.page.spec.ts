import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UeberUnsPage } from './ueber-uns.page';

describe('UeberUnsPage', () => {
  let component: UeberUnsPage;
  let fixture: ComponentFixture<UeberUnsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UeberUnsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UeberUnsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
