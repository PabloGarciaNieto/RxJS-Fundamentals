import { fromEvent, concat, of, race, timer } from 'rxjs';
import { tap, exhaustMap, delay, shareReplay, first } from 'rxjs/operators';

import {
  responseTimeField,
  showLoadingAfterField,
  showLoadingForAtLeastField,
  loadingStatus,
  showLoading,
  form,
  fetchData,
} from './utilities';

//Third scenario: Racing Data between whether or not show the loading and whether the data came back

const loading$ = fromEvent(form, 'submit').pipe(
  exhaustMap(() => {
    const data$ = fetchData().pipe(shareReplay(1));

    const showLoading$ = of(true).pipe(
      delay(+showLoadingAfterField.value),
      tap((value) => showLoading(value))
    )
    
    const timeToHideTheLoading$ = timer(+showLoadingForAtLeastField.value).pipe(
      first()
    );

    const shouldShowLoading$ = concat(//Concat because we through a event into 
      showLoading$,//the future of showing the loading, soon as we show the loading 
      timeToHideTheLoading$,//then we set a timer for the bare minimum to take it down
      data$.pipe(tap(() => showLoading(false)))//then if we don't have the data, keep waiting for it and take down the loading
    );

    return race(data$, shouldShowLoading$)//But if the data comes back before any of this, it wins(race)
  }),
);

loading$.subscribe();