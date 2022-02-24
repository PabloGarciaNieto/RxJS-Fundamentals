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

//Second scenario: A slow API response.
const endpoint = 'http://localhost:3333/api/facts?delay=2000&chaos=true';//coerce a server delay

const fetch$ = fromEvent(fetchButton, 'click').pipe(
  exhaustMap(() => {
    return fromFetch(endpoint).pipe(mergeMap((response) => response.json()));
  })
);

fetch$.subscribe(addFacts);  
//With exhaustMap until the pending petition is not resolve, you can`t make a new one
//This allow to deal with them one by one.