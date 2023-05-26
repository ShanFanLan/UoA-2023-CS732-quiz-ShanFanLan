import { PokemonIcon } from "./PokemonIcon";
import styles from "./PokemonList.module.css";

/**
 * Displays a list of Pokemon. This component's onClick and onDoubleClick events
 * will include the pokemon as a secondary arg, as well as the event itself from
 * the clicked icon.
 */
export default function PokemonList({ pokemon, onClick, onDoubleClick }) {
  if (!pokemon || pokemon.length == 0) return <p>No Pokemon here 😔</p>;

  function forwardEventWithPokemon(func, mon) {
    return (e) => func && func(e, mon);
  }

  return (
    <div className={styles.listContainer}>
      {pokemon.map((p) => (
        <PokemonIcon
          key={p._id}
          pokemon={p}
          onClick={forwardEventWithPokemon(onClick, p)}
          onDoubleClick={forwardEventWithPokemon(onDoubleClick, p)}
        />
      ))}
    </div>
  );
}
