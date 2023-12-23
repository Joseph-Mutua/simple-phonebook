
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Contact } from '../interfaces/contacts.model';
import { SharedModule } from '../shared/shared.module';
import { ContactsService } from '../services/contacts.service';
import { StateService } from '../services/state.service';
import { v4 as uuidv4 } from 'uuid';
import { ToastrService } from 'ngx-toastr';


@Component({
  standalone: true,
  selector: 'app-phonebook',
  templateUrl: './phonebook.component.html',
  styleUrls: ['./phonebook.component.css'],
  imports: [SharedModule],
  providers: [ContactsService],
})
export class PhonebookComponent implements OnInit {
  contactListings: Contact[] = [];
  filteredContacts: Contact[] = [];
  searchKeyword: string = '';
  sortType: string = '';
  locationKeyword: string = '';

  itemsPerPage = 10;
  currentPage = 1;
  totalPages: number[] = [];
  dropdownVisible: boolean[] = [];

  endIndex: number = 0;

  isCreateModalOpen = false;

  constructor(
    private contactsService: ContactsService,
    private stateService: StateService //private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.contactsService.getContacts();
    this.stateService.contacts.subscribe((contacts) => {
      this.contactListings = contacts;
      this.filteredContacts = contacts;

      const totalItems = this.filteredContacts.length;
      this.totalPages = Array(Math.ceil(totalItems / this.itemsPerPage))
        .fill(0)
        .map((x, i) => i + 1);

      this.filteredContacts.forEach(() => {
        this.dropdownVisible.push(false);
      });
    });
  }
  @ViewChild('createcontactModal')
  createcontactModal!: ElementRef;

  toggleDropdown(index: number): void {
    // Toggle the visibility of the dropdown at the specified index
    this.dropdownVisible[index] = !this.dropdownVisible[index];

    // Hide other dropdowns
    this.dropdownVisible.forEach((value, i) => {
      if (i !== index) {
        this.dropdownVisible[i] = false;
      }
    });
  }
  openCreateContactModal(): void {
    this.isCreateModalOpen = true;
  }

  closeCreateContactModal(): void {
    this.isCreateModalOpen = false;
  }

  //Create New Contact
  addNewContact(): void {
    // Extract form values as before
    const firstName = (document.getElementById('firstName') as HTMLInputElement)
      .value;
    const lastName = (document.getElementById('lastName') as HTMLInputElement)
      .value;
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const phoneNumber = (document.getElementById('phoneNumber') as HTMLInputElement)
      .value;

    // Generate a unique ID
    const id = uuidv4();

    // Create new contact object with generated ID
    const newContact: Contact = {
      id: id,
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone_number: phoneNumber,
    };

    // Add new contact via service
    this.stateService.addContact(newContact);
   
    // Close the modal
    this.closeCreateContactModal();
  }

  //Search input function
  onSearchChange(searchKeyword: string) {
    this.searchKeyword = searchKeyword;
    this.filterContacts();
  }

  //Filtering and Sort Functionality
  filterContacts() {
    let filtered = [...this.contactListings];

    if (this.searchKeyword.trim() !== '') {
      filtered = filtered.filter(
        (contact) =>
          contact.first_name
            .toLowerCase()
            .includes(this.searchKeyword.toLowerCase()) ||
          contact.last_name
            .toLowerCase()
            .includes(this.searchKeyword.toLowerCase()) ||
          contact.email
            .toLowerCase()
            .includes(this.searchKeyword.toLowerCase()) ||
          contact.phone_number
            .toLowerCase()
            .includes(this.searchKeyword.toLowerCase())
      );
    }
    // assign the new array to filteredContacts
    this.filteredContacts = filtered;
  }
  //Pagination Functionality
  get startIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  //Pagination Functionality To switch pages
  onPageChange(pageNumber: number) {
    this.currentPage = pageNumber;
    this.calculateIndexes();
  }

  //Pagination Functionality To calculate indexes
  calculateIndexes() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = this.currentPage * this.itemsPerPage;
    return { start, end };
  }

  //Pagination Functionality To get paginated contacts
  get paginatedContacts(): Contact[] {
    const { start, end } = this.calculateIndexes();
    return this.filteredContacts.slice(start, end);
  }

  //Pagination Functionality To get start of Show contacts
  get rangeStart(): number {
    return this.startIndex + 1;
  }

  //Pagination Functionality To get end of Show contacts
  get rangeEnd(): number {
    return Math.min(
      this.startIndex + this.itemsPerPage,
      this.filteredContacts.length
    );
  }
}