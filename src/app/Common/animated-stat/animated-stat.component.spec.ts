import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimatedStatComponent } from './animated-stat.component';

describe('AnimatedStatComponent', () => {
  let component: AnimatedStatComponent;
  let fixture: ComponentFixture<AnimatedStatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimatedStatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnimatedStatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
