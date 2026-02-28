import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";
import { categoryMap } from "../../../utils/constants";

export interface ICard {
  id: string;
  title: string;
  price: number | null;
  image?: string;
  category?: string;
  description?: string;
  buttonText?: string;
}

export interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

export abstract class Card extends Component<ICard> {
  protected _id: string = "";
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _image?: HTMLImageElement;
  protected _category?: HTMLElement;
  protected _description?: HTMLElement;
  protected _button?: HTMLButtonElement;

  constructor(
    protected container: HTMLElement,
    actions?: ICardActions,
  ) {
    super(container);

    this._title = ensureElement<HTMLElement>(".card__title", container);
    this._price = ensureElement<HTMLElement>(".card__price", container);

    this._image = container.querySelector(".card__image") as HTMLImageElement;
    this._category = container.querySelector(".card__category") as HTMLElement;
    this._description = container.querySelector(".card__text") as HTMLElement;
    this._button = container.querySelector(
      ".card__button",
    ) as HTMLButtonElement;

    if (actions?.onClick) {
      if (this._button) {
        this._button.addEventListener("click", actions.onClick);
      } else {
        container.addEventListener("click", actions.onClick);
      }
    }
  }

  set id(value: string) {
    this._id = value;
  }

  set title(value: string) {
    this._title.textContent = value;
  }

  set price(value: number | null) {
    this._price.textContent = value ? `${value} синапсов` : "Бесценно";
    if (this._button && !value) {
      this._button.disabled = true;
    }
  }

  set buttonDisabled(disabled: boolean) {
    if (this._button) {
      this._button.disabled = disabled;
    }
  }

  set image(value: string) {
    if (this._image) {
      const pngPath = value.replace(".svg", ".png");
      const fullUrl = `https://larek-api.nomoreparties.co/content/weblarek${pngPath}`;

      console.log("Загружаем PNG:", fullUrl);
      this.setImage(this._image, fullUrl, this.title);
    }
  }

  set category(value: string) {
    if (this._category) {
      this._category.textContent = value;

      const categoryClasses = Object.values(categoryMap);
      this._category.classList.remove(...categoryClasses);
      const categoryClass = categoryMap[value as keyof typeof categoryMap];

      if (categoryClass) {
        this._category.classList.add(categoryClass);
      }
    }
  }

  set description(value: string) {
    if (this._description) {
      this._description.textContent = value;
    }
  }

  set buttonText(value: string) {
    if (this._button) {
      this._button.textContent = value;
    }
  }
}
