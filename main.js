import { createCartLine, showCartContent } from './lib/ui.js';
import { formatNumber } from './lib/helpers.js';



const products = [
  {
    id: 1,
    title: 'HTML húfa',
    description:
      'Húfa sem heldur hausnum heitum og hvíslar hugsanlega að þér hvaða element væri best að nota.',
    price: 5_000,
  },
  {
    id: 2,
    title: 'CSS sokkar',
    description: 'Sokkar sem skalast vel með hvaða fótum sem er.',
    price: 3_000,
  },
  {
    id: 3,
    title: 'JavaScript jakki',
    description: 'Mjög töff jakki fyrir öll sem skrifa JavaScript reglulega.',
    price: 20_000,
  },
];

//Bætir við í körfu
function addProductToCart(product, quantity) {

  const cart = document.querySelector('.cart-contents');

  if (!cart) {
    console.warn('fann ekki .table tbody');
    return;
  }

  
  // TODO hér þarf að athuga hvort lína fyrir vöruna sé þegar til
  let cartLine = cart.querySelector(`tr[data-cart-product-id="${product.id}"]`);
  if (cartLine) {
    // Uppfærir fjöldann og heildarverðið ef vörur eru nú þegar í körfunni
    let quantityElement = cartLine.querySelector('.quantity');
    let totalElement = cartLine.querySelector('.total .price'); // Bæta við þessari línu
    let currentQuantity = parseInt(quantityElement.textContent);
    let newQuantity = currentQuantity + quantity;
    quantityElement.textContent = newQuantity;
    totalElement.textContent = `${formatNumber(product.price * newQuantity)} kr.-`; // Uppfæra heildarverðið
    updateCartTotal();
  }
  else {
    // Ef ekki þá bætum við nýrri línu
    const newCartLine = createCartLine(product, quantity);
    cart.appendChild(newCartLine);
    updateCartTotal();
  }

  // Sýnir efni körfu
  showCartContent(true);

  // Uppfærir körfu
  updateCartTotal();
}

export function updateCartTotal() {

  const cartLines = document.querySelectorAll('tr[data-cart-product-id]');
  let total = 0;

  // Reiknar summu verðanna
  cartLines.forEach(line => {
    const priceElement = line.querySelector('.total .price');

    const priceText = priceElement.textContent.replace('ISK', '').replace(' kr.-', '').trim().replace(/\./g, '').replace(',', '');
    const price = parseFloat(priceText);

    if (!isNaN(price)) {
      total += price;
    }
    else {
      console.error('Price is NaN for line:', line);
    }
  });

  const totalElement = document.querySelector('.cartSum .price');
  if (totalElement) {
    // Notar formatNumber fallið til að sýna heildarverðið í réttu sniði
    totalElement.textContent = formatNumber(total);
  }

  // Athugar hvort karfan er tóm og prentar "Ekkert í körfu"
  showCartContent(cartLines.length > 0);
  
}




function submitHandler(event) {
  event.preventDefault();

  const parent = event.target.closest('tr');
  const productId = Number.parseInt(parent.dataset.productId);

  console.log('productId:', productId);

  const product = products.find((p) => p.id === productId);

  console.log('product:', product);

  const quantityInput = parent.querySelector('input[type="number"]');
  const quantity = parseInt(quantityInput.value, 10);

  console.log('quantityInput value:', quantityInput.value);
  console.log('quantity:', quantity);

  if (isNaN(quantity) || quantity <= 0) {
    console.error('Fjöldi er ekki gildur');
    return;
  }

  addProductToCart(product, quantity);
}


// Finnur öll form með class="add"
const addToCartForms = document.querySelectorAll('.add')

// Ítra í gegnum þau sem fylki (`querySelectorAll` skilar NodeList)
for (const form of Array.from(addToCartForms)) {
  
  // Bæta submit event listener við hvert
  form.addEventListener('submit', submitHandler);
}


//checkout
function handleCheckout(event) {
  event.preventDefault(); 


  const name = document.querySelector('#name').value;
  const address = document.querySelector('#address').value;


  if (!name || !address) {
    alert('Vinsamlegast fylltu út nafn og heimilisfang.');
    return;
  }

  const receiptSection = document.querySelector('.receipt');
  receiptSection.querySelector('h2').textContent = 'Kvittun';
  receiptSection.querySelector('p').textContent = `Takk fyrir að versla hjá okkur, ${name}! Vörurnar verða sendar á heimilisfangið ${address}.`;
  


  const cartContent = document.querySelector('.table tbody');
  while (cartContent.firstChild) {
    cartContent.removeChild(cartContent.firstChild);
  }
  
  //uppfærir Körfuna
  updateCartTotal(); 


  showCartContent(false);
  receiptSection.classList.remove('hidden');


  event.target.reset();
}


document.addEventListener('DOMContentLoaded', (event) => {
  
  const checkoutForm = document.querySelector('#checkout');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', handleCheckout);
  } else {
    console.error('Pöntunarform fannst ekki!');
  }
});
