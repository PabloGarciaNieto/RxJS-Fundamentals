import { fromEvent, of, timer, merge, NEVER } from 'rxjs';
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

//Third scenario: The API return an error
const endpoint = 'http://localhost:3333/api/facts?delay=2000&chaos=true&flakiness=1';//coerce an error

const fetch$ = fromEvent(fetchButton, 'click').pipe(
  exhaustMap(() => {
    return fromFetch(endpoint).pipe(
      tap(clearError),//Remove error message after the API response works again
      mergeMap((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Something went wrong');
        }
      }),
      retry(4),//retry the petition 4 times before catch the error.
    );
  }),
  catchError((error) => {
    return of({error: error.message});//"of" to convert the string into an observable
  }),//cause the "fetch$.subscribe" is waiting an observable in the stream not a primitive 
);

fetch$.subscribe(({facts, error}) => {
  if (error) {
    return setError(error);
  }

  clearFacts();
  addFacts({facts});
}); 