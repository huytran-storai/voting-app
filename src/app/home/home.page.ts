import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Pet } from '../interfaces/pets.interfaces';
import { FakeApiService } from '../services/fake-api.service';
import { SearchItemService } from '../services/search-item.service';
import { VotingService } from '../services/voting.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  constructor(public fakeApi: FakeApiService, 
    public searchS : SearchItemService, 
    public voteS : VotingService, 
    private router: Router,
    private alert: AlertController,
    private fb: FormBuilder) { 
      this.walletForm = this.fb.group({
        name: ['', Validators.required], 
        balance: ['', [Validators.required, Validators.pattern(/^\d+$/)]], 
      });
    }

  ngOnInit(): void {
    this.loadData();

    this.voteS.emitVote().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => { this.data = data; this.loadingVote = false;},
      error: (err) => { this.loadingVote = false; },
    });

    this.searchS.searchPets().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => { this.data = data; this.loading = false; },
      error: (err) => {this.loading = false;},});
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.searchS.destroy();
  }

  loadData() {
    this.fakeApi.getListPet().pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => { this.data = data; },
        error: (err) => { console.error(err); },
      });
  }

  goDetail(){
    this.router.navigate(['/details'])
  }

  async deleteWallet(id: number) {
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

  confirmDelete(id: number) {
    console.log(`del: ${id}`);
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
