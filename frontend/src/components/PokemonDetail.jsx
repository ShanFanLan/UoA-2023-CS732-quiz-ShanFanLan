import clsx from "clsx";
import styles from "./PokemonDetail.module.css";

/**
 * Displays detailed information about a single Pokemon
 */
export default function PokemonDetail({ pokemon }) {
  if (!pokemon) return null;

  const imgSrc = pokemon.isShiny ? pokemon.species.image.shiny : pokemon.species.image.normal;

  return (
    <div
      className={clsx(
        styles.container,
        pokemon.isShiny && styles.shiny,
        pokemon.isFavourite && styles.favourite
      )}
    >
      <h3>{pokemon.nickname}</h3>
      <img src={imgSrc} />
      <p>{pokemon.species.dexEntry}</p>
    </div>
  );
}
