import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllshiftsComponent } from './allshifts.component';

describe('AllshiftsComponent', () => {
  let component: AllshiftsComponent;
  let fixture: ComponentFixture<AllshiftsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllshiftsComponent]
    });
    fixture = TestBed.createComponent(AllshiftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
