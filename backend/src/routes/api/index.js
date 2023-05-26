import express from "express";

const router = express.Router();

import speciesRoutes from "./species.js";
import userRoutes from "./users.js";
import pokemonRoutes from "./pokemon.js";
router.use("/species", speciesRoutes);
router.use("/users", userRoutes);
router.use("/pokemon", pokemonRoutes);

export default router;
