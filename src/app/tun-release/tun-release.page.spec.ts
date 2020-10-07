import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TunReleasePage } from './tun-release.page';

describe('TunReleasePage', () => {
  let component: TunReleasePage;
  let fixture: ComponentFixture<TunReleasePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TunReleasePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TunReleasePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
