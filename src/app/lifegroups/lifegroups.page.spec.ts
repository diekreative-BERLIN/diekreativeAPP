import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LifegroupsPage } from './lifegroups.page';

describe('LifegroupsPage', () => {
  let component: LifegroupsPage;
  let fixture: ComponentFixture<LifegroupsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LifegroupsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LifegroupsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
