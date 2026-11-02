import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MinistryteamPage } from './ministryteam.page';

describe('MinistryteamPage', () => {
  let component: MinistryteamPage;
  let fixture: ComponentFixture<MinistryteamPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MinistryteamPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MinistryteamPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
