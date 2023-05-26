/**
 * This script initializes the db by clearing all data from all collections,
 * downloading a fresh Species list, and populating the database with it.
 *
 * NOTE: The code for clearing collections isn't using mongoose schemas
 * (rather, "raw" db access) because I wanted the code to work no matter what
 * changes students make to the schema. I used the Species schema because students
 * shouldn't change this.
 */

import * as dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { Species } from "./schema";
import axios from "axios";

console.log("Database init script");

/**
 * Clears the database and populates it with newly downloaded species data
 */
async function initDb() {
  console.log("Connecting to database...");
  await mongoose.connect(process.env.DB_URL);

  await clearDatabase();

  await populateSpecies();

  await mongoose.disconnect();
  console.log("Done!");
}

/**
 * Deletes all data in all collections, using a schema-agnostic approach.
 */
async function clearDatabase() {
  console.log("Clearing entire database...");
  const collections = await mongoose.connection.db.collections();
  for (const c of collections) {
    await c.deleteMany({});
  }
}

/**
 * You're welcome to change the "from" and "to" in the query string, if you want to limit yourself
 * to certain Pokemon gens and you know their national dex numbers... Doing this won't break
 * any unit tests, it will just change the Pokemon available in the running webapp.
 */
async function populateSpecies() {
  console.log("Fetching species list...");
  const response = await axios.get(
    "https://cs732-quiz-server.trex-sandwich.com/api/pokemon/list?from=1&to=905"
  );
  const speciesList = response.data;
  console.log(`${speciesList.length} species found!`);
  for (let i = 0; i < speciesList.length; i++) {
    const species = new Species(speciesList[i]);
    await species.save();
  }
}

initDb();
