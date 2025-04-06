import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  contacts: any[] = [];
  showAddForm: boolean = false; // For Add Person form
  showEditForm: boolean = false; // For Edit form
  addPersonForm: FormGroup;
  editPersonForm: FormGroup;
  selectedContact: any = null; // Store the contact being edited so that if any error data don't loss
  private apiService = inject(ApiService);
  private fb = inject(FormBuilder);
  id:number=0;

  constructor() {
    // Initialize the Add Person form
    this.addPersonForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      city: ['', Validators.required]
    });

    // Initialize the Edit form
    this.editPersonForm = this.fb.group({
      id: ['', Validators.required], // Hidden field for the contact ID we have not authority to edit Id of user
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      city: ['', Validators.required]
    });
    
  }

  ngOnInit() {
    this.loadContacts();
  }

  // Load contacts from API
  loadContacts() {
    this.apiService.getContacts().subscribe({
      next: (data) => {
        this.contacts = data;
        console.log('Contacts:', this.contacts);
      },
      error: (err) => {
        console.error('Error fetching contacts:', err);
      }
    });
  }

  // Toggle Add Person form
  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.addPersonForm.reset();
    }
  }

  // Toggle Edit form and pre-fill with contact data
  toggleEditForm(contact: any) {
    this.selectedContact = contact;
    this.showEditForm = !this.showEditForm;
    if (this.showEditForm) {
      // Pre-fill the form with the contact's data
      this.editPersonForm.patchValue({
        id: contact.id, // Assuming the contact has an ID
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        city: contact.city
      });
    } else {
      this.editPersonForm.reset();
      this.selectedContact = null;
    }
  }

  // Submit the Add Person form
  onAddSubmit() {
    if (this.addPersonForm.valid) {
      const newContact = this.addPersonForm.value;
      this.apiService.addContact(newContact).subscribe({
        next: () => {
          this.loadContacts();
          this.toggleAddForm();
        },
        error: (err) => {
          console.error('Error adding contact:', err);
        }
      });
    }
  }

  // Submit the Edit form
  onEditSubmit() {
    if (this.editPersonForm.valid) {
      const updatedContact = this.editPersonForm.value;
      console.log('Updated contact:', updatedContact);
      if (!updatedContact.id) {
        console.error('Contact ID is missing or invalid');
        return;
      }
      // Exclude the id field from the request body
      const { id, ...contactData } = updatedContact;
      this.apiService.updateContact(updatedContact.id, contactData).subscribe({
        next: (response) => {
          console.log('Update successful, response:', response);
          this.loadContacts(); // Refresh the contact list
          this.toggleEditForm(null); // Close the form
        },
        error: (err) => {
          console.error('Error updating contact:', err.message || err);
        }
      });
    }
  }
}