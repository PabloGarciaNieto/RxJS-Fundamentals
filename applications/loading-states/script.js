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

const loading$ = fromEvent(form, 'submit').pipe(
  tap(() => showLoading(true)),
  exhaustMap(() => fetchData()),
  tap(() => showLoading(false))
);

loading$.subscribe();