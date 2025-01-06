import { TestBed } from '@angular/core/testing';

import { VerificationCodeService } from '../verification-code.service';

describe('VerificationCodeService', () => {
  let service: VerificationCodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VerificationCodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
