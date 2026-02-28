import { Card } from './Card';
import { ensureElement } from '../../../utils/utils';
import { CDN_URL } from '../../../utils/constants';

export interface IPreviewCardActions {
  onAddToBasket: () => void;
}

export class PreviewCard extends Card {
  protected _image: HTMLImageElement;
  protected _category: HTMLElement;
  protected _description: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: IPreviewCardActions) {
    super(container);

    this._image = ensureElement<HTMLImageElement>('.card__image', container);
    this._category = ensureElement<HTMLElement>('.card__category', container);
    this._description = ensureElement<HTMLElement>('.card__text', container);
    this._button = ensureElement<HTMLButtonElement>('.card__button', container);

    if (actions?.onAddToBasket) {
      this._button.addEventListener('click', actions.onAddToBasket);
    }
  }

  set image(value: string) {
    const pngPath = value.replace('.svg', '.png');
    const fullUrl = `${CDN_URL}${pngPath}`;
    this.setImage(this._image, fullUrl, this.title);
  }

  set category(value: string) {
    this._category.textContent = value;
  }

  set description(value: string) {
    this._description.textContent = value;
  }

  set buttonText(value: string) {
    this._button.textContent = value;
  }

  set buttonDisabled(value: boolean) {
    this._button.disabled = value;
  }
}