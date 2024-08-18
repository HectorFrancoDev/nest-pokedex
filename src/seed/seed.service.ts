import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interfaces';

@Injectable()
export class SeedService {
  // yarn add axios@0.27.2
  private readonly axios: AxiosInstance = axios;
  async executeSeed() {
    const { data } = await this.axios.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=1',
    );

    data.results.forEach(({ name, url }) => {
      const segments = url.split('/');
      const no: number = +segments.at(-2);
      console.log({ name, no });
    });

    return data;
  }
}
