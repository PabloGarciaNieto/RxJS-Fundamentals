import {
  debounceTime,
  distinctUntilChanged,
  fromEvent,
  map,
  mergeMap,
  switchMap,
  tap,
  of,
  merge,
  from,
  filter,
  catchError,
  concat,
  take,
  EMPTY,
  pluck,
  first
} from 'rxjs';

import { fromFetch } from 'rxjs/fetch';

import {
  addResults,
  addResult,
  clearResults,
  endpointFor,
  search,
  form,
  renderPokemon
} from '../pokemon/utilities';

/* ACHTUNG!!! */
//If while working with this file, 
//this error appears in the console:"Cannot read property 'prototype' of undefined"
//checked the top line of this file, if it's => <import  from 'express'>, just remove it.

const endpoint = 'http://localhost:3333/api/pokemon/';

const searchPokemon = (searchTerm) => {
  return fromFetch(endpoint + 'search/' + searchTerm).pipe(
    mergeMap((response) => response.json()),
  );
}

const getPokemonData = (pokemon) => {
  return fromFetch(endpoint + pokemon.id).pipe(
    mergeMap((response) => response.json()),
  );
}

const search$ = fromEvent(form, 'submit').pipe(
  map(() => search.value),
  switchMap(searchPokemon),
  pluck('pokemon'),//"pokemon" is the key of the array in the json response(we want just the array not all the json object of each search)
  mergeMap((pokemon) => pokemon),//Gives us a stream of pokemon observable objects
  first(),//We care just for the first of them all
  switchMap((pokemon) => {
    const pokemon$ = of(pokemon);
    const additionalPokemonData$ = getPokemonData(pokemon).pipe(
      map((data) => ({
        ...pokemon,
        data
      })),
    );
    return merge(pokemon$, additionalPokemonData$);
  }),
  tap(renderPokemon),
);

search$.subscribe(console.log);

