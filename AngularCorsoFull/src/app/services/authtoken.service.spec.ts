import { TestBed } from '@angular/core/testing';

import { AuthtokenService } from './authtoken.service';

describe('AuthtokenService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthtokenService = TestBed.get(AuthtokenService);
    expect(service).toBeTruthy();
  });
});
