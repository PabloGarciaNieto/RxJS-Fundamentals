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
  pluck
} from 'rxjs';

import { fromFetch } from 'rxjs/fetch';

import {
  addResults,
  addResult,
  clearResults,
  endpointFor,
  search,
  form,
} from '../pokemon/utilities';

/* ACHTUNG!!! */
//If while working with this file, 
//this error appears in the console:"Cannot read property 'prototype' of undefined"
//checked the top line of this file, if it's => <import  from 'express'>, just remove it.

const endpoint = 'http://localhost:3333/api/pokemon/search/';

const search$ = fromEvent(search, 'input').pipe(
  debounceTime(300),//CAVEAT this makes the fetch only after 300ms so we wouldn't need the "switchMap((searchTerm)..." below, just a "mergeMap((searchTerm)...."
  map((event) => event.target.value),
  switchMap((searchTerm) => {//As now we have some delay we don't care about the previous request "p".."pi"..."pik" So we use switchMap
    //switchMap not only don't care about that petitions it cancels them either.
    return fromFetch(endpoint + searchTerm + '?delay=1000&chaos=true').pipe(//'?delay=1000&chaos=true'=> coerced to see behaviour 
      mergeMap((response) => response.json())
    );
  }),
  tap(clearResults),
  pluck('pokemon'),//"pokemon" is the key of the array in the json response(we want just the array not all the json object of each search)
  tap(addResults),
);

search$.subscribe();

