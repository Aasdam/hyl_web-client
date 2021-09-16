import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSubitemModalComponent } from './add-subitem-modal.component';

describe('AddSubitemModalComponent', () => {
  let component: AddSubitemModalComponent;
  let fixture: ComponentFixture<AddSubitemModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSubitemModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSubitemModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
