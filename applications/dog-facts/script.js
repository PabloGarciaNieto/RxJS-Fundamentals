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

// First part of exercise, where we asume that the server never goes down(pure Utopia jajaja)
const endpoint = 'http://localhost:3333/api/facts';

const fetch$ = fromEvent(fetchButton, 'click').pipe(
  mergeMap(() => {
    return fromFetch(endpoint).pipe(mergeMap((response) => response.json()));
  })
);

fetch$.subscribe(addFacts); 

