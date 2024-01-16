import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateInternalUserComponent } from './create-internal-user.component';

describe('CreateInternalUserComponent', () => {
  let component: CreateInternalUserComponent;
  let fixture: ComponentFixture<CreateInternalUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateInternalUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateInternalUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
