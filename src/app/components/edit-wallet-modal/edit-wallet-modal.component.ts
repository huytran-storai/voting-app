import { Component, Input , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { WalletService } from 'src/app/services/wallet.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-edit-wallet-modal',
  templateUrl: './edit-wallet-modal.component.html',
  styleUrls: ['./edit-wallet-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EditWalletModalComponent {
  @Input() walletId!: string;
  @Input() showWallet!: string;
  showTransactions = false;
  walletData = { name: '', balance: "" };
  walletOld = { name: '', balance: "" };
  transactionsOld = { note: '', amount: "" };
  transactionsData = { note: '', amount: "" };

  constructor(
    private modalController: ModalController,
    private walletService: WalletService
  ) {}

  ngOnInit() {
    if (this.showWallet) {
      this.walletService.getWalletById(this.walletId).subscribe((res: any) => {
        if (res.length > 0) {
          this.walletOld = res[0];
        }
      });
    }
  }

  updateWallet() {
    if (!this.walletData.name && !this.walletData.balance) {
      this.dismiss(true);
      return;
    }
    if (!this.walletData.name) {
      this.walletData.name = this.walletOld.name;
    }
    if (!this.walletData.balance) {
      this.walletData.balance = this.walletOld.balance;
    }

    this.walletService.updateWallet(this.walletId, this.walletData).subscribe(() => {
      this.dismiss(true);
    });
  }

  dismiss(updated = false) {
    this.modalController.dismiss(updated);
  }

  onInputChange() {
    console.log('Dữ liệu mới:', this.walletData);
  }
  onInputChangeName() {
  }
  
  onInputChangeBalance() {
    let input = this.walletData.balance.toString().toLowerCase();
    input = input.replace(/[^0-9k]/g, '');
    let numericValue = parseFloat(input.replace('k', ''));
    if (isNaN(numericValue)) {
      this.walletData.balance = '';
      return;
    }
    if (input.includes('k')) {
      numericValue *= 1000;
    }
    this.walletData.balance = numericValue.toString() ;
  }

}
