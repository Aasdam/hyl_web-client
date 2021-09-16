import { TestBed } from '@angular/core/testing';

import { DataTablesService } from './data-tables.service';

describe('DatatablesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataTablesService = TestBed.get(DataTablesService);
    expect(service).toBeTruthy();
  });
});
