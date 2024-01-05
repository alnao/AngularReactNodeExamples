import { TestBed } from '@angular/core/testing';

import { AuthappServiceService } from './authapp-service.service';

describe('AuthappServiceService', () => {
  let service: AuthappServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthappServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
