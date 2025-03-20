import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
  standalone: false,
})
export class DetailsPage implements OnInit {
  walletForm: FormGroup;

  constructor(private router: Router,
      private alert: AlertController,
      private fb: FormBuilder) { 
        this.walletForm = this.fb.group({
          name: ['', Validators.required], 
          balance: ['', [Validators.required, Validators.pattern(/^\d+$/)]], 
        });
      }

  ngOnInit() {
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
