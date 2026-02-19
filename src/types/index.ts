export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods,
  ): Promise<T>;
}

export type TPayment = "online" | "cash";

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

export interface IOrder {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
  items: string[];
}

export interface IOrderResult {
  id: string;
  total: number;
}

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
