import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TunSwapPage } from './tun-swap.page';

describe('TunSwapPage', () => {
  let component: TunSwapPage;
  let fixture: ComponentFixture<TunSwapPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TunSwapPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TunSwapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
