import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMemoModalComponent } from './add-memo-modal.component';

describe('AddMemoModalComponent', () => {
  let component: AddMemoModalComponent;
  let fixture: ComponentFixture<AddMemoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMemoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMemoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
