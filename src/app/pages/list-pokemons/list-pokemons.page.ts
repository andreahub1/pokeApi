import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, LoadingController, IonGrid, IonCard, IonCardContent, IonRow, IonCol, IonImg, IonText, InfiniteScrollCustomEvent} from '@ionic/angular/standalone';
import { SPokemon } from 'src/app/services/spokemon';
import { IPokemon } from 'src/app/interfaces/ipokemon';
import {JsonPipe} from '@angular/common';
import { IonButton, IonLoading, IonInfiniteScroll, IonInfiniteScrollContent} from '@ionic/angular/standalone';

@Component({
  selector: 'app-list-pokemons',
  templateUrl: './list-pokemons.page.html',
  styleUrls: ['./list-pokemons.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonGrid, IonCard, IonCardContent, IonRow, IonCol, IonImg, IonText, CommonModule, FormsModule, JsonPipe, IonInfiniteScroll, IonInfiniteScrollContent, IonButton, IonLoading]
})
export class ListPokemonsPage {

  private pokemonService: SPokemon = inject(SPokemon);

  private loadingController: LoadingController = inject(LoadingController);

  private router: Router = inject(Router);

  pokemons: IPokemon[] = [];
  constructor() { }

  ionViewWillEnter() {
    this.getMorePokemons();
  }

  goToPage(pokemon: IPokemon) {
  this.router.navigate(['/detail-pokemon', pokemon.id]);
}

  async getMorePokemons(event?: InfiniteScrollCustomEvent) {
    const promisePokemons = this.pokemonService.getPokemons();
    if (promisePokemons) {
      let loading:any;
      if(!event){
        loading = await this.loadingController.create({
          message: 'Cargando pokemones...',
        });
        await loading.present();
      }
      promisePokemons.then((pokemons: IPokemon[]) => {
        this.pokemons = this.pokemons.concat(pokemons);
      })
      .catch((error) => console.log(error))
      .finally(() =>{
        loading?.dismiss()
        event?.target.complete();
      });
    }
  }

}
