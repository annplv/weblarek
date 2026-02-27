import { Card, ICardActions } from './Card';
import { IEvents } from '../../base/Events';

export class CatalogCard extends Card {
  constructor(container: HTMLElement, events: IEvents) {
    const actions: ICardActions = {
      onClick: () => {
        events.emit('card:select', { id: this._id });
      }
    };
    super(container, actions);
  }
}