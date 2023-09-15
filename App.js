import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';

export default function App() {
  const [pokes, setPokes] = useState([]);
  const [originalPokes, setOriginalPokes] = useState([]); // Ajoutez un état pour stocker la liste originale

  const getListPoke = () => {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=100')
      .then((response) => response.json())
      .then((pokemonData) => {
        const temporaryPokemon = [];

        Promise.all(pokemonData.results.map((pokemon) => {
          return fetch(pokemon.url)
            .then((response) => response.json())
            .then((pokemonData) => {
              return temporaryPokemon.push(pokemonData);
            });
        })).then(() => {
          // Stockez la liste originale
          setOriginalPokes(temporaryPokemon);
          // Tri par défaut (par ID)
          temporaryPokemon.sort((a, b) => a.id - b.id);
          setPokes(temporaryPokemon);
        });
      });
  }

  useEffect(() => {
    getListPoke();
  }, []);

  const sortByname = () => {
    const sortedPokes = [...pokes];
    sortedPokes.sort((a, b) => a.name.localeCompare(b.name));
    setPokes(sortedPokes);
  };

  const sortByType = () => {
    const sortedPokes = [...pokes];
    sortedPokes.sort((a, b) => {
      const typeA = a.types[0].type.name;
      const typeB = b.types[0].type.name;
      return typeA.localeCompare(typeB);
    });
    setPokes(sortedPokes);
  };

  const sortByWeight = () => {
    const sortedPokes = [...pokes];
    sortedPokes.sort((a, b) => a.weight - b.weight);
    setPokes(sortedPokes);
  };

  const sortByHeight = () => {
    const sortedPokes = [...pokes];
    sortedPokes.sort((a, b) => a.height - b.height);
    setPokes(sortedPokes);
  };

  const resetSort = () => {
    // Réinitialisez la liste triée à la liste originale
    setPokes(originalPokes);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.sortButtons}>
        <Image style ={styles.pokemonImage} source={{uri: "https://media.discordapp.net/attachments/1151773244622381087/1152150094993436722/51a6f649ab83f672a1a2741fc4eee871.png?width=330&height=150"}}/>
        <TouchableOpacity onPress={sortByname} style={styles.sortButton}>
          <Text style={styles.pokemonName}>par nom</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={sortByType} style={styles.sortButton}>
          <Text style={styles.pokemonName}>par type</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={sortByWeight} style={styles.sortButton}>
          <Text style={styles.pokemonName}>par poids</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={sortByHeight} style={styles.sortButton}>
          <Text style={styles.pokemonName}>par taille</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={resetSort} style={styles.sortButton}>
          <Text style={styles.pokemonName}>par id</Text>
        </TouchableOpacity>
      </View>

      {pokes.length > 0 ? pokes.map((poke) => {
        return (
          
          <View style={styles.pokemon} key={poke.name}>
            <Image source={{uri: poke.sprites.front_default}} style={{width: 140, height: 145}} />
            <Text style={styles.pokemonName}>Name : {poke.name}</Text>
            {poke.types.map((a, index) => <Text style={styles.pokemonText} key={index}>Type : {a.type.name}</Text>)}
            <Text style={styles.pokemonText}>Height : {poke.height}</Text>
            <Text style={styles.pokemonText}>Weight : {poke.weight}</Text>
          </View>
        )
      }) : <View style = {styles.loadingView}>
          <Text style ={styles.pokemonText}>Loading...</Text>
          <Image source={{uri:"https://media.discordapp.net/attachments/798264990850482187/1152156728734011402/Pokebola-pokeball-png-0.png?width=671&height=670"}} style={styles.pokeball} />
        </View>}
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingView:{
    display:"flex",
    flexDirection:"row",
    width: 100,
    justifyContent:"space-between"

  },
  pokeball:{
    height:30,
    width:30,
  },
  pokemon: {
    display: "flex",
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems:"center",
    width: "30%",
    marginBottom:30,
  },
  pokemonImage:{
    marginLeft: 30,
    marginRight: 10,
    width : 185,
    height: 85  ,
  },
  container: {
    paddingBottom: 60,
    flexDirection: "row",
    flexWrap:"wrap",
    justifyContent:"space-around",
    backgroundColor: '#F2555B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sortButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    alignItems:"center",
    paddingBottom: 30,
    marginBottom: 30,
    borderBottomColor: "#EC6B61",
    borderBottomWidth: 11,
    paddingTop:30,
    backgroundColor : "#FF776B",
    borderBottomEndRadius: 0,
    borderBottomStartRadius: 100,
  },
  sortButton: {
    padding: 10,
    width : "13%",
    height: 55,
    alignItems:"center",
    justifyContent:"center",
    backgroundColor: "lightgray",
    borderRadius: 5,
    color: "#FFFFF",
    backgroundColor: "#7A61AB",
    borderColor:"#816088",
    borderWidth: 8,
  },
  pokemonName: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: "center",
    color: "#FFFFFF"
  },
  pokemonText: {
    textAlign: "center",
    color: "#FFFFFF",
  },
});


