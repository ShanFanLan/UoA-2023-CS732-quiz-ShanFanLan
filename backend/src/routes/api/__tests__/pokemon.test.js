import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import express from "express";
import request from "supertest";
import routes from "../pokemon.js";
import {
  addAllDummyData,
  bearerAlice,
  bearerBob,
  bearerDave,
  pokemonAlicesBulbasaur,
  pokemonBobsBulbasaur,
  pokemonBobsMewtwo,
} from "./dummydata.js";

let mongod;
const app = express();
app.use(express.json());
app.use("/api/pokemon", routes);

// Start in-memory DB before tests run
beforeAll(async () => {
  mongod = await MongoMemoryServer.create();

  const connectionString = mongod.getUri();
  mongoose.set("strictQuery", false);
  await mongoose.connect(connectionString);
});

// Ensure clean database before each test
beforeEach(async () => {
  await addAllDummyData();
});

// Stop in-memory DB when complete
afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

// Tests to do with getting Pokemon lists
describe("GET /api/pokemon", () => {
  test("Can get a list of own pokemon with correct auth token (single)", (done) => {
    request(app)
      .get("/api/pokemon")
      .set("authorization", bearerAlice)
      .send()
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        // Expect one pokemon with correct _id and nickname
        expect(res.body.length).toBe(1);
        const { _id, nickname, species } = res.body[0];
        expect(_id).toBe(pokemonAlicesBulbasaur._id.toString());
        expect(nickname).toBe(pokemonAlicesBulbasaur.nickname);

        // Expect species to be populated, not just the id
        expect(typeof species).toBe("object");
        expect(species.name).toBe("Bulbasaur");

        return done();
      });
  });

  test("Can get a list of own pokemon with correct auth token (multi)", (done) => {
    request(app)
      .get("/api/pokemon")
      .set("authorization", bearerBob)
      .send()
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        // Expect two pokemon with correct _ids and nicknames
        expect(res.body.length).toBe(2);
        expect(res.body[0]._id).toBe(pokemonBobsBulbasaur._id.toString());
        expect(res.body[0].nickname).toBe(pokemonBobsBulbasaur.nickname);
        expect(res.body[1]._id).toBe(pokemonBobsMewtwo._id.toString());
        expect(res.body[1].nickname).toBe(pokemonBobsMewtwo.nickname);

        return done();
      });
  });

  test("Can get a list of own pokemon with correct auth token (none)", (done) => {
    request(app)
      .get("/api/pokemon")
      .set("authorization", bearerDave)
      .send()
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        // Expect no pokemon
        expect(res.body.length).toBe(0);
        return done();
      });
  });

  test("Cannot get Pokemon with no auth token provided (HTTP 401)", (done) => {
    request(app).get("/api/pokemon").send().expect(401).end(done);
  });

  test("Cannot get Pokemon with incorrect auth token provided (HTTP 401)", (done) => {
    request(app)
      .get("/api/pokemon")
      .set("authorization", "corrupt auth token")
      .send()
      .expect(401)
      .end(done);
  });
});

// Tests involving getting a single pokemon
describe("GET /api/pokemon/:id", () => {
  test("Can get a single pokemon with correct auth and id", (done) => {
    request(app)
      .get(`/api/pokemon/${pokemonAlicesBulbasaur._id}`)
      .set("authorization", bearerAlice)
      .send()
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        // Expect correct _id and nickname
        const { _id, nickname, species } = res.body;
        expect(_id).toBe(pokemonAlicesBulbasaur._id.toString());
        expect(nickname).toBe(pokemonAlicesBulbasaur.nickname);

        // Expect species to be populated, not just the id
        expect(typeof species).toBe("object");
        expect(species.name).toBe("Bulbasaur");

        return done();
      });
  });

  test("Cannot get someone else's pokemon (HTTP 404)", (done) => {
    request(app)
      .get(`/api/pokemon/${pokemonAlicesBulbasaur._id}`)
      .set("authorization", bearerBob)
      .send()
      .expect(404)
      .end(done);
  });

  test("Cannot get nonexistent pokemon (HTTP 404)", (done) => {
    request(app)
      .get("/api/pokemon/000000000000000000000099")
      .set("authorization", bearerAlice)
      .send()
      .expect(404)
      .end(done);
  });

  test("Cannot get pokemon when not authorized (HTTP 401)", (done) => {
    request(app).get(`/api/pokemon/${pokemonAlicesBulbasaur._id}`).send().expect(401).end(done);
  });
});

// Tests involving updating favourite status
describe("PATCH /api/pokemon/:id/setFavourite", () => {
  // Before tests in this slot, make Bob's Mewtwo his "favourite".
  beforeEach(async () => {
    await mongoose.connection.db
      .collection("pokemons")
      .findOneAndUpdate({ _id: pokemonBobsMewtwo._id }, { $set: { isFavourite: true } });
  });

  test("Can successfully 'favourite' a Pokemon", (done) => {
    request(app)
      .patch(`/api/pokemon/${pokemonBobsBulbasaur._id}/setFavourite`)
      .set("authorization", bearerBob)
      .send({ isFavourite: true })
      .expect(204)
      .end(async (err, res) => {
        if (err) return done(err);

        // The update should be reflected in the database
        const fromDb = await mongoose.connection.db
          .collection("pokemons")
          .findOne({ _id: pokemonBobsBulbasaur._id });
        expect(fromDb.isFavourite).toBe(true);

        return done();
      });
  });

  test("Can successfully 'un-favourite' a Pokemon", (done) => {
    request(app)
      .patch(`/api/pokemon/${pokemonBobsMewtwo._id}/setFavourite`)
      .set("authorization", bearerBob)
      .send({ isFavourite: false })
      .expect(204)
      .end(async (err, res) => {
        if (err) return done(err);

        // The update should be reflected in the database
        const fromDb = await mongoose.connection.db
          .collection("pokemons")
          .findOne({ _id: pokemonBobsMewtwo._id });
        expect(fromDb.isFavourite).toBe(false);

        return done();
      });
  });

  test("Cannot change favourite status if not sent in the body (HTTP 422)", (done) => {
    request(app)
      .patch(`/api/pokemon/${pokemonBobsMewtwo._id}/setFavourite`)
      .set("authorization", bearerBob)
      .send()
      .expect(422)
      .end(done);
  });

  test("Cannot change favourite status of a Pokemon that's not yours (HTTP 404)", (done) => {
    request(app)
      .patch(`/api/pokemon/${pokemonBobsMewtwo._id}/setFavourite`)
      .set("authorization", bearerAlice)
      .send({ isFavourite: false })
      .expect(404)
      .end(done);
  });

  test("Cannot change favourite status of a nonexistent Pokemon (HTTP 404)", (done) => {
    request(app)
      .patch("/api/pokemon/000000000000000000000099/setFavourite")
      .set("authorization", bearerAlice)
      .send({ isFavourite: false })
      .expect(404)
      .end(done);
  });

  test("Cannot change favourite status of a Pokemon when not authenticated (HTTP 401)", (done) => {
    request(app)
      .patch(`/api/pokemon/${pokemonBobsMewtwo._id}/setFavourite`)
      .send({ isFavourite: false })
      .expect(401)
      .end(done);
  });
});
