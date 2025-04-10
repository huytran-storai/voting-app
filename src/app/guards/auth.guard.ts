import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const timestamp = localStorage.getItem('authTimestamp');
    const now = new Date().getTime();

    if (timestamp && now - +timestamp < 10 * 60 * 1000) {
      return true;
    } else {
      this.router.navigate(['/auth']);
      return false;
    }
  }
}
