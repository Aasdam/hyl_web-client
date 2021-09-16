import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DelModalComponent } from './del-modal.component';

describe('DelModalComponent', () => {
  let component: DelModalComponent;
  let fixture: ComponentFixture<DelModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DelModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DelModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
