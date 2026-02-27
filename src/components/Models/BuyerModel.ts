import { IBuyer, TPayment, TValidationErrors } from "../../types";
import { IEvents } from "../base/Events";

export class BuyerModel {
  private _payment: TPayment = "";
  private _address: string = "";
  private _email: string = "";
  private _phone: string = "";

  constructor(protected events: IEvents) {}

  setField<K extends keyof IBuyer>(field: K, value: IBuyer[K]): void {
    switch (field) {
      case "payment":
        this._payment = value as TPayment;
        break;
      case "address":
        this._address = value;
        break;
      case "email":
        this._email = value;
        break;
      case "phone":
        this._phone = value;
        break;
    }
    this.events.emit('buyer:changed', {
      field,
      value,
      data: this.getData(),
      errors: this.validate()
    })
  }

  getData(): IBuyer {
    return {
      payment: this._payment,
      email: this._email,
      phone: this._phone,
      address: this._address,
    };
  }

  clear(): void {
    this._payment = "";
    this._address = "";
    this._email = "";
    this._phone = "";

    this.events.emit('buyer:changed', {
      data: this.getData(),
      errors: this.validate()
    })
  }

  validate(): TValidationErrors {
    const errors: TValidationErrors = {};

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
