import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableLoanComponent } from './table-loan.component';

describe('TableLoanComponent', () => {
  let component: TableLoanComponent;
  let fixture: ComponentFixture<TableLoanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableLoanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
