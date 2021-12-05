import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TunTakeoverPage } from './tun-takeover.page';

describe('TunTakeoverPage', () => {
  let component: TunTakeoverPage;
  let fixture: ComponentFixture<TunTakeoverPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TunTakeoverPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TunTakeoverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
