import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ItemslidePage } from './itemslide.page';

describe('ItemslidePage', () => {
  let component: ItemslidePage;
  let fixture: ComponentFixture<ItemslidePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemslidePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ItemslidePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
