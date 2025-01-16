import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Pet } from '../interfaces/pets.interfaces';
import { FakeApiService } from '../services/fake-api.service';
import { SearchItemService } from '../services/search-item.service';
import { VotingService } from '../services/voting.service';
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
  private destroy$ = new Subject<void>();
  constructor(public fakeApi: FakeApiService, public searchS : SearchItemService, public voteS : VotingService) { }

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

  getVoteHaveTheMost() {
    
  }
}
