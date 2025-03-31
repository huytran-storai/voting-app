import { Component, Input , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { WalletService } from 'src/app/services/wallet.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-edit-wallet-modal',
  templateUrl: './edit-wallet-modal.component.html',
  styleUrls: ['./edit-wallet-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule], // <-- Thêm FormsModule
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EditWalletModalComponent {
  @Input() walletId!: string;
  walletData = { name: '', balance: "" };
  walletOld = { name: '', balance: "" };

  constructor(
    private modalController: ModalController,
    private walletService: WalletService
  ) {}

  ngOnInit() {
    this.walletService.getWalletById(this.walletId).subscribe((res: any) => {
      if (res.length > 0) {
        this.walletOld = res[0];
      }
    });
  }

  updateWallet() {
    if (this.walletData.name == "") {
      this.walletData.name = this.walletOld.name;
    }
    if (this.walletData.balance == "") {
      this.walletData.balance = this.walletOld.balance;
    }
    console.log('Dữ liệu gửi API:', this.walletData); // Kiểm tra dữ liệu
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

}
