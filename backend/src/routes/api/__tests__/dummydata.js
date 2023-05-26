/**
 * This file contains dummy data which are used in the unit tests.
 */

import mongoose from "mongoose";
import jwt from "jsonwebtoken";

// Users
// -------------------------------------------------------------------------

// A user: Alice (password is 12345)
const userAlice = {
  _id: new mongoose.Types.ObjectId("000000000000000000000001"),
  username: "Alice",
  passHash: "$2b$10$pjqtiIkTIOOt01SyxxqSQeIoTnNhjd31o7ItCbVMULUlCmCMekzk6",
};

// A valid JWT token indicating Alice is authenticated
const tokenAlice = jwt.sign(
  { _id: "000000000000000000000001", username: "Alice" },
  process.env.JWT_KEY,
  { expiresIn: "7d" }
);
const bearerAlice = `Bearer ${tokenAlice}`;

// A user: Bob (password is 12345)
const userBob = {
  _id: new mongoose.Types.ObjectId("000000000000000000000002"),
  username: "Bob",
  passHash: "$2b$10$pjqtiIkTIOOt01SyxxqSQeIoTnNhjd31o7ItCbVMULUlCmCMekzk6",
};

// A valid JWT token indicating Bob is authenticated
const tokenBob = jwt.sign(
  { _id: "000000000000000000000002", username: "Bob" },
  process.env.JWT_KEY,
  { expiresIn: "7d" }
);
const bearerBob = `Bearer ${tokenBob}`;

// A user: Dave (password is 12345)
const userDave = {
  _id: new mongoose.Types.ObjectId("000000000000000000000008"),
  username: "Dave",
  passHash: "$2b$10$pjqtiIkTIOOt01SyxxqSQeIoTnNhjd31o7ItCbVMULUlCmCMekzk6",
};

// A valid JWT token indicating Dave is authenticated
const tokenDave = jwt.sign(
  { _id: "000000000000000000000008", username: "Dave" },
  process.env.JWT_KEY,
  { expiresIn: "7d" }
);
const bearerDave = `Bearer ${tokenDave}`;
// -------------------------------------------------------------------------

// Species
// -------------------------------------------------------------------------

// Bulbasaur
const speciesBulbasaur = {
  _id: new mongoose.Types.ObjectId("000000000000000000000003"),
  dexNumber: 1,
  name: "Bulbasaur",
  image: {
    thumbnail: {
      normal: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
      shiny: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/1.png",
    },
    normal:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/1.png",
    shiny:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/1.png",
  },
  dexEntry:
    "While it is young, it uses the nutrients that are stored in the seed on its back in order to grow.",
};

// Mewtwo
const speciesMewtwo = {
  _id: new mongoose.Types.ObjectId("000000000000000000000004"),
  dexNumber: 150,
  name: "Mewtwo",
  image: {
    thumbnail: {
      normal: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png",
      shiny:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/150.png",
    },
    normal:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/150.png",
    shiny:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/150.png",
  },
  dexEntry:
    "Its DNA is almost the same as Mew’s. However, its size and disposition are vastly different.",
};
// -------------------------------------------------------------------------

// Pokemon
// -------------------------------------------------------------------------

// Alice's Bulbasaur
const pokemonAlicesBulbasaur = {
  _id: new mongoose.Types.ObjectId("000000000000000000000005"),
  owner: new mongoose.Types.ObjectId("000000000000000000000001"),
  species: new mongoose.Types.ObjectId("000000000000000000000003"),
  nickname: "Alice's Bulbasaur",
  isShiny: true,
};

// Bob's Bulbasaur
const pokemonBobsBulbasaur = {
  _id: new mongoose.Types.ObjectId("000000000000000000000006"),
  owner: new mongoose.Types.ObjectId("000000000000000000000002"),
  species: new mongoose.Types.ObjectId("000000000000000000000003"),
  nickname: "BOBasaur",
  isShiny: false,
};

// Bob's Mewtwo
const pokemonBobsMewtwo = {
  _id: new mongoose.Types.ObjectId("000000000000000000000007"),
  owner: new mongoose.Types.ObjectId("000000000000000000000002"),
  species: new mongoose.Types.ObjectId("000000000000000000000004"),
  nickname: "Bob's Mewtwo",
  isShiny: false,
};
// -------------------------------------------------------------------------

async function addDummyUsers() {
  const usersC = mongoose.connection.db.collection("users");
  await usersC.insertMany([userAlice, userBob, userDave]);
}

async function addDummySpecies() {
  const speciesC = mongoose.connection.db.collection("species");
  await speciesC.insertMany([speciesBulbasaur, speciesMewtwo]);
}

async function addDummyPokemon() {
  const pokemonsC = mongoose.connection.db.collection("pokemons");
  await pokemonsC.insertMany([pokemonAlicesBulbasaur, pokemonBobsBulbasaur, pokemonBobsMewtwo]);
}

async function dropData() {
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
}

async function addAllDummyData() {
  await dropData();
  await addDummySpecies();
  await addDummyUsers();
  await addDummyPokemon();
}

export {
  userAlice,
  userBob,
  userDave,
  bearerAlice,
  bearerBob,
  bearerDave,
  speciesBulbasaur,
  speciesMewtwo,
  pokemonAlicesBulbasaur,
  pokemonBobsBulbasaur,
  pokemonBobsMewtwo,
  addAllDummyData,
};
