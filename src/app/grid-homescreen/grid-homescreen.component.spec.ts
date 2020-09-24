import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GridHomescreenComponent } from './grid-homescreen.component';

describe('GridHomescreenComponent', () => {
  let component: GridHomescreenComponent;
  let fixture: ComponentFixture<GridHomescreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridHomescreenComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GridHomescreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
