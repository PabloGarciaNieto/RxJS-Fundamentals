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

//Second scenario: There's a delay

const showLoading$ = of(true).pipe(
  delay(+showLoadingForAtLeastField.value),
  tap(() => showLoading(true))
)

const hideLoading$ = of(true).pipe(
  delay(+showLoadingAfterField.value),
  tap(() => showLoading(false))
)

const loading$ = fromEvent(form, 'submit').pipe(
  exhaustMap(() => concat(showLoading$, fetchData(), hideLoading$)),
);

loading$.subscribe();