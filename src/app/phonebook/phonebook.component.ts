import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { CreateContactModalComponent } from './modals/create-contact-modal/create-contact-modal.component';
import { ContactsTableComponent } from './table/contacts-table/contacts-table.component';
import { DeleteContactModalComponent } from './modals/delete-contact-modal/delete-contact-modal.component';
import { UpdateContactModalComponent } from './modals/update-contact-modal/update-contact-modal.component';
import { ViewContactModalComponent } from './modals/view-contact-modal/view-contact-modal.component';

@Component({
  selector: 'app-phonebook',
  standalone: true,
  imports: [
    CreateContactModalComponent,
    ContactsTableComponent,
    DeleteContactModalComponent,
    UpdateContactModalComponent,
    ViewContactModalComponent,
  ],
  templateUrl: './phonebook.component.html',
  styleUrl: './phonebook.component.css',
})
export class PhonebookComponent {
  @Output() openCreateModal = new EventEmitter();
  @ViewChild(CreateContactModalComponent, { static: false })
  createContactModal!: CreateContactModalComponent | undefined;

  openCreateContactModal() {
    if (this.createContactModal) {
      this.createContactModal.toggleModal();
    }
  }

  closeCreateContactModal() {
    if (this.createContactModal) {
      this.createContactModal.toggleModal();
    }
  }
}
