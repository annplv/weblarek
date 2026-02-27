import { IProduct } from "../../types";
import { IEvents } from "../base/Events"

export class CartModel {
  private _items: IProduct[] = [];

  constructor(protected events: IEvents) {}

  getItems(): IProduct[] {
    return this._items;
  }

  addItem(item: IProduct): void {
    this._items.push(item);
    this.events.emit('cart:changed', {
      items: this._items,
      count: this.getItemCount(),
      total: this.getTotalPrice()
    })
  }

  removeItem(item: IProduct): void {
    const i = this._items.findIndex((i) => i.id === item.id);
    if (i !== -1) {
      this._items.splice(i, 1);
      this.events.emit('cart:changed', {
      items: this._items,
      count: this.getItemCount(),
      total: this.getTotalPrice()
    })
    }
  }

  clear(): void {
    this._items = [];
    this.events.emit('cart:changed', {
      items: this._items,
      count: 0,
      total: 0
    })
  }

  getTotalPrice(): number {
    return this._items.reduce((sum, curr) => {
      return sum + (curr.price || 0);
    }, 0);
  }

  getItemCount(): number {
    return this._items.length;
  }

  hasItem(id: string): boolean {
    return this._items.some((item) => item.id === id);
  }
}
