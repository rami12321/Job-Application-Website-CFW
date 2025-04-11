import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentJobRequestDetailsComponent } from './payment-job-request-details.component';

describe('PaymentJobRequestDetailsComponent', () => {
  let component: PaymentJobRequestDetailsComponent;
  let fixture: ComponentFixture<PaymentJobRequestDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentJobRequestDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentJobRequestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
