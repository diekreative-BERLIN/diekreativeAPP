import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ErlebtPage } from './erlebt.page';

describe('ErlebtPage', () => {
  let component: ErlebtPage;
  let fixture: ComponentFixture<ErlebtPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErlebtPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ErlebtPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
