import "./scss/styles.scss";
import { CatalogModel } from "./components/Models/CatalogModel";
import { CartModel } from "./components/Models/CartModel";
import { BuyerModel } from "./components/Models/BuyerModel";
import { apiProducts } from "./utils/data";
import { AppApi } from "./components/AppApi.ts";
import { Api } from "./components/base/Api.ts";
import { API_URL } from "./utils/constants";

const catalogModel = new CatalogModel();
catalogModel.setItems(apiProducts.items);
console.log("Массив товаров из каталога:", catalogModel.getItems());
const testItem = catalogModel.getItem("854cef69-976d-4c2a-a18c-2aa45046c390");
console.log('товар с id "854cef69-976d-4c2a-a18c-2aa45046c390":', testItem);
if (testItem) {
  catalogModel.setSelectedItem(testItem);
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

buyerModel.setField("payment", "online");
buyerModel.setField("address", " "); //пробел, email пропущен
buyerModel.setField("phone", "+79998884567");
console.log("Все данные покупателя:", buyerModel.getData());
console.log("Ошибки валидации:", buyerModel.validate());

console.log("После очистки:", buyerModel.getData());

const api = new Api(API_URL);
const appApi = new AppApi(api);
appApi
  .getProductList()
  .then((products) => {
    console.log("Товары, полученные с сервера:", products);
    catalogModel.setItems(products);
    console.log("Каталог после сохранения:", catalogModel.getItems());
    console.log('Всего товаров:', catalogModel.getItems().length);
    console.log('Первый товар:', catalogModel.getItems()[0]);
  })
  .catch((error) => {
    console.error("Не удалось получить товары с сервера", error);
  });
