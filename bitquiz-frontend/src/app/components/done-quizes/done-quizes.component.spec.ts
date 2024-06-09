import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoneQuizesComponent } from './done-quizes.component';

describe('DoneQuizesComponent', () => {
  let component: DoneQuizesComponent;
  let fixture: ComponentFixture<DoneQuizesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DoneQuizesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DoneQuizesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
