import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

interface IBasket {
  items: HTMLElement[];
  total: number;
}

export class Basket extends Component<IBasket> {
  protected _list: HTMLElement;
  protected _total: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this._list = ensureElement<HTMLElement>('.basket__list', this.container);
    this._total = ensureElement<HTMLElement>('.basket__price', this.container);
    this._button = ensureElement<HTMLButtonElement>('.basket__button', this.container);

    this._button.addEventListener('click', () => {
      events.emit('basket:order');
    });
  }

  set items(items: HTMLElement[]) {
    this._list.replaceChildren(...items);
    const hasRealItems = items.some(item => 
      item.classList.contains('basket__item') || 
      item.querySelector('.card__title, .basket__item-index')
    );
    
    this._button.disabled = !hasRealItems;
  }

  set total(value: number) {
    this._total.textContent = `${value} синапсов`;
  }
}