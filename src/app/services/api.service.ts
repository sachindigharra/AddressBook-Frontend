import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8086';

  constructor(private http: HttpClient) { }

  getContacts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/contacts`);
  }

  addContact(contact: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/contacts`, contact); // Adjust endpoint if needed
  }
}