import { TestBed } from '@angular/core/testing';

import { ZavrsenKvizService } from './zavrsen-kviz.service';

describe('ZavrsenKvizService', () => {
  let service: ZavrsenKvizService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZavrsenKvizService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
