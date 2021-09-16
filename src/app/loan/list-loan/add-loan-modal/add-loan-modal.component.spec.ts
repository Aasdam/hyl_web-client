import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLoanModalComponent } from './add-loan-modal.component';

describe('AddLoanModalComponent', () => {
  let component: AddLoanModalComponent;
  let fixture: ComponentFixture<AddLoanModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddLoanModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLoanModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
