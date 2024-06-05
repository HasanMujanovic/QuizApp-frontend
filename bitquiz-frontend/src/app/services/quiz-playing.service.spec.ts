import { TestBed } from '@angular/core/testing';

import { QuizPlayingService } from './quiz-playing.service';

describe('QuizPlayingService', () => {
  let service: QuizPlayingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuizPlayingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
