import { IApi, IProduct, IOrder, IOrderResult } from "../types";

export class AppApi {
  private _api: IApi;

  constructor(api: IApi) {
    this._api = api;
  }

  async getProductList(): Promise<IProduct[]> {
    try {
      const response = await this._api.get<{ items: IProduct[] }>("/product");
      return response.items;
    } catch (error) {
      console.error("Ошибка при получении товаров:", error);
      return [];
    }
  }

  async postOrder(order: IOrder): Promise<IOrderResult | null> {
    try {
      const response = await this._api.post<IOrderResult>("/order", order);
      return response;
    } catch (error) {
      console.error("Ошибка при отправке заказа:", error);
      return null;
    }
  }
}
