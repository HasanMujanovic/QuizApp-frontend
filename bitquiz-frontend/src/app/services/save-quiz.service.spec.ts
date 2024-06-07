import { TestBed } from '@angular/core/testing';

import { SaveQuizService } from './save-quiz.service';

describe('SaveQuizService', () => {
  let service: SaveQuizService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaveQuizService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
