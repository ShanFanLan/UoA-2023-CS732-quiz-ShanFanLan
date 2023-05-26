/**
 * A place where we can wrap axios calls in our own functions so we can provide
 * a "nicer" interface to the rest of the webapp.
 */

import axios from "axios";
import { CREATE_ACCOUNT_URL, LOGIN_URL, POKEMON_URL } from "./urls";

export const login = (username, password) => axios.post(LOGIN_URL, { username, password });

export const createAccount = (username, password) =>
  axios.post(CREATE_ACCOUNT_URL, { username, password });

export const setFavourite = (pokemonId, isFavourite, token) =>
  axios.patch(
    `${POKEMON_URL}/${pokemonId}/setFavourite`,
    { isFavourite },
    { headers: { authorization: `Bearer ${token}` } }
  );
