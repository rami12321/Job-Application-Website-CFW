import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';

import { candeactivateAdminGuard } from './candeactivate-admin.guard';

describe('candeactivateAdminGuard', () => {
  const executeGuard: CanDeactivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => candeactivateAdminGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
