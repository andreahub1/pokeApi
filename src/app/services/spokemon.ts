import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { IPokemon } from '../interfaces/ipokemon';

@Injectable({
  providedIn: 'root',
})
export class SPokemon {
  private readonly apiUrl = 'https://pokeapi.co/api/v2/pokemon';
  private nextUrl = `${this.apiUrl}?limit=20&offset=0`;

  getPokemons() {
    if (this.nextUrl) {
      return CapacitorHttp.get({url: this.nextUrl, params:{}})
      .then(async (response: HttpResponse) => {
        console.log("La respuesta es: ");
        console.log(response);
        // declaracion del tipo de dato retornar
        const pokemons: IPokemon[] = [];

        //confirma si tiene el atributo data
        if(response.data){
          const result:[] = response.data.results;
          this.nextUrl = response.data.next;
          const promises : Promise<HttpResponse>[] = [];
          result.forEach((result:any) => {
            const urlPokemon = result.url;
            promises.push(CapacitorHttp.get({url: urlPokemon, params:{}}));
          });

          await Promise.all(promises).then( (responses:any) => {
            const arrayResponses:[] = responses;

            //se itera sobre cada pokemon obtenido
            arrayResponses.forEach((respoPokemon:any) => {
              //se llama a la funcion
              const pokemon = this.processPokemon(respoPokemon.data);
              pokemons.push(pokemon);
            });
          });
        }
        return pokemons;
      })
    }
    return null;
  }

  getPokemon(id: number) {
    const ruta = `${this.apiUrl}/${id}`;
    return CapacitorHttp.get({url: ruta, params:{}})
    .then((response: HttpResponse) => this.processPokemon(response.data))

  }
  private processPokemon(pokemonData: any) {
    const pokemon: IPokemon = {
      id: pokemonData.id,
      name: pokemonData.name,
      type1: pokemonData.types[0].type.name,
      sprite: pokemonData.sprites.front_default,
      height: (pokemonData.height / 10).toString(),
      weight: (pokemonData.weight / 10).toString(),
      stats: pokemonData.stats.map((stat: any) =>{
        return {
          base_stat: stat.base_stat,
          name: stat.stat.name
        }
      }),
      abilities: pokemonData.abilities.filter((ability: any) => !ability.is_hidden).map((ability: any) => ability.ability.name),
    }
    if(pokemonData.types[1]){
      pokemon.type2 = pokemonData.types[1].type.name;
    }
    const hiddenAbility = pokemonData.abilities.find((ability: any) => ability.is_hidden)
    if(hiddenAbility){
      pokemon.hiddenAbility = hiddenAbility.ability.name;
    }
    return pokemon;
  }
}
