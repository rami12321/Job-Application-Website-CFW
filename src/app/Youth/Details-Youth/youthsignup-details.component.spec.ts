import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YouthsignupDetailsComponent } from './Detailsyouth.component';

describe('YouthsignupDetailsComponent', () => {
  let component: YouthsignupDetailsComponent;
  let fixture: ComponentFixture<YouthsignupDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YouthsignupDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YouthsignupDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
