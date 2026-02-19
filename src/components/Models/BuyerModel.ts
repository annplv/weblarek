import { IBuyer, TPayment } from "../../types";

export class BuyerModel {
  private _payment: TPayment | null = null;
  private _address: string = "";
  private _email: string = "";
  private _phone: string = "";

  setField<K extends keyof IBuyer>(field: K, value: IBuyer[K]): void {
    switch (field) {
      case "payment":
        this._payment = value as TPayment;
        break;
      case "address":
        this._address = value as string;
        break;
      case "email":
        this._email = value as string;
        break;
      case "phone":
        this._phone = value as string;
        break;
    }
  }

  getData(): IBuyer {
    return {
      payment: this._payment as TPayment,
      email: this._email,
      phone: this._phone,
      address: this._address,
    };
  }

  clear(): void {
    this._payment = null;
    this._address = "";
    this._email = "";
    this._phone = "";
  }

  validate(): Partial<Record<keyof IBuyer, string>> {
    const errors: Partial<Record<keyof IBuyer, string>> = {};

    if (!this._payment) {
      errors.payment = "Не выбран способ оплаты";
    }

    if (!this._address.trim()) {
      errors.address = "Укажите адрес";
    }

    if (!this._email.trim()) {
      errors.email = "Укажите email";
    }

    if (!this._phone.trim()) {
      errors.phone = "Укажите телефон";
    }

    return errors;
  }
}
