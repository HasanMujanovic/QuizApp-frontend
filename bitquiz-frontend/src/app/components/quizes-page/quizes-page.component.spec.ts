import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizesPageComponent } from './quizes-page.component';

describe('QuizesPageComponent', () => {
  let component: QuizesPageComponent;
  let fixture: ComponentFixture<QuizesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuizesPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuizesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
