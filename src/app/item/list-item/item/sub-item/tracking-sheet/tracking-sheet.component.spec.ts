import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingSheetComponent } from './tracking-sheet.component';

describe('TrackingSheetComponent', () => {
  let component: TrackingSheetComponent;
  let fixture: ComponentFixture<TrackingSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackingSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackingSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
