import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, LoadingController, IonGrid, IonCard, IonCardContent, IonRow, IonCol, IonImg, IonText} from '@ionic/angular/standalone';
import { SPokemon } from 'src/app/services/spokemon';
import { IPokemon } from 'src/app/interfaces/Ipokemon';
import {JsonPipe} from '@angular/common';
import { IonButton, IonLoading } from '@ionic/angular/standalone';

@Component({
  selector: 'app-list-pokemons',
  templateUrl: './list-pokemons.page.html',
  styleUrls: ['./list-pokemons.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonGrid, IonCard, IonCardContent, IonRow, IonCol, IonImg, IonText, CommonModule, FormsModule, JsonPipe]
})
export class ListPokemonsPage {

  private pokemonService: SPokemon = inject(SPokemon);

  pokemons: IPokemon[] = [];
  constructor(private loadingController: LoadingController) { }

  ionViewWillEnter() {
    this.getMorePokemons();
  }

  async getMorePokemons() {
    const promisePokemons = this.pokemonService.getPokemons();
    if (promisePokemons) {
      const loading = await this.loadingController.create({
        message: 'Cargando pokemones...',
      });
      await loading.present();
      promisePokemons.then((pokemons: IPokemon[]) => {
        this.pokemons = this.pokemons.concat(pokemons);
      })
      .catch((error) => console.log(error))
      .finally(() => loading.dismiss());
    }
  }

}
