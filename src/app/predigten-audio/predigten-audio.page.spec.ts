import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PredigtenAudioPage } from './predigten-audio.page';

describe('PredigtenAudioPage', () => {
  let component: PredigtenAudioPage;
  let fixture: ComponentFixture<PredigtenAudioPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PredigtenAudioPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PredigtenAudioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
