import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFirstTimeComponent } from './admin-first-time.component';

describe('AdminFirstTimeComponent', () => {
  let component: AdminFirstTimeComponent;
  let fixture: ComponentFixture<AdminFirstTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminFirstTimeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminFirstTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
