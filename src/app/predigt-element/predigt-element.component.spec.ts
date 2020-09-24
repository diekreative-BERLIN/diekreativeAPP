import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PredigtElementComponent } from './predigt-element.component';

describe('PredigtElementComponent', () => {
  let component: PredigtElementComponent;
  let fixture: ComponentFixture<PredigtElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PredigtElementComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PredigtElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
