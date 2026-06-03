import { Component, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { WalletService } from 'src/app/services/wallet.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, DecimalPipe } from '@angular/common';
@Component({
  selector: 'app-edit-trans-modal',
  templateUrl: './edit-trans-modal.component.html',
  styleUrls: ['./edit-trans-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule, DecimalPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EditTransModalComponent {
  @Input() dataTransi!: any;
  transactionsData = { note: '', amount: '' };
  selectedStatus = 1;

  constructor(
    private modalController: ModalController,
    private walletService: WalletService
  ) { }

  ngOnInit() {
    this.selectedStatus = +this.dataTransi.status;
  }

  updateWallet() {
    if (!this.transactionsData.note) {
      this.transactionsData.note = this.dataTransi.note;
    }
    if (!this.transactionsData.amount) {
      this.transactionsData.amount = this.dataTransi.amount;
    }

    const oldAmount = +this.dataTransi.amount;
    const newAmount = +this.transactionsData.amount;
    const oldStatus = +this.dataTransi.status;
    const newStatus = this.selectedStatus;

    let balanceDelta = 0;
    if (oldStatus === newStatus) {
      const diff = newAmount - oldAmount;
      balanceDelta = oldStatus === 1 ? -diff : diff;
    } else if (oldStatus === 1 && newStatus === 2) {
      // expense → income: hoàn lại chi cũ + cộng thu mới
      balanceDelta = oldAmount + newAmount;
    } else {
      // income → expense: hoàn lại thu cũ - trừ chi mới
      balanceDelta = -(oldAmount + newAmount);
    }

    const payload = { ...this.transactionsData, status: newStatus };
    this.walletService.updateTransaction(this.dataTransi.id, payload).subscribe(() => {
      this.walletService.getWalletById(this.dataTransi.wallet_id).subscribe((wallet: any) => {
        const updatedBalance = +wallet[0].balance + balanceDelta;
        this.walletService.updateWallet(wallet[0].id, { balance: updatedBalance }).subscribe(() => {
          this.dismiss(true);
        });
      });
    });
  }

  dismiss(updated = false) {
    this.modalController.dismiss(updated);
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
    this.transactionsData.amount = numericValue.toString();
  }
}
