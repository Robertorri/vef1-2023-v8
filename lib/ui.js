import { formatNumber } from './helpers.js';
import { updateCartTotal } from '../main.js';

export function createCartLine(product, quantity) {
  // töflu röð
  const tr = document.createElement('tr');
  tr.setAttribute('data-cart-product-id', product.id);

  // Fjöldinn
  const tdQuantity = document.createElement('td');
  tdQuantity.textContent = quantity;
  tdQuantity.className = 'quantity';
  tr.appendChild(tdQuantity);


  // Heiti vörunnar innan töflu
  const tdTitle = document.createElement('td');
  tdTitle.textContent = product.title;
  tr.appendChild(tdTitle);


  // Summa allra verða inn í körfu
  const tdTotal = document.createElement('td');
  tdTotal.innerHTML = `<span class="price">${formatNumber(product.price * quantity)}</span>`;
  tdTotal.className = 'total';
  tr.appendChild(tdTotal);


  // Verð vöru
  const tdPrice = document.createElement('td');
  tdPrice.innerHTML = `<span class="price">${formatNumber(product.price)}</span>`;
  tr.appendChild(tdPrice);




 

  // TODO hér þarf að búa til eventListener sem leyfir að eyða línu úr körfu
  const tdRemove = document.createElement('td');
  const formRemove = document.createElement('form');

  formRemove.method = 'post';
  formRemove.className = 'remove';

  const buttonRemove = document.createElement('button');
  buttonRemove.type = 'button';
  buttonRemove.textContent = 'Eyða';
  
  buttonRemove.addEventListener('click', (e) => {
    e.preventDefault();
    tr.remove();
    updateCartTotal();
  });

  formRemove.appendChild(buttonRemove);
  tdRemove.appendChild(formRemove);
  tr.appendChild(tdRemove);

  return tr;
}

/**
 * Sýna efni körfu eða ekki.
 * @param {boolean} show Sýna körfu eða ekki
 */

export function showCartContent(show = true) {
  // Finnum element sem inniheldur körfuna
  const cartElement = document.querySelector('.cart');

  if (!cartElement) {
    console.warn('fann ekki .cart');
    return;
  }

  const emptyMessage = cartElement.querySelector('.empty-message');
  const cartContent = cartElement.querySelector('.table');

  if (!emptyMessage || !cartContent) {
    console.warn('fann ekki element');
    return;
  }

  if (show) {
    emptyMessage.classList.add('hidden');
    cartContent.classList.remove('hidden');
  } else {
    emptyMessage.classList.remove('hidden');
    cartContent.classList.add('hidden');
  }
}

