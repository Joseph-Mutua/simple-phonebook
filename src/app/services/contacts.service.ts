import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Contact } from '../interfaces/contacts.model';
import { StateService } from './state.service';

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  //Path to JSON file
  private apiUrl = 'assets/contacts.json';

  constructor(private http: HttpClient, private stateService: StateService) {}

  //fetch contacts
  getContacts(): void {
    this.http.get<Contact[]>(this.apiUrl).subscribe((contacts) => {
      this.stateService.setContacts(contacts);
    });
  }
}
