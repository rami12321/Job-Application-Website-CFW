/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { YouthService } from './Youth.service';

describe('Service: Youth', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [YouthService]
    });
  });

  it('should ...', inject([YouthService], (service: YouthService) => {
    expect(service).toBeTruthy();
  }));
});
