import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PredigtenVideoPage } from './predigten-video.page';

describe('PredigtenVideoPage', () => {
  let component: PredigtenVideoPage;
  let fixture: ComponentFixture<PredigtenVideoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PredigtenVideoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PredigtenVideoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
