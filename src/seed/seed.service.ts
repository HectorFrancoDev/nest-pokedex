import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interfaces';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  private readonly ENDPOINT = 'https://pokeapi.co/api/v2/pokemon?limit=650';

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter,
  ) {}

  /**
   * Populates the database
   * @returns void
   */
  async executeSeed() {
    // reset all elements in bd
    await this.pokemonModel.deleteMany({});

    // Fetch data from Endpoint
    const data: PokeResponse = await this.http.get<PokeResponse>(this.ENDPOINT);

    const pokemonToInsert: { name: string; no: number }[] = [];

    data.results.forEach(({ name, url }) => {
      const no: number = +url.split('/').at(-2);
      pokemonToInsert.push({ name, no });
    });

    // INSERT INTO POKEMONS NAME, NO
    await this.pokemonModel.insertMany(pokemonToInsert);

    return { message: 'Seed excuted' };
  }
}
