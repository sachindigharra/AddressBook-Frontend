import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; // Import Reactive Forms
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // Add ReactiveFormsModule
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  contacts: any[] = [];
  showForm: boolean = false; // Toggle form visibility
  addPersonForm: FormGroup; // Form group for the add person form
  private apiService = inject(ApiService);
  private fb = inject(FormBuilder); // Inject FormBuilder

  constructor() {
    // Initialize the form with validators
    this.addPersonForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      city: ['', Validators.required]
    });
    this.contacts=[
      { "name": "Varaza Mishra", "email": "varaza@example.com", "phone": "0228017752", "city": "Mumbai" },
      { "name": "Trishna Bhalla", "email": "trishna@example.com", "phone": "02232420607", "city": "Mumbai" }
    ]
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

  // Toggle form visibility
  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.addPersonForm.reset(); // Reset form when closing
    }
  }

  // Submit the form
  onSubmit() {
    if (this.addPersonForm.valid) {
      const newContact = this.addPersonForm.value;
      this.apiService.addContact(newContact).subscribe({
        next: () => {
          this.loadContacts(); // Refresh the contact list
          this.toggleForm(); // Close the form
        },
        error: (err) => {
          console.error('Error adding contact:', err);
        }
      });
    }
  }
  
}