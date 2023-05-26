import styles from "./PokemonIcon.module.css";
import clsx from "clsx";

/**
 * Displays an image and name of a single Pokemon.
 * 
 * NOTE: Uses clsx, which is essentially a helper function which combines several,
 * often conditional, class names into one proper CSS class name definition.
 */
export function PokemonIcon({ pokemon, ...props }) {
  const imgSrc = pokemon.isShiny
    ? pokemon.species.image.thumbnail.shiny
    : pokemon.species.image.thumbnail.normal;
  return (
    <div
      className={clsx(
        styles.iconContainer,
        pokemon.isShiny && styles.shiny,
        pokemon.isFavourite && styles.favourite
      )}
      {...props}
    >
      <img src={imgSrc} />
      <p>{pokemon.nickname}</p>
    </div>
  );
}
