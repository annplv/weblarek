import { IApi, IProduct, IOrder, IOrderResult, IProductsResponse } from "../types";

export class AppApi {
  private _api: IApi;

  constructor(api: IApi) {
    this._api = api;
  }

  async getProductList(): Promise<IProduct[]> {
    const response = await this._api.get<IProductsResponse>("/product");
    return response.items;
  }

  async postOrder(order: IOrder): Promise<IOrderResult | null> {
    const response = await this._api.post<IOrderResult>("/order", order);
    return response;
  }
}
