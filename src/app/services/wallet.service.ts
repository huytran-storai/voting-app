import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  private apiUrl = 'https://okxpjxpgyuevhpjsryzk.supabase.co/rest/v1/wallets';
  private headers = {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9reHBqeHBneXVldmhwanNyeXprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1NjIyNzIsImV4cCI6MjA1ODEzODI3Mn0.jfzK-24_uVWblQ1DgjqxUciPfONpK5OEYILv5QZeFjA',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9reHBqeHBneXVldmhwanNyeXprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1NjIyNzIsImV4cCI6MjA1ODEzODI3Mn0.jfzK-24_uVWblQ1DgjqxUciPfONpK5OEYILv5QZeFjA',
    'Content-Type': 'application/json',
  };

  constructor(private http: HttpClient) {}

  getWallets(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.headers });
  }

  addWallet(wallet: any): Observable<any> {
    return this.http.post(this.apiUrl, wallet, { headers: this.headers });
  }

  updateWallet(id: string, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}?id=eq.${id}`, data, { headers: this.headers });
  }

  deleteWallet(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}?id=eq.${id}`, { headers: this.headers });
  }
}
