// Servicio para obtener Pokémon de PokeAPI (https://pokeapi.co/)
// API gratuita y pública que contiene todos los Pokémon

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';

// Función para obtener todos los Pokémon (limitado a los primeros 1000 para mejor rendimiento)
export async function getAllPokemon() {
  try {
    const response = await fetch(`${POKEAPI_BASE_URL}/pokemon?limit=1000`);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error al obtener lista de Pokémon:', error);
    throw error;
  }
}

// Función para obtener detalles de un Pokémon específico
export async function getPokemonDetails(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener detalles del Pokémon:', error);
    throw error;
  }
}

// Función para obtener información de especie (para saber si es legendario, generación, etc.)
export async function getPokemonSpecies(id) {
  try {
    const response = await fetch(`${POKEAPI_BASE_URL}/pokemon-species/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener especie del Pokémon:', error);
    return null;
  }
}

// Función para transformar los datos de la API al formato que necesita nuestra app
export function transformPokemonData(apiData, speciesData = null) {
  const id = apiData.id;
  const name = apiData.name.charAt(0).toUpperCase() + apiData.name.slice(1);
  const types = apiData.types.map(t => t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1));
  
  // Determinar generación basándose en el ID
  let generation = 1;
  if (id > 151) generation = 2;
  if (id > 251) generation = 3;
  if (id > 386) generation = 4;
  if (id > 493) generation = 5;
  if (id > 649) generation = 6;
  if (id > 721) generation = 7;
  if (id > 809) generation = 8;
  if (id > 905) generation = 9;

  // Determinar si es legendario/mítico
  const isLegendary = speciesData?.is_legendary || false;
  const isMythical = speciesData?.is_mythical || false;
  const legendary = isLegendary || isMythical;

  // Lista de Pokémon iniciales (starters) por generación
  const starterIds = [
    1, 4, 7,        // Gen 1: Bulbasaur, Charmander, Squirtle
    152, 155, 158,  // Gen 2: Chikorita, Cyndaquil, Totodile
    252, 255, 258,  // Gen 3: Treecko, Torchic, Mudkip
    387, 390, 393,  // Gen 4: Turtwig, Chimchar, Piplup
    495, 498, 501,  // Gen 5: Snivy, Tepig, Oshawott
    650, 653, 656,  // Gen 6: Chespin, Fennekin, Froakie
    722, 725, 728,  // Gen 7: Rowlet, Litten, Popplio
    810, 813, 816,  // Gen 8: Grookey, Scorbunny, Sobble
    906, 909, 912,  // Gen 9: Sprigatito, Fuecoco, Quaxly
  ];
  const starter = starterIds.includes(id);

  return {
    id,
    name,
    type: types,
    generation,
    legendary,
    starter
  };
}

// Función principal para cargar todos los Pokémon con sus detalles
export async function loadAllPokemon() {
  try {
    console.log('Cargando Pokémon desde PokeAPI...');
    
    // Obtener lista de todos los Pokémon
    const pokemonList = await getAllPokemon();
    console.log(`Encontrados ${pokemonList.length} Pokémon`);

    // Cargar detalles de todos los Pokémon en lotes para mejor rendimiento
    const batchSize = 20; // Procesar 20 a la vez
    const allPokemon = [];

    for (let i = 0; i < pokemonList.length; i += batchSize) {
      const batch = pokemonList.slice(i, i + batchSize);
      const batchPromises = batch.map(async (pokemon, index) => {
        try {
          const details = await getPokemonDetails(pokemon.url);
          const species = await getPokemonSpecies(details.id);
          return transformPokemonData(details, species);
        } catch (error) {
          console.error(`Error al cargar ${pokemon.name}:`, error);
          return null;
        }
      });

      const batchResults = await Promise.all(batchPromises);
      allPokemon.push(...batchResults.filter(p => p !== null));
      
      // Pequeño delay para no sobrecargar la API
      if (i + batchSize < pokemonList.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    console.log(`Cargados ${allPokemon.length} Pokémon exitosamente`);
    return allPokemon;
  } catch (error) {
    console.error('Error al cargar Pokémon:', error);
    throw error;
  }
}

// Función optimizada que carga solo los primeros N Pokémon (más rápido para desarrollo)
export async function loadPokemonBatch(limit = 151, onProgress = null, onBatchLoaded = null) {
  try {
    console.log(`Cargando primeros ${limit} Pokémon desde PokeAPI...`);
    
    const allPokemon = [];
    const batchSize = 10; // Procesar 10 a la vez para no sobrecargar la API
    
    // Cargar Pokémon en lotes
    for (let i = 1; i <= limit; i += batchSize) {
      const batchEnd = Math.min(i + batchSize - 1, limit);
      const batchPromises = [];
      
      for (let j = i; j <= batchEnd; j++) {
        batchPromises.push(
          Promise.all([
            getPokemonDetails(`${POKEAPI_BASE_URL}/pokemon/${j}`),
            getPokemonSpecies(j).catch(() => null)
          ]).then(([details, species]) => {
            return transformPokemonData(details, species);
          }).catch(error => {
            console.error(`Error al cargar Pokémon ${j}:`, error);
            return null;
          })
        );
      }

      const batchResults = await Promise.all(batchPromises);
      const validPokemon = batchResults.filter(p => p !== null);
      allPokemon.push(...validPokemon);
      
      // Notificar cuando se carga un lote (para actualización incremental)
      if (onBatchLoaded) {
        onBatchLoaded([...validPokemon], allPokemon.length, limit);
      }
      
      // Notificar progreso si hay callback
      if (onProgress) {
        onProgress(allPokemon.length, limit);
      }
      
      // Pequeño delay entre lotes para no sobrecargar la API
      if (batchEnd < limit) {
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    }
    
    console.log(`Cargados ${allPokemon.length} Pokémon exitosamente`);
    return allPokemon;
  } catch (error) {
    console.error('Error al cargar Pokémon:', error);
    throw error;
  }
}

