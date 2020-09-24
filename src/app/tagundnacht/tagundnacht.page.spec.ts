import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TagundnachtPage } from './tagundnacht.page';

describe('TagundnachtPage', () => {
  let component: TagundnachtPage;
  let fixture: ComponentFixture<TagundnachtPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagundnachtPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TagundnachtPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
