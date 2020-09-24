import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PredigtenAudioDetailsPage } from './predigten-audio-details.page';

describe('PredigtenAudioDetailsPage', () => {
  let component: PredigtenAudioDetailsPage;
  let fixture: ComponentFixture<PredigtenAudioDetailsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PredigtenAudioDetailsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PredigtenAudioDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
