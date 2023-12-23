import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateContactModalComponent } from './update-contact-modal.component';

describe('UpdateContactModalComponent', () => {
  let component: UpdateContactModalComponent;
  let fixture: ComponentFixture<UpdateContactModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateContactModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateContactModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
