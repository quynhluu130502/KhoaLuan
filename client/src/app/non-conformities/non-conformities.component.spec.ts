import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonConformitiesComponent } from './non-conformities.component';

describe('NonConformitiesComponent', () => {
  let component: NonConformitiesComponent;
  let fixture: ComponentFixture<NonConformitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonConformitiesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NonConformitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
