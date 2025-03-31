import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { WalletService } from '../services/wallet.service';
import { AbstractControl } from '@angular/forms';
@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
  standalone: false,
})
export class DetailsPage implements OnInit {
  walletForm: FormGroup;
  walletId: string | null = null;
  wallet: any;
  transactions: any[] = [];
  constructor(private route: ActivatedRoute, private router: Router,
    private walletService: WalletService,
    private alert: AlertController,
    private fb: FormBuilder) {
    this.walletForm = this.fb.group({
      note: ['', Validators.required],
      amount: ['', [Validators.required, this.customAmountValidator]],
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.walletId = params.get('id');
      this.loadWalletDetails();
      this.getTransactions();
    });
  }

  customAmountValidator(control: AbstractControl) {
    const value = control.value?.toString().toLowerCase();
    if (!value) return { required: true };
    const isValid = /^[0-9]+(\.?[0-9]*)?k?$/.test(value);
    return isValid ? null : { invalidAmount: true };
  }

  goBack() {
    this.router.navigate(['/']);
  }

  loadWalletDetails() {
    if (this.walletId) {
      this.walletService.getWalletById(this.walletId).subscribe(data => {
        this.wallet = data;
        this.walletForm.patchValue({
          name: this.wallet.name,
          balance: this.wallet.balance
        });
      });
    }
  }

  getTransactions() {
    if (this.walletId) {
      this.walletService.getTransactionsByWalletId(this.walletId).subscribe({
        next: (data) => { 
          this.transactions = data;
        },
        error: (err) => console.error("API Error:", err)
      });
    }
  }

  async addWallet(status: boolean) {
    if (this.walletForm.valid) {
      const alert = await this.alert.create({
        header: 'Xác nhận thêm ví',
        message: 'Bạn có chắc chắn muốn thêm ví không?',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            handler: () => {
              console.log('cancel');
            }
          },
          {
            text: 'Yes',
            handler: () => {
              this.addTransaction(status);
            }
          }
        ]
      });
      await alert.present();
    } else {
      console.log('invalid form');
    }
  }

  deleteTransaction(transaction: any) {
    if (!transaction || !this.walletId) return;
    const currentWallet = this.wallet.find((w: { id: string | null; }) => w.id === this.walletId);
    if (!currentWallet) return;
  
    if (transaction.status == 1) {
      currentWallet.balance += transaction.amount;
    } else if (transaction.status == 2) {
      currentWallet.balance -= transaction.amount;
    }
  
    this.transactions = this.transactions.filter(t => t.id !== transaction.id);
  
    this.walletService.deleteTransaction(transaction.id).subscribe({
      next: () => {
        if(!this.walletId) return
        this.walletService.updateWallet(this.walletId, { balance: currentWallet.balance }).subscribe({
          next: () => console.log('Wallet updated successfully'),
          error: (err) => console.error('Error updating wallet:', err)
        });
      },
      error: (err) => console.error('Error deleting transaction:', err)
    });
  }
  
  
  addTransaction(isExpense: boolean) {
    if (this.walletForm.valid) {
      const { note, amount } = this.walletForm.value;
      const status = isExpense ? 1 : 2; 
      const newBalance = isExpense ? this.wallet[0].balance - amount : this.wallet[0].balance + amount;
      if(this.walletId) {
        this.walletService.addTransaction(this.walletId, note, amount, status).subscribe({
          next: () => {
            if(this.walletId) {
              this.walletService.updateWalletBalance(this.walletId, newBalance).subscribe({
                next: () => {
                  this.wallet.balance = newBalance; 
                  this.loadWalletDetails();
                  this.getTransactions();
                  this.walletForm.reset();
                },
                error: (err) => console.error(err)
              });
            }
          },
          error: (err) => console.error(err)
        });
      }
    } else {
      console.log('');
    }
  }
  
  onAmountChange(event: any) {
    let inputValue = event.target.value.toLowerCase();
    let numericValue = parseFloat(inputValue.replace(/[^\d]/g, ''));
    if (inputValue.includes('k')) {
      numericValue *= 1000;
    }
    this.walletForm.controls['amount'].setValue(numericValue);
  }
}
