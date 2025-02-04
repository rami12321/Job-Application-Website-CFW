import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YouthTableComponent } from './youth-table.component';

describe('YouthTableComponent', () => {
  let component: YouthTableComponent;
  let fixture: ComponentFixture<YouthTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YouthTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YouthTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
