import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteMemoModalComponent } from './delete-memo-modal.component';

describe('DeleteMemoModalComponent', () => {
  let component: DeleteMemoModalComponent;
  let fixture: ComponentFixture<DeleteMemoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteMemoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteMemoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
