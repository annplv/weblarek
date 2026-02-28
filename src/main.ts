import "./scss/styles.scss";
import { CatalogModel } from "./components/Models/CatalogModel";
import { CartModel } from "./components/Models/CartModel";
import { BuyerModel } from "./components/Models/BuyerModel";
import { AppApi } from "./components/AppApi";
import { Api } from "./components/base/Api";
import { EventEmitter } from "./components/base/Events";
import { API_URL } from "./utils/constants";
import { cloneTemplate, ensureElement } from "./utils/utils";
import { TPayment } from "./types";

import { Header } from "./components/view/Header";
import { Modal } from "./components/view/Modal";
import { CatalogCard } from "./components/view/card/CatalogCard";
import { PreviewCard } from "./components/view/card/PreviewCard";
import { BasketCard } from "./components/view/card/BasketCard";
import { Basket } from "./components/view/Basket";
import { OrderForm } from "./components/view/form/OrderForm";
import { ContactsForm } from "./components/view/form/ContactsForm";
import { Success } from "./components/view/Success";
import { Gallery } from "./components/view/Gallery";

const events = new EventEmitter();

const catalogModel = new CatalogModel(events);
const cartModel = new CartModel(events);
const buyerModel = new BuyerModel(events);

const api = new Api(API_URL);
const appApi = new AppApi(api);

const header = new Header(events, ensureElement<HTMLElement>(".header"));
const gallery = new Gallery(ensureElement<HTMLElement>(".gallery"));
const modal = new Modal(ensureElement<HTMLElement>("#modal-container"), events);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>("#card-preview");
const cardBasketTemplate = ensureElement<HTMLTemplateElement>("#card-basket");
const basketTemplate = ensureElement<HTMLTemplateElement>("#basket");
const orderTemplate = ensureElement<HTMLTemplateElement>("#order");
const contactsTemplate = ensureElement<HTMLTemplateElement>("#contacts");
const successTemplate = ensureElement<HTMLTemplateElement>("#success");

const previewCard = new PreviewCard(
  cloneTemplate<HTMLElement>(cardPreviewTemplate),
  {
    onAddToBasket: () => {
      const currentItem = catalogModel.getSelectedItem();
      if (currentItem) {
        if (cartModel.hasItem(currentItem.id)) {
          cartModel.removeItem(currentItem);
        } else {
          cartModel.addItem(currentItem);
        }
      }
      modal.close();
    }
  }
);

const basket = new Basket(
  cloneTemplate<HTMLElement>(basketTemplate),
  events
);

const orderForm = new OrderForm(
  cloneTemplate<HTMLFormElement>(orderTemplate),
  events
);

const contactsForm = new ContactsForm(
  cloneTemplate<HTMLFormElement>(contactsTemplate),
  events
);

const success = new Success(
  cloneTemplate<HTMLElement>(successTemplate),
  events
);

appApi
  .getProductList()
  .then((products) => {
    catalogModel.setItems(products);
  })
  .catch((error) => {
    console.error("Ошибка загрузки товаров:", error);
  });

events.on("catalog:changed", () => {
  const items = catalogModel.getItems();
  
  const cardElements = items.map((item) => {
    const card = new CatalogCard(
      cloneTemplate<HTMLElement>(cardCatalogTemplate),
      {
        onClick: () => events.emit('card:select', { id: item.id })
      }
    );

    card.title = item.title;
    card.price = item.price;
    card.image = item.image;
    card.category = item.category;

    return card.render();
  });

  gallery.items = cardElements;
});

events.on("card:select", (data: { id: string }) => {
  const item = catalogModel.getItem(data.id);
  if (item) {
    catalogModel.setSelectedItem(item);
  }
});

events.on("catalog:selected", () => {
  const item = catalogModel.getSelectedItem();
  if (!item) return;

  const isInBasket = cartModel.hasItem(item.id);
  const buttonText =
    item.price === null
      ? "Недоступно"
      : isInBasket
        ? "Удалить из корзины"
        : "В корзину";

  previewCard.title = item.title;
  previewCard.price = item.price;
  previewCard.image = item.image;
  previewCard.category = item.category;
  previewCard.description = item.description;
  previewCard.buttonText = buttonText;
  previewCard.buttonDisabled = item.price === null;

  modal.content = previewCard.render();
  modal.open();
});

events.on("card:removeFromBasket", (data: { id: string }) => {
  const item = catalogModel.getItem(data.id);
  if (item) {
    cartModel.removeItem(item);
  }
});

function updateBasketContent() {
  const items = cartModel.getItems();
  
  if (items.length === 0) {
    basket.items = [];
    basket.total = 0;
  } else {
    const cardElements = items.map((item, index) => {
      const card = new BasketCard(
        cloneTemplate<HTMLElement>(cardBasketTemplate),
        {
          onDelete: () => {
            const product = catalogModel.getItem(item.id);
            if (product) {
              cartModel.removeItem(product);
            }
          }
        }
      );
      card.title = item.title;
      card.price = item.price;
      card.index = index + 1;
      return card.render();
    });
    basket.items = cardElements;
    basket.total = cartModel.getTotalPrice();
  }
}

events.on("cart:changed", () => {
  header.counter = cartModel.getItemCount();
  updateBasketContent();
  if (modal.isOpen()) {
    modal.content = basket.render();
  }
});

events.on("basket:open", () => {
  modal.content = basket.render();
  modal.open();
});

events.on("basket:order", () => {
  const buyerData = buyerModel.getData();
  orderForm.payment = buyerData.payment;
  orderForm.address = buyerData.address;

  modal.content = orderForm.render();
});

events.on("order.payment:change", (data: { payment: TPayment }) => {
  buyerModel.setField("payment", data.payment);
});

events.on("order.address:change", (data: { value: string }) => {
  buyerModel.setField("address", data.value);
});

events.on("order:submit", () => {
  const buyerData = buyerModel.getData();
  contactsForm.email = buyerData.email;
  contactsForm.phone = buyerData.phone;

  modal.content = contactsForm.render();
});

events.on("contacts.email:change", (data: { value: string }) => {
  buyerModel.setField("email", data.value);
});

events.on("contacts.phone:change", (data: { value: string }) => {
  buyerModel.setField("phone", data.value);
});

events.on("buyer:changed", () => {
  const buyerData = buyerModel.getData();
  const errors = buyerModel.validate();
  
  orderForm.payment = buyerData.payment;
  orderForm.address = buyerData.address;
  
  contactsForm.email = buyerData.email;
  contactsForm.phone = buyerData.phone;

  const orderErrors = ["payment", "address"]
    .map(field => errors[field as keyof typeof errors])
    .filter(error => error !== undefined);
    
  const contactsErrors = ["email", "phone"]
    .map(field => errors[field as keyof typeof errors])
    .filter(error => error !== undefined);

  orderForm.valid = orderErrors.length === 0;
  orderForm.errors = orderErrors.join(", ");

  contactsForm.valid = contactsErrors.length === 0;
  contactsForm.errors = contactsErrors.join(", ");
});

events.on("contacts:submit", () => {
  const order = {
    ...buyerModel.getData(),
    total: cartModel.getTotalPrice(),
    items: cartModel.getItems().map((item) => item.id),
  };

  appApi
    .postOrder(order)
    .then((result) => {
      if (result) {
        cartModel.clear();
        buyerModel.clear();

        success.total = result.total;
        modal.content = success.render();
      }
    })
    .catch((error) => {
      console.error("Ошибка оформления заказа:", error);
    });
});

events.on("success:close", () => {
  modal.close();
});
