import {settings, select, classNames, templates } from '../settings.js';
import utils from '../utils.js';
import CartProduct from './CartProduct.js';

class Cart{
  constructor(element){
    const thisCart = this;
    thisCart.products = [];
    thisCart.getElements(element);
    thisCart.initActions();	  
  }
  getElements(element){
    const thisCart = this;
    thisCart.dom = {};
    thisCart.dom.wrapper = element;
    thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
    thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);
    thisCart.dom.totalPrice = thisCart.dom.wrapper.querySelectorAll(select.cart.totalPrice);
    thisCart.dom.deliveryFee = thisCart.dom.wrapper.querySelector(select.cart.deliveryFee);
    thisCart.dom.subTotalPrice = thisCart.dom.wrapper.querySelector(select.cart.subtotalPrice);
    thisCart.dom.totalNumber = thisCart.dom.wrapper.querySelector(select.cart.totalNumber);
    thisCart.dom.form = element.querySelector(select.cart.form);
  }
  initActions() {
    const thisCart = this;

    thisCart.dom.toggleTrigger.addEventListener('click', function() {
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
    });
    thisCart.dom.productList.addEventListener('updated', function() {
      thisCart.update();
    });
    thisCart.dom.productList.addEventListener('remove', function(event) {
      thisCart.remove(event.detail.cartProduct);
    });
    thisCart.dom.form.addEventListener('submit', function(event) {
      event.preventDefault();
      thisCart.sendOrder();
    });
  }
  add(menuProduct){
    //const thisCart = this;
    const thisCart = this;
    const generatedHTML = templates.cartProduct(menuProduct);
    const generatedDOM = utils.createDOMFromHTML(generatedHTML);
    thisCart.dom.productList.appendChild(generatedDOM);
    thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
    /*console.log('thisCart.products', thisCart.products); */
    /* console.log('adding product', menuProduct); */
    thisCart.update();
  }
  update() {
    const thisCart = this;
    let deliveryFee = settings.cart.defaultDeliveryFee;
    thisCart.subTotalPrice = 0;
    thisCart.totalNumber = 0;
    for (let oneProduct of thisCart.products) {
      thisCart.totalNumber += oneProduct.amount;    
      thisCart.subTotalPrice += oneProduct.price;
    }


    if (thisCart.products.length == 0) {
      deliveryFee = 0;
    }    
    thisCart.dom.deliveryFee.innerHTML = deliveryFee;
    thisCart.dom.subTotalPrice.innerHTML = thisCart.subTotalPrice;
    for (let totalPrice of thisCart.dom.totalPrice) {
      totalPrice.innerHTML = thisCart.subTotalPrice + deliveryFee;
    }
    thisCart.dom.totalNumber.innerHTML = thisCart.totalNumber;
  }
  remove(cartProduct) {
    const thisCart = this;
      
    const removeDOMProduct = cartProduct.dom.wrapper;
    removeDOMProduct.remove();
    const indexOfProduct = thisCart.products.indexOf(cartProduct);
    const removedProduct = thisCart.products.splice(indexOfProduct, 1);
    console.log('removedProduct: ', removedProduct);

    thisCart.update();
  }
  sendOrder() {
    const thisCart = this;

    const url = settings.db.url + '/' + settings.db.orders;

    const formData = utils.serializeFormToObject(thisCart.dom.form);
    console.log('formData: ', formData);
    // zamiast konwertować formularz na obiekt w stałej formData można dojść do address i phone przez input i atrybut value formularza:
    thisCart.dom.form.input;
    const payload = {
      phone: formData.phone,
      address: formData.address,
      totalPrice: thisCart.totalPrice,
      subTotalPrice: thisCart.totalPrice - settings.cart.defaultDeliveryFee,
      totalNumber: thisCart.totalNumber,
      deliveryFee: settings.cart.defaultDeliveryFee,
      products: [],
    };
    console.log('payload: ', payload);
      
    for(let prod of thisCart.products) {
      payload.products.push(prod.getData());
    } 

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    }; 

    fetch(url, options);
  }
}
export default Cart;