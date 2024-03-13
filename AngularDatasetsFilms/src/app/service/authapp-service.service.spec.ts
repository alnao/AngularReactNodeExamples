import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthappServiceService } from './authapp-service.service';

describe('AuthappServiceService', () => {
  let service: AuthappServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [HttpClientTestingModule]});
    service = TestBed.inject(AuthappServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
