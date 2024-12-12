import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YouthprofileComponent } from './youthprofile.component';

describe('YouthprofileComponent', () => {
  let component: YouthprofileComponent;
  let fixture: ComponentFixture<YouthprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YouthprofileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YouthprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
