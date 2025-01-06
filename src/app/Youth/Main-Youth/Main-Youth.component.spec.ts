/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MainYouthComponent } from './Main-Youth.component';

describe('MainYouthComponent', () => {
  let component: MainYouthComponent;
  let fixture: ComponentFixture<MainYouthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainYouthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainYouthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
