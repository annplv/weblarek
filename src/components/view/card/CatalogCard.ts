import { Card } from './Card';
import { ensureElement } from '../../../utils/utils';
import { categoryMap, CDN_URL } from '../../../utils/constants';

export interface ICatalogCardActions {
  onClick: () => void;
}

export class CatalogCard extends Card {
  protected _image: HTMLImageElement;
  protected _category: HTMLElement;

  constructor(container: HTMLElement, actions?: ICatalogCardActions) {
    super(container);

    this._image = ensureElement<HTMLImageElement>('.card__image', container);
    this._category = ensureElement<HTMLElement>('.card__category', container);

    if (actions?.onClick) {
      container.addEventListener('click', actions.onClick);
    }
  }

  set image(value: string) {
    const pngPath = value.replace('.svg', '.png');
    const fullUrl = `${CDN_URL}${pngPath}`;
    this.setImage(this._image, fullUrl, this.title);
  }

  set category(value: string) {
    this._category.textContent = value;
    
    const categoryClasses = Object.values(categoryMap);
    this._category.classList.remove(...categoryClasses);
    
    const categoryClass = categoryMap[value as keyof typeof categoryMap] || categoryMap['другое'];
    this._category.classList.add(categoryClass);
  }
}
