import { Pokemon, Species } from "./schema";

const NUM_STARTER_POKEMON = 30;

/**
 * Creates the given number of random Pokemon (default: 30) for the given user. Uses a
 * higher-than-default shiny chance.
 *
 * @param {*} ownerId the id of the user
 * @param {*} numPokemon the number of pokemon to create
 */
export async function createStartingPokemonForUser(ownerId, numPokemon = NUM_STARTER_POKEMON) {
  const promises = [];
  for (let i = 0; i < numPokemon; i++) {
    promises.push(createRandomPokemon(ownerId, 0.1));
  }
  await Promise.all(promises);
}

/**
 * Creates a single random pokemon
 *
 * @param {*} ownerId the id of the owner
 * @param {*} shinyChance the chance of the pokemon being shiny
 * @returns the pokemon
 */
export async function createRandomPokemon(ownerId, shinyChance = 0.01) {
  const allSpecies = await Species.find({});
  const index = Math.floor(Math.random() * allSpecies.length);
  return await createPokemon(ownerId, allSpecies[index]._id, shinyChance);
}

/**
 * Creates a single pokemon of the given species
 *
 * @param {*} ownerId the owner's id
 * @param {*} speciesId the species' id
 * @param {*} shinyChance the chance to be shiny
 * @returns the pokemon
 */
export async function createPokemon(ownerId, speciesId, shinyChance = 0.01) {
  const isShiny = Math.random() <= shinyChance;

  const species = await Species.findById(speciesId);
  if (!species) throw "Invalid species id";

  const pokemon = await Pokemon.create({
    species: speciesId,
    nickname: species.name,
    isShiny,
    owner: ownerId,
  });

  return pokemon;
}

/**
 * Gets a single pokemon
 *
 * @param {*} id the id of the pokemon to retrieve
 * @returns the pokemon with its "species" data populated, or null if not found
 */
export function retrievePokemonById(id) {
  return Pokemon.findById(id).populate("species");
}

/**
 * Gets pokemon for the given user
 *
 * @param {*} ownerId the user whose pokemon to fetch
 * @returns the list of matching pokemon (an empty array if no matches)
 */
export function retrievePokemonForUser(ownerId) {
  return Pokemon.find({ owner: ownerId }).populate("species");
}

//Task1
export async function updatePokemonFavoriteStatus(id, favoriteState) {

  await Pokemon.findByIdAndUpdate({ _id: id }, { $set:{ isFavourite: favoriteState } });

}

//Task3
export function retrieveFavoritePokemonForUser(ownerId) {
  return Pokemon.find({ owner: ownerId, isFavourite: true }).populate("species");
}
