import { IEvents } from '../../base/Events';
import { Component } from '../../base/Component';
import { ensureElement } from '../../../utils/utils';

interface IForm {
  valid: boolean;
  errors: string[];
}

export abstract class Form<T> extends Component<IForm> {
  protected _submit: HTMLButtonElement;
  protected _errors: HTMLElement;

  constructor(protected container: HTMLFormElement, protected events: IEvents) {
    super(container);

    this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
    this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

    this.container.addEventListener('input', (e: Event) => {
      const target = e.target as HTMLInputElement;
      const field = target.name;
      const value = target.value;
      this.events.emit(`${this.container.name}.${field}:change`, { field, value });
    });

    this.container.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      this.events.emit(`${this.container.name}:submit`);
    });
  }

  set valid(value: boolean) {
    this._submit.disabled = !value;
  }

  set errors(value: string) {
    this._errors.textContent = value;
  }

  render(data?: Partial<T>): HTMLElement {
    return super.render(data);
  }
}