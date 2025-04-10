import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  private apiUrl = 'https://okxpjxpgyuevhpjsryzk.supabase.co/rest/v1/wallets';
  private apiUrlTransi = 'https://okxpjxpgyuevhpjsryzk.supabase.co/rest/v1/transactions';
  private apiUrlStats = 'https://okxpjxpgyuevhpjsryzk.supabase.co/rest/v1/transaction_stats';
  private apiUrlSumMonth = 'https://okxpjxpgyuevhpjsryzk.supabase.co/rest/v1/summary_table';
  private headers = {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9reHBqeHBneXVldmhwanNyeXprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1NjIyNzIsImV4cCI6MjA1ODEzODI3Mn0.jfzK-24_uVWblQ1DgjqxUciPfONpK5OEYILv5QZeFjA',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9reHBqeHBneXVldmhwanNyeXprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1NjIyNzIsImV4cCI6MjA1ODEzODI3Mn0.jfzK-24_uVWblQ1DgjqxUciPfONpK5OEYILv5QZeFjA',
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };

  constructor(private http: HttpClient) { }
  //wallets table
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

  getWalletById(id: string) {
    return this.http.get(`${this.apiUrl}?id=eq.${id}`, { headers: this.headers });
  }
  //transactions table
  getTransactionsByWalletId(walletId: string): Observable<any> {
    return this.http.get(`${this.apiUrlTransi}?wallet_id=eq.${walletId}`, { headers: this.headers });
  }

  addTransaction(walletId: string, note: string, amount: number, status: number, created_at: string): Observable<any> {
    const data = { wallet_id: walletId, note, amount, status, created_at };
    return this.http.post(`${this.apiUrlTransi}`, data, { headers: this.headers });
  }

  // update wallet by transaction
  updateWalletBalance(walletId: string, newBalance: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}?id=eq.${walletId}`, { balance: newBalance }, { headers: this.headers });
  }

  updateTransaction(id: string, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrlTransi}?id=eq.${id}`, data, { headers: this.headers });
  }

  deleteTransaction(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrlTransi}?id=eq.${id}`, { headers: this.headers });
  }
  //get statistical table
  getTransactionStats(walletId: string): Observable<any> {
    return this.http.get(`${this.apiUrlStats}?wallet_id=eq.${walletId}`, { headers: this.headers });
  }

  getSum(): Observable<any> {
    return this.http.get(`${this.apiUrlSumMonth}?select=*`, { headers: this.headers });
  }

}
