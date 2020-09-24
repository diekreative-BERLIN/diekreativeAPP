import { TestBed } from '@angular/core/testing';

import { TueroeffnerService } from './tueroeffner.service';

describe('TueroeffnerService', () => {
  let service: TueroeffnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TueroeffnerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
