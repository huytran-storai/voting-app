import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Pet } from '../interfaces/pets.interfaces';
@Injectable({
  providedIn: 'root'
})
export class FakeApiService {
  private pets: Pet[] = [
    { id: 1, name: 'Bulbasaur', votes: 0 },
    { id: 2, name: 'Charmander', votes: 0 },
    { id: 3, name: 'Squirtle', votes: 0 },
    { id: 4, name: 'Pikachu', votes: 0 },
    { id: 5, name: 'Eevee', votes: 0 },
  ];
  constructor() { }

  getListPet() {
    return of(this.pets);
  }

  searchPets(value: string) {
    console.log("=====> emit search");
    const filteredPets = this.pets.filter(pet => pet.name.toLowerCase().includes(value.toLowerCase()));
    return of(filteredPets).pipe(delay(1000));
  }

  addVote(id: number) {
    console.log("=====> emit addVote", id);
    const pet = this.pets.find(pet => pet.id === id);
    if (pet) { pet.votes++; }
    return of(this.pets);
  }

}
