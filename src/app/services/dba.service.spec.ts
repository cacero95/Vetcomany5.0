import { TestBed } from '@angular/core/testing';

import { DbaService } from './dba.service';

describe('DbaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DbaService = TestBed.get(DbaService);
    expect(service).toBeTruthy();
  });
});
