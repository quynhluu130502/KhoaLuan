import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProblemDescriptionDialogComponent } from './problem-description-dialog.component';

describe('ProblemDescriptionDialogComponent', () => {
  let component: ProblemDescriptionDialogComponent;
  let fixture: ComponentFixture<ProblemDescriptionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProblemDescriptionDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProblemDescriptionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
