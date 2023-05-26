import styles from "./FavouritesPage.module.css";
import PokemonList from "../components/PokemonList";
import React, {useState, useEffect} from "react";
import { useAuth } from "../components/Auth";
import { useUser } from "../components/Auth";
import { USERS_URL } from "../api/urls";
import axios from 'axios';
import OtherPokemonList from "./OtherPokemonList.jsx"
import PokemonTable from "../components/PokemonTable";
import PokemonPie from "../components/PokemonPie";



export default function FavouritesPage() {

    const { token } = useAuth();
    const { username , _id  } = useUser();
    const [otherUserPokemonData , setOtherUserPokemonData] = useState([]);
    const [userPokemonData , setUserPokemonData] = useState([]);
    let otherPokemonDataArray = [];
    
    useEffect(() => {

        async function getOtherUserPokemon() {

            try {
                const response = await axios.get(`${USERS_URL}`, 
                { headers: { authorization: `Bearer ${token}` }})

                    const otherUserList = response.data.filter((user) => (user.username !== username));
                    for (let index = 0; index < otherUserList.length; index++) {
                        
                        const otherPokemonData = await getOtherUserPokemonData(otherUserList[index])
                        
                        otherPokemonDataArray = [...otherPokemonDataArray , otherPokemonData];                        
                    }
                    
                    setOtherUserPokemonData(otherPokemonDataArray);

            } catch (err) {
                console.error(err);
            }
        }

        getOtherUserPokemon();

    }, []);

    async function getOtherUserPokemonData(user){
        const response = await axios.get(`${USERS_URL}/${user._id}/pokemon`, 
        { headers: { authorization: `Bearer ${token}` }})
        const pokemonInfo ={
            data: response.data,
            username: user.username
        }
        return pokemonInfo
    }

    useEffect(() => {

        async function getUserPokemon() {

            try {
                const response = await axios.get(`${USERS_URL}/${_id}/pokemon?favouritesOnly=true`, 
                { headers: { authorization: `Bearer ${token}` }})
                .then((response) => {
                    setUserPokemonData (response.data); 
                         
                    return;
                })

            } catch (err) {
                console.error(err);
            }
        }
        getUserPokemon();

    }, []);


    return (
        <div>
            <div className={styles.container}>
                {(userPokemonData) ?
                    <div className={styles.insidecontainer}>
                        <div className={styles.listandtable}>
                            <div>
                                <h2>{username}'s favourite Pokemon</h2>
                                <PokemonList pokemon={userPokemonData}/>
                            </div>
                            <div className={styles.pokemonpie}>
                                {(userPokemonData && otherUserPokemonData) && 
                                <PokemonPie userpokemon={userPokemonData} otherpokemon={otherUserPokemonData}/>}
                            </div>
                        </div>
                        <div className={styles.pokemontable}>
                            <PokemonTable pokemon={userPokemonData}/>
                        </div>
                    </div>

                    : <img src="./Loading_icon.gif"/>}
            </div>
            <hr/>

            <div className={styles.container}>          
            {(otherUserPokemonData) ?
                 (<div>
                    <div >
                        {otherUserPokemonData.map((otherUserPokemon,index) => (
                            <OtherPokemonList key={index}
                            pokemon={otherUserPokemon.data}
                            username = {otherUserPokemon.username}/>
                        ))}
                    </div>
                </div>
                ):
                (
                    <img src="./Loading_icon.gif"/>
                )}
            </div>  
        </div>
      );
}
