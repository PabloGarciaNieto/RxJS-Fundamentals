import { fromEvent, interval, merge, NEVER } from 'rxjs';
import {  skipUntil, takeUntil, mapTo, switchMap, scan } from 'rxjs/operators';
import { setCount, startButton, pauseButton } from './utilities';

//const start$ = fromEvent(startButton, 'click');
//const pause$ = fromEvent(pauseButton, 'click');

/* First part of the exercise: let spitValues$ = interval(1000);
let subscription;

start$.subscribe(() => {
    subscription = spitValues$.subscribe(setCount);
   }
);

pause$.subscribe(() => {
    subscription.unsubscribe();
}); */

/*Second part of the exercise: let spitValues$ = interval(1000).pipe(
    skipUntil(start$),
    //scan((total) => total + 1, 0), With scan we impose a first value
    takeUntil(pause$)
);
spitValues$.subscribe(setCount); */


const start$ = fromEvent(startButton, 'click').pipe(mapTo(true));
const pause$ = fromEvent(pauseButton, 'click').pipe(mapTo(false));

const spitValues$ = merge(start$, pause$).pipe(
    switchMap((shallItRun) => {
      return shallItRun ? interval(1000) : NEVER;
    }),
    scan((count) => count + 1, 0),//It helps to resume the counting from the las value before stop,
    //cause every time interval(1000) initializes it gives a brand new observable
  );
  
  spitValues$.subscribe(setCount);

