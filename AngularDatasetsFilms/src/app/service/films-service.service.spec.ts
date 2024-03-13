import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FilmsServiceService } from './films-service.service';

describe('FilmsServiceService', () => {
  let service: FilmsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [HttpClientTestingModule]});
    service = TestBed.inject(FilmsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  
});
