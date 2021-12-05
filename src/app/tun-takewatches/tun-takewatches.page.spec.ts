import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TunTakewatchesPage } from './tun-takewatches.page';

describe('TunTakewatchesPage', () => {
  let component: TunTakewatchesPage;
  let fixture: ComponentFixture<TunTakewatchesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TunTakewatchesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TunTakewatchesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
