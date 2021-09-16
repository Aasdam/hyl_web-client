import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseLoanModalComponent } from './close-loan-modal.component';

describe('CloseLoanModalComponent', () => {
  let component: CloseLoanModalComponent;
  let fixture: ComponentFixture<CloseLoanModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloseLoanModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloseLoanModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
