import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TunGebetscalPage } from './tun-gebetscal.page';

describe('TunGebetscalPage', () => {
  let component: TunGebetscalPage;
  let fixture: ComponentFixture<TunGebetscalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TunGebetscalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TunGebetscalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
