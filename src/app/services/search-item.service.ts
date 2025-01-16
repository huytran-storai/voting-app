import { Injectable } from '@angular/core';
import { debounceTime, Subject, switchMap } from 'rxjs';
import { FakeApiService } from './fake-api.service';
@Injectable({
  providedIn: 'root'
})
export class SearchItemService {
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();
  
  constructor(private fakeApi: FakeApiService) { }
 
  searchPets() {
    return this.searchSubject.pipe(
      debounceTime(300),
      switchMap(value => {
        return this.fakeApi.searchPets(value);
      })
    );
  }

  search(value: string) {
    this.searchSubject.next(value);
  }

  destroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
