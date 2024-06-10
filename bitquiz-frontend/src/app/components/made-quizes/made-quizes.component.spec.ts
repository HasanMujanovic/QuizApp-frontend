import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MadeQuizesComponent } from './made-quizes.component';

describe('MadeQuizesComponent', () => {
  let component: MadeQuizesComponent;
  let fixture: ComponentFixture<MadeQuizesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MadeQuizesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MadeQuizesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
