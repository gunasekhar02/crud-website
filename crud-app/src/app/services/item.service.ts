import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Item {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private apiUrl = 'https://crud-backend-qeaj.onrender.com/api/items';

  constructor(private http: HttpClient) { }

  getItems(): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.apiUrl}/getItems`);
  }

  addItem(item: { name: string }): Observable<Item> {
    return this.http.post<Item>(`${this.apiUrl}/addItem`, item);
  }

  editItem(id: number, item: { name: string }): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/editItem/${id}`, item);
  }

  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteItem/${id}`);
  }
}
