import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import express from "express";
import request from "supertest";
import routes from "../users.js";
import jwt from "jsonwebtoken";
import {
  addAllDummyData,
  bearerAlice,
  bearerBob,
  pokemonBobsBulbasaur,
  pokemonBobsMewtwo,
  speciesBulbasaur,
  speciesMewtwo,
  userAlice,
  userBob,
} from "./dummydata.js";

let mongod, db;
const app = express();
app.use(express.json());
app.use("/api/users", routes);

// Start in-memory DB before tests run
beforeAll(async () => {
  mongod = await MongoMemoryServer.create();

  const connectionString = mongod.getUri();
  mongoose.set("strictQuery", false);
  await mongoose.connect(connectionString);
  db = mongoose.connection.db;
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

// Tests involving user account creation
describe("POST /api/users/create", () => {
  test("Account creation is successful under normal circumstances", (done) => {
    request(app)
      .post("/api/users/create")
      .send({ username: "Charlotte", password: "pa55word" })
      .expect(201)
      .end(async (err, res) => {
        if (err) return done(err);

        // Is new user in DB?
        const dbUser = await db.collection("users").findOne({ username: "Charlotte" });
        expect(dbUser).toBeDefined();

        // Does _id in database match location header?
        expect(res.header.location).toBe(`/api/users/${dbUser._id}`);

        // Does JWT token validate and contain the correct username?
        const token = jwt.verify(res.body.token, process.env.JWT_KEY);
        expect(token.username).toBe("Charlotte");

        return done();
      });
  });

  test("Starter pokemon are created when account creation is successful", (done) => {
    request(app)
      .post("/api/users/create")
      .send({ username: "Charlotte", password: "pa55word" })
      .expect(201)
      .end(async (err, res) => {
        if (err) return done(err);

        // Are there 30 starter Pokemon for that user in the DB?
        const userId = res.header.location.slice(res.header.location.lastIndexOf("/") + 1);
        const numPokemon = await mongoose.connection.db
          .collection("pokemons")
          .countDocuments({ owner: mongoose.Types.ObjectId(userId) });
        expect(numPokemon).toBe(30);

        return done();
      });
  });

  test("Account creation fails with HTTP 409 with duplicate username", (done) => {
    request(app)
      .post("/api/users/create")
      .send({ username: "Alice", password: "blah" })
      .expect(409, done);
  });

  test("Account creation fails with HTTP 422 with missing username", (done) => {
    request(app).post("/api/users/create").send({ password: "blah" }).expect(422, done);
  });

  test("Account creation fails with HTTP 422 with missing password", (done) => {
    request(app).post("/api/users/create").send({ username: "Alice" }).expect(422, done);
  });
});

// Tests involving user login
describe("POST /api/users/login", () => {
  test("Login successful under normal circumstances", (done) => {
    request(app)
      .post("/api/users/login")
      .send({ username: "Alice", password: "12345" })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        // Does JWT token validate and contain the correct username?
        const token = jwt.verify(res.body.token, process.env.JWT_KEY);
        expect(token._id).toBe(userAlice._id.toString());
        expect(token.username).toBe("Alice");
        return done();
      });
  });

  test("Login fails with HTTP 422 with missing username", (done) => {
    request(app).post("/api/users/login").send({ password: "12345" }).expect(422, done);
  });

  test("Login fails with HTTP 422 with missing password", (done) => {
    request(app).post("/api/users/login").send({ username: "Alice" }).expect(422, done);
  });

  test("Login fails with HTTP 401 with wrong username", (done) => {
    request(app)
      .post("/api/users/login")
      .send({ username: "NotExist", password: "12345" })
      .expect(401, done);
  });

  test("Login fails with HTTP 401 with wrong password", (done) => {
    request(app)
      .post("/api/users/login")
      .send({ username: "Alice", password: "12346" })
      .expect(401, done);
  });
});

// Tests involving getting users
describe("GET /api/users", () => {
  test("Can get a list of all users when authorized", (done) => {
    request(app)
      .get("/api/users")
      .set("authorization", bearerAlice)
      .send()
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        const users = res.body;
        expect(users.length).toBe(3);
        expect(users[0].username).toBe("Alice");
        expect(users[1].username).toBe("Bob");
        expect(users[2].username).toBe("Dave");
        return done();
      });
  });

  test("Cannot get user list when not authenticated (HTTP 401)", (done) => {
    request(app).get("/api/users").send().expect(401).end(done);
  });
});

// Tests involving getting individual users' pokemon
describe("GET /api/users/:id/pokemon", () => {
  // Before tests in this slot, make Bob's Mewtwo his "favourite".
  beforeEach(async () => {
    await db
      .collection("pokemons")
      .findOneAndUpdate({ _id: pokemonBobsMewtwo._id }, { $set: { isFavourite: true } });
  });

  test("Can get a list of all of a user's own Pokemon", (done) => {
    request(app)
      .get(`/api/users/${userBob._id}/pokemon`)
      .set("authorization", bearerBob)
      .send()
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        const pokemon = res.body;
        expect(pokemon.length).toBe(2);
        expect(pokemon[0]._id).toBe(pokemonBobsBulbasaur._id.toString());
        expect(pokemon[1]._id).toBe(pokemonBobsMewtwo._id.toString());

        // Ensure species data is populated
        expect(typeof pokemon[0].species).toBe("object");
        expect(pokemon[0].species._id).toBe(speciesBulbasaur._id.toString());

        return done();
      });
  });

  test("Can get a list of another user's Pokemon (ONLY their favourites)", (done) => {
    request(app)
      .get(`/api/users/${userBob._id}/pokemon`)
      .set("authorization", bearerAlice)
      .send()
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        const pokemon = res.body;
        expect(pokemon.length).toBe(1);
        expect(pokemon[0]._id).toBe(pokemonBobsMewtwo._id.toString());

        // Ensure species data is populated
        expect(typeof pokemon[0].species).toBe("object");
        expect(pokemon[0].species._id).toBe(speciesMewtwo._id.toString());

        return done();
      });
  });

  test("Can get a list of your own favourite Pokemon with the favouritesOnly=true query string", (done) => {
    request(app)
      .get(`/api/users/${userBob._id}/pokemon?favouritesOnly=true`)
      .set("authorization", bearerBob)
      .send()
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        const pokemon = res.body;
        expect(pokemon.length).toBe(1);
        expect(pokemon[0]._id).toBe(pokemonBobsMewtwo._id.toString());

        // Ensure species data is populated
        expect(typeof pokemon[0].species).toBe("object");
        expect(pokemon[0].species._id).toBe(speciesMewtwo._id.toString());

        return done();
      });
  });

  test("Cannot get a list of a nonexistent user's Pokemon (HTTP 404)", (done) => {
    request(app)
      .get("/api/users/000000000000000000000099/pokemon")
      .set("authorization", bearerAlice)
      .send()
      .expect(404)
      .end(done);
  });

  test("Cannot get a list of a user's Pokemon when not authenticated (HTTP 401)", (done) => {
    request(app).get(`/api/users/${userBob._id}/pokemon`).send().expect(401).end(done);
  });
});
