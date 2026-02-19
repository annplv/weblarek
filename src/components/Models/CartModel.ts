import { IProduct } from "../../types";

export class CartModel {
  private _items: IProduct[] = [];

  getItems(): IProduct[] {
    return this._items;
  }

  addItem(item: IProduct): void {
    this._items.push(item);
  }

  removeItem(item: IProduct): void {
    const i = this._items.findIndex((i) => i.id === item.id);
    if (i !== -1) {
      this._items.splice(i, 1);
    }
  }

  clear(): void {
    this._items = [];
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
