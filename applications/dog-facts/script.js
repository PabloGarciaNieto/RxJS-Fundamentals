import { fromEvent, of, timer, merge, NEVER, pipe } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import {
  catchError,
  exhaustMap,
  mapTo,
  mergeMap,
  retry,
  startWith,
  switchMap,
  tap,
  pluck,
} from 'rxjs/operators';

import {
  fetchButton,
  stopButton,
  clearError,
  clearFacts,
  addFacts,
  setError,
} from './utilities';

/* ACHTUNG!!! */
//If while working with this file, 
//this error appears in the console:"Cannot read property 'prototype' of undefined"
//checked the top line of this file, if it's => <import  from 'express'>, just remove it.

//Fourth scenario: 
const endpoint = 'http://localhost:3333/api/facts';
//\-----?flakiness=2 to coerce errors and check if the catch error works properly

//Fetch the data from the API, catch errors and display some UI, retry the petition in case of error
//
const fetchData = () => {
  return fromFetch(endpoint).pipe(
    mergeMap((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    }),
    retry(4),//retry the petition 4 times before catch the error.
    catchError((error) => {
      return of({error: error.message});//"of" to convert the string into an observable
    }),//cause the "fetch$.subscribe" is waiting an observable in the stream not a primitive 
  );
}

const fetch$ = fromEvent(fetchButton, 'click').pipe(mapTo(true));//Start the fetch stream
const stop$ = fromEvent(stopButton, 'click').pipe(mapTo(false));//Stop the fetch stream

const factStream$ = merge(fetch$, stop$).pipe(
  switchMap(shouldFetch => {
    if (shouldFetch) {
      return timer(0, 5000).pipe(//Start inmediately and fetch a new petition every 5 seconds
        tap(() => {//Clean before each data fetch
          clearError();
          clearFacts();
        }),
        exhaustMap(fetchData)//Fetch the data one by one(exhaustMap)
      );
    } else {
      return NEVER;//Stop the fetch stream
    }
  }),
);

factStream$.subscribe(addFacts); 