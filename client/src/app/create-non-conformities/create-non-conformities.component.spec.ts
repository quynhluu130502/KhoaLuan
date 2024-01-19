import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNonConformitiesComponent } from './create-non-conformities.component';

describe('CreateNonConformitiesComponent', () => {
  let component: CreateNonConformitiesComponent;
  let fixture: ComponentFixture<CreateNonConformitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateNonConformitiesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateNonConformitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
