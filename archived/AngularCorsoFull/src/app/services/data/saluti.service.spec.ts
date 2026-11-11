import { TestBed } from '@angular/core/testing';

import { SalutiService } from './saluti.service';

describe('SalutiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SalutiService = TestBed.get(SalutiService);
    expect(service).toBeTruthy();
  });
});
