import { Component, Output, EventEmitter } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-contacts-table',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './contacts-table.component.html',
  styleUrl: './contacts-table.component.css',
})
export class ContactsTableComponent {
  faPlus = faPlus;

  @Output() openCreateModal = new EventEmitter();

  openModal() {
    this.openCreateModal.emit();
  }
}
