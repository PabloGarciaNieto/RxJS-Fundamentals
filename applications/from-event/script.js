import { fromEvent } from 'rxjs';
import { take } from 'rxjs/operators';

const button = document.getElementById('create-notification');
const notificationMessages = document.getElementById('notification-messages');

const createNotificationElement = () => {
  const element = document.createElement('article');
  element.innerText = 'BOOOOM!';
  return element;
};

const addMessageToDOM = () => {
  const notification = createNotificationElement();
  notificationMessages.appendChild(notification);
};

/**
 * Your mission:
 *
 * - Use `fromEvent` to create an observable that streams click events.
 * - Subscribe to that observable.
 * - Use `addMessageToDOM` to add a useless message to the DOM whenever the
 *   stream emits a value.
 */

const clickAndBoom$ = fromEvent(button, 'click').pipe(take(3));
//With take() I limit the events

clickAndBoom$.subscribe(addMessageToDOM);
clickAndBoom$.subscribe({
  complete: () => setTimeout(() => {
  alert('You have exhausted your three BOOMS.')
 },500)
});




 

 
