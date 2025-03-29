import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { WalletService } from '../services/wallet.service';

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
      name: ['', Validators.required],
      balance: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.walletId = params.get('id');
      this.loadWalletDetails();
      this.getTransactions();
    });
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
          console.log("Transactions:", data);
          this.transactions = data;
        },
        error: (err) => console.error("API Error:", err)
      });
    }
  }

  async addWallet(id: number) {
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
              this.confirmAdd(id);
            }
          }
        ]
      });
      await alert.present();
    } else {
      console.log('invalid form');
    }

  }

  confirmAdd(id: number) {
    console.log(`add vi: ${id}`);
  }

}
