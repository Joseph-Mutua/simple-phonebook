import { Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { Contact } from '../interfaces/contacts.model';
import { SharedModule } from '../shared/shared.module';
import { ContactsService } from '../services/contacts.service';
import { StateService } from '../services/state.service';
import { v4 as uuidv4 } from 'uuid';

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
  showUpdateContactModal = false;
  showReadContactModal = false;
  showDeleteContactModal = false;
  allChecked: boolean = false;

  selectedContact: Contact = {
    id: '',
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
  };

  constructor(
    private contactsService: ContactsService,
    private stateService: StateService,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.contactsService.getContacts();
    this.stateService.contacts.subscribe((contacts) => {
    this.contactListings = contacts;

  
      contacts.sort((a, b) => {
        let comparison = a.first_name.localeCompare(b.first_name);
        if (comparison === 0) {
          comparison = a.last_name.localeCompare(b.last_name);
        }
        return comparison;
      });

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

  @ViewChild('dropdownContainer')
  dropdownContainer!: ElementRef;

  ngAfterViewInit() {
    this.renderer.listen('document', 'click', (event: Event) => {
      if (!this.dropdownContainer.nativeElement.contains(event.target)) {
        this.dropdownVisible.fill(false); // Close all dropdowns
      }
    });
  }

  isGridView: boolean = false;

  toggleView() {
    this.isGridView = !this.isGridView;
  }

  openUpdateContactModal(contact: Contact): void {
    this.selectedContact = contact;
    this.showUpdateContactModal = true;
  }

  closeUpdateContactModal(): void {
    this.showUpdateContactModal = false;
  }

  openReadContactModal(contact: Contact): void {
    this.selectedContact = contact;
    this.showReadContactModal = true;
  }

  closeReadContactModal(): void {
    this.showReadContactModal = false;
  }

  openDeleteContactModal(contact: Contact): void {
    this.selectedContact = contact;
    this.showDeleteContactModal = true;
  }

  closeDeleteContactModal(): void {
    this.showDeleteContactModal = false;
  }

  openCreateContactModal(): void {
    this.isCreateModalOpen = true;
  }

  closeCreateContactModal(): void {
    this.isCreateModalOpen = false;
  }

  //Create New Contact
  addNewContact(): void {
    const firstName = (document.getElementById('firstName') as HTMLInputElement)
      .value;
    const lastName = (document.getElementById('lastName') as HTMLInputElement)
      .value;
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const phoneNumber = (
      document.getElementById('phoneNumber') as HTMLInputElement
    ).value;


    const id = uuidv4();

    const newContact: Contact = {
      id: id,
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone_number: phoneNumber,
    };


    this.stateService.addContact(newContact);


    this.closeCreateContactModal();
  }

  //Update Contact
  updateContact(): void {

    const firstName = (
      document.getElementById('updateFirstName') as HTMLInputElement
    ).value;
    const lastName = (
      document.getElementById('updateLastName') as HTMLInputElement
    ).value;
    const email = (document.getElementById('updateEmail') as HTMLInputElement)
      .value;
    const phoneNumber = (
      document.getElementById('updatePhoneNumber') as HTMLInputElement
    ).value;

    const updatedContact: Contact = {
      id: this.selectedContact?.id,
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone_number: phoneNumber,
    };


    this.stateService.updateContact(updatedContact);


    this.closeUpdateContactModal();
  }

  //Delete Contact
  deleteContact(): void {
    // Delete contact via service
    this.stateService.deleteContact(this.selectedContact.id);

    // Close the modal
    this.closeDeleteContactModal();
  }

  deleteSelectedContacts() {
    // new array that contains only the contacts that are not selected
    const newContacts = this.filteredContacts.filter(
      (contact) => !contact.selected
    );

    // Update the stateService
    this.stateService.updateContacts(newContacts);
  }

  //Search input function
  onSearchChange(searchKeyword: string) {
    this.searchKeyword = searchKeyword;
    this.filterContacts();
  }

  // Function to check/uncheck all checkboxes
  selectAll(event: Event) {
    let isChecked = (event.target as HTMLInputElement).checked;
    this.paginatedContacts.forEach((contact) => {
      contact.selected = isChecked;
    });
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

    // Sort the filtered array
    filtered.sort((a, b) => {
      // Compare first names
      let comparison = a.first_name.localeCompare(b.first_name);

      // If first names are equal, compare last names
      if (comparison === 0) {
        comparison = a.last_name.localeCompare(b.last_name);
      }

      return comparison;
    });

    // Assign the sorted array to filteredContacts
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
