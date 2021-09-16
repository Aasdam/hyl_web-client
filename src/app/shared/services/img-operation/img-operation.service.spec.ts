import { TestBed } from '@angular/core/testing';

import { ImgOperationService } from './img-operation.service';

describe('FileUploadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ImgOperationService = TestBed.get(ImgOperationService);
    expect(service).toBeTruthy();
  });
});
