import { Form } from './Form';
import { IEvents } from '../../base/Events';
import { ensureElement } from '../../../utils/utils';
import { TPayment } from '../../../types';

interface IOrderForm {
  payment: TPayment;
  address: string;
}

export class OrderForm extends Form<IOrderForm> {
  protected _paymentButtons: HTMLButtonElement[];
  protected _addressInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this._paymentButtons = Array.from(this.container.querySelectorAll('.button_alt'));
    this._addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);

    this._paymentButtons.forEach(button => {
      button.addEventListener('click', () => {
        const paymentType = button.name as TPayment;
        this.events.emit('order.payment:change', { payment: paymentType });
      });
    });
  }

  set payment(value: TPayment) {
    this._paymentButtons.forEach(button => {
      button.classList.remove('button_alt-active');
      
      if (button.name === value) {
        button.classList.add('button_alt-active');
      }
    });
  }

  set address(value: string) {
    this._addressInput.value = value;
  }
}