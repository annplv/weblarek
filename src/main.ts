import "./scss/styles.scss";
import { CatalogModel } from "./components/Models/CatalogModel";
import { CartModel } from "./components/Models/CartModel";
import { BuyerModel } from "./components/Models/BuyerModel";
import { apiProducts } from "./utils/data";
import { AppApi } from "./types/index.ts";
import { Api } from "./components/base/Api.ts";
import { API_URL } from "./utils/constants";

const catalogModel = new CatalogModel();
catalogModel.setItems(apiProducts.items);
console.log("Массив товаров из каталога:", catalogModel.getItems());
const firstItem = catalogModel.getItem("1");
console.log('товар с id "1":', firstItem);
if (firstItem) {
  catalogModel.setSelectedItem(firstItem);
  console.log("Выбранный товар:", catalogModel.getSelectedItem());
}

const cartModel = new CartModel();
cartModel.addItem(apiProducts.items[0]);
cartModel.addItem(apiProducts.items[1]);
console.log("Товары в корзине после добавления:", cartModel.getItems());
console.log("Количество товаров:", cartModel.getItemCount());
console.log("Общая стоимость:", cartModel.getTotalPrice());

console.log('Товар с id "1" в корзине?', cartModel.hasItem("1"));
console.log(
  'Товар с id "c101ab44-ed99-4a54-990d-47aa2bb4e7d9" в корзине?',
  cartModel.hasItem("c101ab44-ed99-4a54-990d-47aa2bb4e7d9"),
);

cartModel.removeItem(apiProducts.items[0]);
console.log("Товары после удаления:", cartModel.getItems());

cartModel.clear();
console.log("После очистки:", cartModel.getItems());

const buyerModel = new BuyerModel();
buyerModel.setField("payment", "online");
buyerModel.setField("address", "ул. Пушкина, д. 10");
buyerModel.setField("email", "no-reply@ya.ru");
buyerModel.setField("phone", "+79998884567");

console.log("Все данные покупателя:", buyerModel.getData());

console.log("Ошибки валидации:", buyerModel.validate());

buyerModel.clear();
console.log("После очистки:", buyerModel.getData());

const api = new Api(API_URL);
const appApi = new AppApi(api);
appApi
  .getProductList()
  .then((products) => {
    console.log("Товары, полученные с сервера:", products);
    catalogModel.setItems(products);
    console.log("Каталог после сохранения:", catalogModel.getItems());

    if (products.length > 0) {
      const firstProduct = products[0];
      console.log("Первый товар:", firstProduct);
      catalogModel.setSelectedItem(firstProduct);
      console.log("Выбранный товар:", catalogModel.getSelectedItem());
    }

    if (products.length >= 2) {
      cartModel.addItem(products[0]);
      cartModel.addItem(products[1]);
      console.log("Товары в корзине:", cartModel.getItems());
      console.log("Количество товаров:", cartModel.getItemCount());
      console.log("Общая стоимость:", cartModel.getTotalPrice());

      buyerModel.setField("payment", "online");
      buyerModel.setField("address", "ул. Пушкина, д. 10");
      buyerModel.setField("email", "no-reply@ya.ru");
      buyerModel.setField("phone", "+79998884567");
      const order = {
        ...buyerModel.getData(),
        items: cartModel.getItems().map((item) => item.id),
      };
      console.log("Данные для отправки заказа:", order);
    }
  })
  .catch((error) => {
    console.error("Не удалось получить товары с сервера", error);
  });
