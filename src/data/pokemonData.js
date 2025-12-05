// Base de datos de Pokémon con información relevante para el juego
export const pokemonDatabase = [
  { id: 1, name: "Bulbasaur", type: ["Grass", "Poison"], generation: 1, legendary: false, starter: true },
  { id: 2, name: "Ivysaur", type: ["Grass", "Poison"], generation: 1, legendary: false, starter: false },
  { id: 3, name: "Venusaur", type: ["Grass", "Poison"], generation: 1, legendary: false, starter: false },
  { id: 4, name: "Charmander", type: ["Fire"], generation: 1, legendary: false, starter: true },
  { id: 5, name: "Charmeleon", type: ["Fire"], generation: 1, legendary: false, starter: false },
  { id: 6, name: "Charizard", type: ["Fire", "Flying"], generation: 1, legendary: false, starter: false },
  { id: 7, name: "Squirtle", type: ["Water"], generation: 1, legendary: false, starter: true },
  { id: 8, name: "Wartortle", type: ["Water"], generation: 1, legendary: false, starter: false },
  { id: 9, name: "Blastoise", type: ["Water"], generation: 1, legendary: false, starter: false },
  { id: 25, name: "Pikachu", type: ["Electric"], generation: 1, legendary: false, starter: false },
  { id: 144, name: "Articuno", type: ["Ice", "Flying"], generation: 1, legendary: true, starter: false },
  { id: 145, name: "Zapdos", type: ["Electric", "Flying"], generation: 1, legendary: true, starter: false },
  { id: 146, name: "Moltres", type: ["Fire", "Flying"], generation: 1, legendary: true, starter: false },
  { id: 150, name: "Mewtwo", type: ["Psychic"], generation: 1, legendary: true, starter: false },
  { id: 151, name: "Mew", type: ["Psychic"], generation: 1, legendary: true, starter: false },
  { id: 152, name: "Chikorita", type: ["Grass"], generation: 2, legendary: false, starter: true },
  { id: 155, name: "Cyndaquil", type: ["Fire"], generation: 2, legendary: false, starter: true },
  { id: 158, name: "Totodile", type: ["Water"], generation: 2, legendary: false, starter: true },
  { id: 249, name: "Lugia", type: ["Psychic", "Flying"], generation: 2, legendary: true, starter: false },
  { id: 250, name: "Ho-Oh", type: ["Fire", "Flying"], generation: 2, legendary: true, starter: false },
  { id: 251, name: "Celebi", type: ["Psychic", "Grass"], generation: 2, legendary: true, starter: false },
  { id: 252, name: "Treecko", type: ["Grass"], generation: 3, legendary: false, starter: true },
  { id: 255, name: "Torchic", type: ["Fire"], generation: 3, legendary: false, starter: true },
  { id: 258, name: "Mudkip", type: ["Water"], generation: 3, legendary: false, starter: true },
  { id: 384, name: "Rayquaza", type: ["Dragon", "Flying"], generation: 3, legendary: true, starter: false },
  { id: 387, name: "Turtwig", type: ["Grass"], generation: 4, legendary: false, starter: true },
  { id: 390, name: "Chimchar", type: ["Fire"], generation: 4, legendary: false, starter: true },
  { id: 393, name: "Piplup", type: ["Water"], generation: 4, legendary: false, starter: true },
  { id: 483, name: "Dialga", type: ["Steel", "Dragon"], generation: 4, legendary: true, starter: false },
  { id: 484, name: "Palkia", type: ["Water", "Dragon"], generation: 4, legendary: true, starter: false },
  { id: 487, name: "Giratina", type: ["Ghost", "Dragon"], generation: 4, legendary: true, starter: false },
  { id: 494, name: "Victini", type: ["Psychic", "Fire"], generation: 5, legendary: true, starter: false },
  { id: 495, name: "Snivy", type: ["Grass"], generation: 5, legendary: false, starter: true },
  { id: 498, name: "Tepig", type: ["Fire"], generation: 5, legendary: false, starter: true },
  { id: 501, name: "Oshawott", type: ["Water"], generation: 5, legendary: false, starter: true },
  { id: 643, name: "Reshiram", type: ["Dragon", "Fire"], generation: 5, legendary: true, starter: false },
  { id: 644, name: "Zekrom", type: ["Dragon", "Electric"], generation: 5, legendary: true, starter: false },
  { id: 650, name: "Chespin", type: ["Grass"], generation: 6, legendary: false, starter: true },
  { id: 653, name: "Fennekin", type: ["Fire"], generation: 6, legendary: false, starter: true },
  { id: 656, name: "Froakie", type: ["Water"], generation: 6, legendary: false, starter: true },
  { id: 716, name: "Xerneas", type: ["Fairy"], generation: 6, legendary: true, starter: false },
  { id: 717, name: "Yveltal", type: ["Dark", "Flying"], generation: 6, legendary: true, starter: false },
  { id: 722, name: "Rowlet", type: ["Grass", "Flying"], generation: 7, legendary: false, starter: true },
  { id: 725, name: "Litten", type: ["Fire"], generation: 7, legendary: false, starter: true },
  { id: 728, name: "Popplio", type: ["Water"], generation: 7, legendary: false, starter: true },
  { id: 789, name: "Cosmog", type: ["Psychic"], generation: 7, legendary: true, starter: false },
  { id: 800, name: "Necrozma", type: ["Psychic"], generation: 7, legendary: true, starter: false },
  { id: 810, name: "Grookey", type: ["Grass"], generation: 8, legendary: false, starter: true },
  { id: 813, name: "Scorbunny", type: ["Fire"], generation: 8, legendary: false, starter: true },
  { id: 816, name: "Sobble", type: ["Water"], generation: 8, legendary: false, starter: true },
  { id: 890, name: "Eternatus", type: ["Poison", "Dragon"], generation: 8, legendary: true, starter: false },
  { id: 906, name: "Sprigatito", type: ["Grass"], generation: 9, legendary: false, starter: true },
  { id: 909, name: "Fuecoco", type: ["Fire"], generation: 9, legendary: false, starter: true },
  { id: 912, name: "Quaxly", type: ["Water"], generation: 9, legendary: false, starter: true },
];

// Función para obtener información de un Pokémon por nombre
export function getPokemonByName(name) {
  return pokemonDatabase.find(p => p.name.toLowerCase() === name.toLowerCase());
}

// Función para filtrar Pokémon según criterios
export function filterPokemon(criteria) {
  return pokemonDatabase.filter(pokemon => {
    if (criteria.type && !criteria.type.some(t => pokemon.type.includes(t))) {
      return false;
    }
    if (criteria.generation && pokemon.generation !== criteria.generation) {
      return false;
    }
    if (criteria.legendary !== undefined && pokemon.legendary !== criteria.legendary) {
      return false;
    }
    if (criteria.starter !== undefined && pokemon.starter !== criteria.starter) {
      return false;
    }
    return true;
  });
}

// Función para obtener todos los tipos únicos
export function getAllTypes() {
  const types = new Set();
  pokemonDatabase.forEach(p => p.type.forEach(t => types.add(t)));
  return Array.from(types);
}

