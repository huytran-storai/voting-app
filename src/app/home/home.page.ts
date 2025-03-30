import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Pet } from '../interfaces/pets.interfaces';
import { FakeApiService } from '../services/fake-api.service';
import { SearchItemService } from '../services/search-item.service';
import { VotingService } from '../services/voting.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WalletService } from '../services/wallet.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  data: Pet[] = [];
  loading = false;
  loadingVote = false;
  isModalOpen = false;
  walletName = '';
  walletAmount: number | null = null;
  walletForm: FormGroup;
  private destroy$ = new Subject<void>();
  dataWallet: any[] = [];
  getWallets: any;
  totals: any = 0;

  constructor(public fakeApi: FakeApiService,
    public searchS: SearchItemService,
    public walletS: WalletService,
    public voteS: VotingService,
    private router: Router,
    private alert: AlertController,
    private fb: FormBuilder) {
    this.walletForm = this.fb.group({
      name: ['', Validators.required],
      balance: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
    });
  }

  ngOnInit(): void {
    this.loadData();

    this.voteS.emitVote().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => { this.data = data; this.loadingVote = false; },
      error: (err) => { this.loadingVote = false; },
    });

    this.searchS.searchPets().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => { this.data = data; this.loading = false; },
      error: (err) => { this.loading = false; },
    });
  }


  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.searchS.destroy();
  }

  ionViewWillEnter() {
    this.loadData();
  }

  loadData() {
    this.walletS.getWallets().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.dataWallet = data;
        this.totals = this.dataWallet.reduce((sum, wallet) => sum + wallet.balance, 0);
      },
      error: (err) => { console.error(err); }
    })

    // this.fakeApi.getListPet().pipe(takeUntil(this.destroy$))
    //   .subscribe({
    //     next: (data) => { this.data = data; },
    //     error: (err) => { console.error(err); },
    //   });
  }

  goDetail(wallet: any) {
    // this.router.navigate(['/details'])
    this.router.navigate(['/details', { id: wallet.id }]);
  }

  async deleteWallet(id: string) {
    const alert = await this.alert.create({
      header: 'Xác nhận xóa',
      message: 'Bạn có chắc chắn muốn xóa ví này?',
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
            this.confirmDelete(id);
          }
        }
      ]
    });

    await alert.present();
  }

  confirmDelete(walletId: string) {
    if (!walletId) return;

    this.walletS.deleteWallet(walletId).subscribe({
      next: () => {
        this.dataWallet = this.dataWallet.filter(w => w.id !== walletId);
        this.loadData();
      },
      error: (err) => console.error('Lỗi khi xoá ví:', err)
    });
  }

  async addWallet() {
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
              this.createWallet();
            }
          }
        ]
      });
      await alert.present();
    } else {
      alert("Liên hệ sỹ huy");
    }
  }

  createWallet() {
    if (this.walletForm.valid) {
      const newWallet = this.walletForm.value;

      this.walletS.addWallet(newWallet).subscribe({
        next: (res) => {
          this.loadData();
          this.walletForm.reset();
        },
        error: (err) => {
          alert("Liên hệ sỹ huy");
          console.error('Lỗi khi thêm ví:', err);
        }
      });
    }
  }

  onSearchChange(event: CustomEvent) {
    const value = event.detail.value;
    this.loading = true;
    this.searchS.search(value);
  }

  onVote(id: number) {
    this.loadingVote = true;
    this.voteS.vote(id);
    this.voteS.destroy();
  }

}
