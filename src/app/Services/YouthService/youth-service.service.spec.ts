import { TestBed } from '@angular/core/testing';

import { YouthServiceService } from './youth-service.service';

describe('YouthServiceService', () => {
  let service: YouthServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YouthServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
