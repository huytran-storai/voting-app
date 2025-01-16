import { Injectable } from '@angular/core';
import { debounceTime, Subject, switchMap } from 'rxjs';
import { FakeApiService } from './fake-api.service';
@Injectable({
  providedIn: 'root'
})
export class VotingService {
  private searchSubject = new Subject<number>();
  private destroy$ = new Subject<void>();
  constructor(private fakeApi: FakeApiService) { }

  emitVote() {
    return this.searchSubject.pipe(
      debounceTime(300),
      switchMap(id => { return this.fakeApi.addVote(id); })
    );
  }

  vote(id: number) {
    this.searchSubject.next(id);
  }

  destroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
