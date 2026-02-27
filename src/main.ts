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

const events = new EventEmitter();

const catalogModel = new CatalogModel(events);
const cartModel = new CartModel(events);
const buyerModel = new BuyerModel(events);

const api = new Api(API_URL);
const appApi = new AppApi(api);

const header = new Header(events, ensureElement<HTMLElement>('.header'));
const gallery = ensureElement<HTMLElement>('.gallery');
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

appApi.getProductList()
  .then(products => {
    catalogModel.setItems(products);
  })
  .catch(error => {
    console.error('Ошибка загрузки товаров:', error);
  });

events.on('catalog:changed', () => {
  const items = catalogModel.getItems();
  gallery.innerHTML = '';
  
  items.forEach(item => {
    const card = new CatalogCard(
      cloneTemplate<HTMLElement>(cardCatalogTemplate),
      events
    );
    
    card.id = item.id;
    card.title = item.title;
    card.price = item.price;
    card.image = item.image;
    card.category = item.category;
    
    gallery.appendChild(card.render());
  });
});

events.on('card:select', (data: { id: string }) => {
  const item = catalogModel.getItem(data.id);
  if (item) {
    catalogModel.setSelectedItem(item);
  }
});

events.on('catalog:selected', () => {
  const item = catalogModel.getSelectedItem();
  if (!item) return;
  
  const isInBasket = cartModel.hasItem(item.id);
  const buttonText = item.price === null 
    ? 'Недоступно'                    
    : isInBasket 
      ? 'Убрать из корзины'           
      : 'В корзину';                   
  
  const card = new PreviewCard(cloneTemplate<HTMLElement>(cardPreviewTemplate), events);
  
  card.id = item.id;
  card.title = item.title;
  card.price = item.price;
  card.image = item.image;
  card.category = item.category;
  card.description = item.description;
  card.buttonText = buttonText;           
  card.buttonDisabled = item.price === null; 
  
  modal.content = card.render();
  modal.open();
});

events.on('card:addToBasket', (data: { id: string }) => {
  const item = catalogModel.getItem(data.id);
  if (!item) return;
  
  if (cartModel.hasItem(item.id)) {
    cartModel.removeItem(item);
  } else {
    cartModel.addItem(item);
  }
  modal.close();
});

events.on('card:removeFromBasket', (data: { id: string }) => {
  const item = catalogModel.getItem(data.id);
  if (item) {
    cartModel.removeItem(item);
  }
});

events.on('cart:changed', () => {
  header.counter = cartModel.getItemCount();
  
  const currentContent = modal['_content'].children[0];
  if (currentContent?.classList.contains('basket')) {
    updateBasketView();
  }
});

function updateBasketView() {
  const items = cartModel.getItems();
  const basket = new Basket(cloneTemplate<HTMLElement>(basketTemplate), events);
  
  if (items.length === 0) {
    basket.items = [];
    basket.total = 0;
  } else {
    const cardElements = items.map((item, index) => {
      const card = new BasketCard(cloneTemplate<HTMLElement>(cardBasketTemplate), events);
      card.id = item.id;
      card.title = item.title;
      card.price = item.price;
      card.index = index + 1;
      return card.render();
    });
    basket.items = cardElements;
    basket.total = cartModel.getTotalPrice();
  }
  
  modal.content = basket.render();
}

events.on('basket:open', () => {
  updateBasketView();
  modal.open();
});

events.on('basket:order', () => {
  const orderForm = new OrderForm(cloneTemplate<HTMLFormElement>(orderTemplate), events);
  
  const buyerData = buyerModel.getData();
  orderForm.payment = buyerData.payment;
  orderForm.address = buyerData.address;
  
  modal.content = orderForm.render();
});

events.on('order.payment:change', (data: { payment: TPayment }) => {
  buyerModel.setField('payment', data.payment);
});

events.on('order.address:change', (data: { value: string }) => {
  buyerModel.setField('address', data.value);
});

events.on('order:submit', () => {
  const errors = buyerModel.validate();
  const requiredFields = ['payment', 'address'];
  const hasErrors = requiredFields.some(field => errors[field as keyof typeof errors]);
  
  if (!hasErrors) {
    const contactsForm = new ContactsForm(cloneTemplate<HTMLFormElement>(contactsTemplate), events);
    
    const buyerData = buyerModel.getData();
    contactsForm.email = buyerData.email;
    contactsForm.phone = buyerData.phone;
    
    modal.content = contactsForm.render();
  }
});

events.on('contacts.email:change', (data: { value: string }) => {
  buyerModel.setField('email', data.value);
});

events.on('contacts.phone:change', (data: { value: string }) => {
  buyerModel.setField('phone', data.value);
});

events.on('buyer:changed', () => {
  const errors = buyerModel.validate();
  const orderErrors = ['payment', 'address'].filter(field => errors[field as keyof typeof errors]);
  const contactsErrors = ['email', 'phone'].filter(field => errors[field as keyof typeof errors]);
  
  const currentContent = modal['_content'].children[0];
  
  if (currentContent?.classList.contains('form')) {
    const formName = (currentContent as HTMLFormElement).name;
    
    if (formName === 'order') {
      const form = currentContent as HTMLFormElement;
      const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
      if (submitButton) {
        submitButton.disabled = orderErrors.length > 0;
      }
      const errorSpan = form.querySelector('.form__errors') as HTMLElement;
      if (errorSpan) {
        errorSpan.textContent = orderErrors.map(f => errors[f as keyof typeof errors]).join(', ');
      }
    }
    
    if (formName === 'contacts') {
      const form = currentContent as HTMLFormElement;
      const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
      if (submitButton) {
        submitButton.disabled = contactsErrors.length > 0;
      }
      const errorSpan = form.querySelector('.form__errors') as HTMLElement;
      if (errorSpan) {
        errorSpan.textContent = contactsErrors.map(f => errors[f as keyof typeof errors]).join(', ');
      }
    }
  }
});

events.on('contacts:submit', () => {
  const errors = buyerModel.validate();
  
  if (Object.keys(errors).length === 0) {
    const order = {
      ...buyerModel.getData(),
      total: cartModel.getTotalPrice(),
      items: cartModel.getItems().map(item => item.id)
    };
    
    appApi.postOrder(order)
      .then(result => {
        if (result) { 
          cartModel.clear();
          buyerModel.clear();
          
          const success = new Success(cloneTemplate<HTMLElement>(successTemplate), events);
          success.total = result.total;
          
          modal.content = success.render();
        }
      })
      .catch(error => {
        console.error('Ошибка оформления заказа:', error);
      });
  }
});

events.on('success:close', () => {
  modal.close();
});