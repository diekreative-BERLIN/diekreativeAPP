import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AkademiePage } from './akademie.page';

describe('AkademiePage', () => {
  let component: AkademiePage;
  let fixture: ComponentFixture<AkademiePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AkademiePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AkademiePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
