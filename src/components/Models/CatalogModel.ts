import { IProduct } from "../../types";
import { IEvents } from "../base/Events"

export class CatalogModel {
  private _items: IProduct[] = [];
  private _selectedItem: IProduct | null = null;

  constructor(protected events: IEvents) {}

  setItems(items: IProduct[]): void {
    this._items = items;
    this.events.emit('catalog:changed', {items: this._items});
  }

  getItems(): IProduct[] {
    return this._items;
  }

  getItem(id: string): IProduct | undefined {
    return this._items.find((item) => item.id === id);
  }

  setSelectedItem(item: IProduct): void {
    this._selectedItem = item;
    this.events.emit('catalog:selected', {item: this._selectedItem});
  }

  getSelectedItem(): IProduct | null {
    return this._selectedItem;
  }
}
