import mongoose from "mongoose";

const Schema = mongoose.Schema;

/**
 * Schema for a particular species of pokemon. There can be multiple pokemon of the same species.
 */
const speciesSchema = new Schema({
  dexNumber: { type: Number, required: true },
  name: { type: String, required: true },
  image: {
    type: {
      thumbnail: {
        type: {
          normal: { type: String, required: true },
          shiny: { type: String, required: true },
        },
        required: true,
      },
      normal: { type: String, required: true },
      shiny: { type: String, required: true },
    },
    required: true,
  },
  dexEntry: { type: String, required: true },
});

/**
 * Schema for a user of the system. Users can own multiple pokemon.
 */
const userSchema = new Schema({
  username: { type: String, unique: true, required: true },
  passHash: { type: String, required: true },
});

/**
 * Schema for a pokemon. Pokemon have a species and an owner.
 */
const pokemonSchema = new Schema({
  species: { type: mongoose.Schema.Types.ObjectId, ref: "Species", required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  nickname: { type: String, required: true },
  isShiny: { type: Boolean, default: false },
  isFavourite: { type: Boolean, default: false },
});

const Species = mongoose.model("Species", speciesSchema);
const User = mongoose.model("User", userSchema);
const Pokemon = mongoose.model("Pokemon", pokemonSchema);

export { Species, User, Pokemon };
