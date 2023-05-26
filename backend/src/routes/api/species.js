import express from "express";
import { Species } from "../../db/schema";

const router = express.Router();

// Gets all species
router.get("/", async (req, res) => {
  return res.json(await Species.find({}));
});

// Gets the species with the given id
router.get("/:id", async (req, res) => {
  const species = await Species.findById(req.params.id);
  if (!species) return res.sendStatus(404);
  return res.json(species);
});

export default router;
