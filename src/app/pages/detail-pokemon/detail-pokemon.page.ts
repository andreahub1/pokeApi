import { Component, OnInit, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, LoadingController, IonFab, IonFabButton, IonIcon, IonGrid, IonRow, IonCol, IonImg, IonText, IonProgressBar, IonCardContent, IonCardHeader, IonCardTitle, IonCard } from '@ionic/angular/standalone';
import { SPokemon } from 'src/app/services/spokemon';
import { IPokemon } from 'src/app/interfaces/ipokemon';
import { closeOutline } from 'ionicons/icons';
import {addIcons} from 'ionicons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detail-pokemon',
  templateUrl: './detail-pokemon.page.html',
  styleUrls: ['./detail-pokemon.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonFab, IonFabButton, IonIcon, IonGrid, IonRow, IonCol, IonImg, IonText, IonProgressBar, IonCardContent, IonCardHeader, IonCardTitle, IonCard]
})
export class DetailPokemonPage {

  @Input() id!: number;

  private servicioPokemon: SPokemon = inject(SPokemon);

  private loadingController: LoadingController = inject(LoadingController);

  private router: Router = inject(Router);
  pokemon!: IPokemon;

  constructor() {
    addIcons({
      closeOutline
    });
  }

  goBack() {
    this.router.navigate(['list-pokemons']);
  }

  async ionViewWillEnter() {
    let loading = await this.loadingController.create({
      message: 'Cargando detalles del Pokémon...',
    });
    loading.present();
    console.log('ID del Pokémon:', this.id);
    this.servicioPokemon.getPokemon(this.id)
    .then((pokemon: IPokemon) => this.pokemon = pokemon)
    .finally(() => {
      loading.dismiss();
    });
  }

}
