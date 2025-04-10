import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ToastController } from '@ionic/angular';
import { WalletService } from '../services/wallet.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [IonicModule, FormsModule, CommonModule],
  
})
export class AuthPage {
  password = '';

  constructor(private authService: WalletService,
    private router: Router,
    private toastCtrl: ToastController) {}

    verifyPassword() {
      const enteredPassword = this.password.trim();
      const hashedInput = CryptoJS.SHA256(enteredPassword).toString();
      console.log("hashedInput", hashedInput)
      this.authService.checkpass().subscribe({
        next: (res) => {
          const dbHash = res[0]?.pass.trim();
          if (hashedInput === dbHash) {
            localStorage.setItem('authTimestamp', Date.now().toString());
            this.router.navigate(['/home']);
          } else {
            this.showToast('❌ Sai mật khẩu!');
          }
        },
        error: (err) => {
          this.showToast('⚠️',);
        },
      });
    }
  
    async showToast(msg: string) {
      const toast = await this.toastCtrl.create({
        message: msg,
        duration: 2000,
        color: 'danger',
        position: 'top',
      });
      toast.present();
    }
}
