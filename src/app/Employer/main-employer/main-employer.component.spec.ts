import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainEmployerComponent } from './Main-Employer.component';

describe('MainEmployerComponent', () => {
  let component: MainEmployerComponent;
  let fixture: ComponentFixture<MainEmployerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainEmployerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainEmployerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
