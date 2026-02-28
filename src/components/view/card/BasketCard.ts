import { Card, ICardActions } from "./Card";
import { IEvents } from "../../base/Events";
import { ensureElement } from "../../../utils/utils";

export class BasketCard extends Card {
  protected _index: HTMLElement;
  protected _deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    const actions: ICardActions = {
      onClick: () => {},
    };
    super(container, actions);

    this._index = ensureElement<HTMLElement>(".basket__item-index", container);
    this._deleteButton = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      container,
    );

    this._deleteButton.addEventListener("click", () => {
      events.emit("card:removeFromBasket", { id: this._id });
    });
  }

  set index(value: number) {
    this._index.textContent = String(value);
  }
}
