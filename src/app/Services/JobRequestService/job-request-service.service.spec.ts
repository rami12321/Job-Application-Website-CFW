import { TestBed } from '@angular/core/testing';

import { JobRequestServiceService } from './job-request-service.service';

describe('JobRequestServiceService', () => {
  let service: JobRequestServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobRequestServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
