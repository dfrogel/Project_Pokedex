const pokeApi = {}

/* Filtro dos dados recolhidos pela API e convertendo-os*/
function convertDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type
    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    pokemon.stats = pokemon.stats = pokeDetail.stats.map((base_stats) => base_stats.base_stat)

    return pokemon
}

/* Request dos dados detalhados dos pokemons */
pokeApi.getPokemonsDetail = (pokemon) => {
    return fetch(pokemon.url)
            .then((response) => response.json())
            .then(convertDetailToPokemon)
}

/* Request dos dados iniciais */
pokeApi.getPokemons = (offset = 0, limit = 10) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
    
    return fetch(url)
    .then((response) => response.json())
    .then((jsonBody) => jsonBody.results)
    .then((pokemons) => {
      const pokemonDetailRequests = pokemons.map((pokemon) => {
        const detailUrl = `https://pokeapi.co/api/v2/pokemon/${pokemon.name}?language=en`;
        return fetch(detailUrl).then((response) => response.json());
      });
      return Promise.all(pokemonDetailRequests);
    })
    .then((pokemonsDetails) => {
      const convertedPokemons = pokemonsDetails.map(convertDetailToPokemon);
      return convertedPokemons;
    });
}

