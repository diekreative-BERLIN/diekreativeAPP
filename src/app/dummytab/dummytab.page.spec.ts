import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DummytabPage } from './dummytab.page';

describe('DummytabPage', () => {
  let component: DummytabPage;
  let fixture: ComponentFixture<DummytabPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DummytabPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DummytabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
