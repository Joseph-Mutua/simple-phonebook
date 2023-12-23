import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-contact-modal',
  standalone: true,
  imports: [ CommonModule],
  templateUrl: './create-contact-modal.component.html',
  styleUrl: './create-contact-modal.component.css',
})
export class CreateContactModalComponent {
  @Output() close = new EventEmitter();
  isVisible = false;

  toggleModal() {
    this.isVisible = !this.isVisible;
    this.close.emit(this.isVisible);
  }
}
