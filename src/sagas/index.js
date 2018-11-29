import { takeLatest, call, put } from "redux-saga/effects";
import axios from "axios";
import { getRandomInt } from "../lib/random";

const MAX_POKEMON = 802;
const ENGLISH_LANGUAGE = "en";

export function* watcherSaga() {
  yield takeLatest("API_CALL_REQUEST", workerSaga);
}

function getPokemon(pokemonID) {
  return axios.all([
    axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonID}`),
    axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonID}`)
  ]);
}

function* workerSaga() {
  try {
    let pokemonID = getRandomInt(MAX_POKEMON);

    const response = yield call(getPokemon, pokemonID);

    const pokemonData = response[0].data;
    const speciesData = response[1].data;

    const englishText = speciesData.flavor_text_entries.find(item => {
      return item.language.name == ENGLISH_LANGUAGE;
    });

    const pokemon = {
      name: pokemonData.name,
      image: pokemonData.sprites.front_default,
      types: pokemonData.types,
      description: englishText.flavor_text
    };

    yield put({ type: "API_CALL_SUCCESS", pokemon });
  } catch (error) {
    yield put({ type: "API_CALL_FAILURE", error });
  }
}
