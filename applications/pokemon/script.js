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
  map((event) => event.target.value),  
  mergeMap((searchTerm) => {
    return fromFetch(endpoint + searchTerm).pipe(
      mergeMap((response) => response.json())
    );
  }),
  tap(clearResults),
  pluck('pokemon'),//"pokemon" is the key of the array in the json response
  tap(addResults),
);

search$.subscribe();

