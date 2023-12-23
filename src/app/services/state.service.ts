import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Contact } from '../interfaces/contacts.model';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private _contacts: BehaviorSubject<Contact[]> = new BehaviorSubject<
    Contact[]
  >([]);

  //fetch contacts
  get contacts(): Observable<Contact[]> {
    return this._contacts.asObservable();
  }

  //set contacts to state
  setContacts(contacts: Contact[]): void {
    this._contacts.next(contacts);
  }

  //add contact
  addContact(contact: Contact): void {
    // Get the current list of contacts
    let contacts = this._contacts.getValue();

    // Add the new contact to the list
    contacts.push(contact);

    // Update the state with the new list
    this._contacts.next(contacts);
  }

  //update contact
  updateContact(contact: Contact): void {
    // Get the current list of contacts
    let contacts = this._contacts.getValue();

    // Find and replace the contact in the list
    const index = contacts.findIndex((c) => c.id === contact.id);
    contacts[index] = contact;

    // Update the state with the new list
    this._contacts.next(contacts);
  }

  //delete contact
  deleteContact(id: string): void {
    // Get the current list of contacts
    let contacts = this._contacts.getValue();

    // Filter out the contact being deleted
    contacts = contacts.filter((c) => c.id !== id);

    // Update the state with the new list
    this._contacts.next(contacts);
  }

  // Method to update contacts
  updateContacts(newContacts: Contact[]) {
    this._contacts.next(newContacts);
  }
}
