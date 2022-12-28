import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AudienzPage } from './audienz.page';

describe('AudienzPage', () => {
  let component: AudienzPage;
  let fixture: ComponentFixture<AudienzPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AudienzPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AudienzPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
