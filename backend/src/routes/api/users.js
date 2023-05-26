import express from "express";
import { User } from "../../db/schema";
import bcrypt from "bcrypt";
import { createStartingPokemonForUser, retrievePokemonForUser , retrieveFavoritePokemonForUser} from "../../db/pokemon-dao.js";
import { createToken } from "../../middleware/auth.js";
import auth from "../../middleware/auth.js";

const router = express.Router();

// Create new account
router.post("/create", async (req, res) => {
  // Must send username and password
  const { username, password } = req.body;
  if (!username || !password) return res.sendStatus(422);

  // Cannot have duplicate usernames
  let user = await User.findOne({ username });
  if (user) return res.sendStatus(409);

  // Create new user and some Pokemon for that user
  user = await User.create({
    username,
    passHash: await bcrypt.hash(password, 10),
  });
  await createStartingPokemonForUser(user._id);

  // Create and sign a JWT token
  const token = createToken(user._id.toString(), username);

  // Return success with a location pointing to the new user, and the token in the response
  return res.status(201).location(`/api/users/${user._id}`).json({ token });
});

// Login to existing account
router.post("/login", async (req, res) => {
  // Must send username and password
  const { username, password } = req.body;
  if (!username || !password) return res.sendStatus(422);

  // User must exist
  let user = await User.findOne({ username });
  if (!user) return res.sendStatus(401);

  // Password must be correct
  const isPasswordOk = await bcrypt.compare(password, user.passHash);
  if (!isPasswordOk) return res.sendStatus(401);

  // Create and sign a JWT token
  const token = createToken(user._id.toString(), username);

  // Return success with the token in the response
  return res.status(200).json({ token });
});


//Task 3 (1)
router.get("/", auth , async (req, res) => {

  let allUser = await User.find({});

  return res.json(allUser);

});

//Task 3 (2)
router.get("/:id/pokemon", auth, async (req, res) => {
  const userId = req.user._id.toString();   // userID
  const ownerId = req.params.id;            // String

  // check owner exist??
  let owner = await User.findOne({ _id: ownerId });
  if (!owner) return res.sendStatus(404);

  // check user = owner ??
  if (userId === ownerId) {

    if (req.query.favouritesOnly && req.query.favouritesOnly === "true") {

        //retrieve user's favorite pokemon list
        const userFavoritePokemonList = await retrieveFavoritePokemonForUser(userId);
        return res.json(userFavoritePokemonList);

    } else { 

        //retrieve user's all pokemon list 
        const userPokemonList = await retrievePokemonForUser(userId);
        return res.json(userPokemonList);
    }
  } else {

    //retrieve owner's favorite pokemon list
    const ownerFavoritePokemonList = await retrieveFavoritePokemonForUser(ownerId);
    return res.json(ownerFavoritePokemonList);
  }
});

export default router;
