import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTrackingSheetModalComponent } from './add-tracking-sheet-modal.component';

describe('AddTrackingSheetModalComponent', () => {
  let component: AddTrackingSheetModalComponent;
  let fixture: ComponentFixture<AddTrackingSheetModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTrackingSheetModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTrackingSheetModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
