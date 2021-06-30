import { settings, select } from '../settings.js';

class AmountWidget {
  constructor(element){
    const thisWidget = this;

    thisWidget.getElements(element);
    thisWidget.initActions();
    thisWidget.setValue(thisWidget.input.value || settings.amountWidget.defaultValue);	  
    console.log('amountWidget:', thisWidget);
    console.log('constructor arguments:', element);
  }
  getElements(element){
    const thisWidget = this;

    thisWidget.element = element;
    thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
    thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
  }
  setValue(value){
    const thisWidget = this;
    const newValue = parseInt(value);
    /*  TODO: Add validation */
    if(thisWidget.value !== newValue && !isNaN(newValue) && newValue >= settings.amountWidget.defaultMin
     && newValue <= settings.amountWidget.defaultMax) {
      thisWidget.value = newValue;
      thisWidget.annouce();
    }
    thisWidget.input.value = thisWidget.value;
  }
  annouce(){
    const thisWidget = this;
    const event = new CustomEvent('updated', {
      bubbles: true
    });
    thisWidget.element.dispatchEvent(event);
  }
  initActions(){
    const thisWidget = this;
    thisWidget.input.addEventListener('change', function() {thisWidget.setValue(thisWidget.value);});
    thisWidget.linkDecrease.addEventListener('click', function() {thisWidget.setValue(thisWidget.value - 1);});
    thisWidget.linkIncrease.addEventListener('click', function() {thisWidget.setValue(thisWidget.value + 1);});
  }
}
  
export default AmountWidget;