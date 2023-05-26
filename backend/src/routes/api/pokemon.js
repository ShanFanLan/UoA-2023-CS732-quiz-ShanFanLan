import express from "express";
import auth from "../../middleware/auth.js";
import {  retrievePokemonForUser, 
          retrievePokemonById,
          updatePokemonFavoriteStatus } from "../../db/pokemon-dao.js";

const router = express.Router();

// Get all pokemon for the authenticated user
router.get("/", auth, async (req, res) => {
  const pokemons = await retrievePokemonForUser(req.user._id);
  return res.json(pokemons);
});

// Get a single pokemon owned by the authenticated user
router.get("/:id", auth, async (req, res) => {
  const pokemon = await retrievePokemonById(req.params.id);
  if (!pokemon) return res.sendStatus(404);
  if (!pokemon.owner.equals(req.user._id)) return res.sendStatus(404);
  return res.json(pokemon);
});

// Task One: "Favouriting" Pokémon
router.patch("/:id/setFavourite", auth, async (req, res) => {

  const pokemon = await retrievePokemonById(req.params.id);

  // Cannot change favourite status of a nonexistent Pokemon (HTTP 404)
  if (!pokemon) return res.sendStatus(404);

  // Cannot change favourite status of a Pokemon that's not yours (HTTP 404)
  if (!pokemon.owner.equals(req.user._id)) return res.sendStatus(404);

  // Cannot change favourite status if not sent in the body (HTTP 422)
  if (req.body.isFavourite === undefined) return res.sendStatus(422);

  await updatePokemonFavoriteStatus(req.params.id , req.body.isFavourite);

  return res.sendStatus(204);
});

export default router;

