import PokemonList from "../components/PokemonList";
import PokemonTable from "../components/PokemonTable";
import styles from "./FavouritesPage.module.css";

export default function OtherPokemonList({pokemon,username}) {
    return(
        <div>
            <div>
                <h2>{username}'s favourite Pokemon</h2>
                <PokemonList pokemon={pokemon}/>
            </div>
            <div className={styles.pokemontable}>
                <PokemonTable pokemon={pokemon}/>
            </div>
        </div>
    );
}