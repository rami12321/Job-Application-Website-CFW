import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobRequestTableComponent } from './job-request-table.component';

describe('JobRequestTableComponent', () => {
  let component: JobRequestTableComponent;
  let fixture: ComponentFixture<JobRequestTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobRequestTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobRequestTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
