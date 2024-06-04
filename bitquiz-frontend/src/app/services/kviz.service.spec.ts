import { TestBed } from '@angular/core/testing';

import { KvizService } from './kviz.service';

describe('KvizService', () => {
  let service: KvizService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KvizService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
