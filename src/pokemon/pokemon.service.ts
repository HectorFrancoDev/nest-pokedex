import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  /**
   * Creates a new Pokemon
   * @param createPokemonDto
   * @returns
   */
  async create(createPokemonDto: CreatePokemonDto) {
    try {
      createPokemonDto.name = createPokemonDto.name.toLowerCase();
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleException(error);
    }
  }

  /**
   *
   * @returns
   */
  findAll() {
    return `This action returns all pokemon`;
  }

  /**
   * Find a Pokemon based in the term (name, number, MongoID)
   * @param term string term to find Pokemon
   * @returns Pokemon
   */
  async findOne(term: string) {
    let pokemon: Pokemon;

    // Find Pokemon based in number
    if (!isNaN(+term)) pokemon = await this.pokemonModel.findOne({ no: term });

    // Find Pokemon based in MongoID
    if (isValidObjectId(term)) pokemon = await this.pokemonModel.findById(term);

    // Find Pokemon based in name
    if (!pokemon)
      pokemon = await this.pokemonModel.findOne({
        name: term.toLocaleLowerCase().trim(),
      });

    // If there is no pokemon
    if (!pokemon)
      throw new NotFoundException(`Pokemon with id or name ${term} not found`);

    return pokemon;
  }

  /**
   * Updates a Pokemon based in the term of search and
   * the body data
   * @param term string
   * @param updatePokemonDto UpdatePokemonDto
   * @returns
   */
  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);

    if (updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase().trim();

    try {
      await pokemon.updateOne(updatePokemonDto);
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      this.handleException(error);
    }
  }

  /**
   * Deletes a Pokemon by Mongo ID
   * @param id string
   * @returns void
   */
  async remove(id: string) {
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });
    if (deletedCount === 0)
      throw new BadRequestException(`Pokemon with id ${id} not found`);
    return;
  }

  /**
   * Handle exeptions of requests
   * @param error
   */
  private handleException(error: any) {
    if (error.code === 11000)
      throw new BadRequestException(
        `Pokemon already exist in db ${JSON.stringify(error.keyValue)}`,
      );

    throw new InternalServerErrorException('Cannot create Pokemon');
  }
}
