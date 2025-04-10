import { Component, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { WalletService } from 'src/app/services/wallet.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-edit-trans-modal',
  templateUrl: './edit-trans-modal.component.html',
  styleUrls: ['./edit-trans-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EditTransModalComponent {
  @Input() dataTransi!: any;
  transactionsData = { note: '', amount: '' };

  constructor(
    private modalController: ModalController,
    private walletService: WalletService
  ) { }

  ngOnInit() {
  }

  updateWallet() {
    if (!this.transactionsData.note && !this.transactionsData.amount) {
      this.dismiss(true);
      return;
    }
    if (!this.transactionsData.note ) {
      this.transactionsData.note = this.dataTransi.note;
    }
    if (!this.transactionsData.amount ) {
      this.transactionsData.amount = this.dataTransi.amount;
    }

    const oldAmount = +this.dataTransi.amount;
    const newAmount = +this.transactionsData.amount;
    const diff = newAmount - oldAmount;
    const isExpense = this.dataTransi.status == 1;

    this.walletService.updateTransaction(this.dataTransi.id, this.transactionsData).subscribe(() => {
      this.walletService.getWalletById(this.dataTransi.wallet_id).subscribe((wallet: any) => {
        const walletData = wallet as any;
        let updatedBalance = +walletData[0].balance;
        if (isExpense) {
          updatedBalance -= diff;
        } else {
          updatedBalance += diff;
        }
        this.walletService.updateWallet(walletData[0].id, { balance: updatedBalance }).subscribe(() => {
          this.dismiss(true);
        });
      });
    });
  }



  dismiss(updated = false) {
    this.modalController.dismiss(updated);
  }

  onInputChangeNote() {
  }
  
  onInputChangeAmount() {
    let input = this.transactionsData.amount.toString().toLowerCase();
    input = input.replace(/[^0-9k]/g, '');
    let numericValue = parseFloat(input.replace('k', ''));
    if (isNaN(numericValue)) {
      this.transactionsData.amount = '';
      return;
    }
    if (input.includes('k')) {
      numericValue *= 1000;
    }
    this.transactionsData.amount = numericValue.toString() ;
  }
}
