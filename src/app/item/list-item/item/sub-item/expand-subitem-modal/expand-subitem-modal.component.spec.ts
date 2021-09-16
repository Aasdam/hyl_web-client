import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandSubitemModalComponent } from './expand-subitem-modal.component';

describe('ExpandSubitemModalComponent', () => {
  let component: ExpandSubitemModalComponent;
  let fixture: ComponentFixture<ExpandSubitemModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpandSubitemModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpandSubitemModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
