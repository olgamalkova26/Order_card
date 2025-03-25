//formát měny SAR
const formatter = new Intl.NumberFormat('de', {
  style: 'currency',
  currency: 'RUB',
});

//částka a její formát
const price = 40.0;
const formattedPrice = formatter.format(price);

//vybrání elementů pro změnu
const priceElements = document.querySelectorAll('.product-price');
priceElements.forEach((element) => {
  element.textContent = formattedPrice;
});

let productList = null; // Initially null

async function fetchProducts() {
  const response = await fetch(
    'https://fakestoreapi.com/products/category/electronics',
  );
  productList = await response.json();
}

function getProductList() {
  const result = productList ? productList : 'Data not loaded yet!'; // ternary operator
  return result;
}

// Call fetchProducts first to populate `productList`
fetchProducts().then(() => {
  const res = getProductList(); // Access it globally

  const oneProduct = res[3];

  const nameElement = document.querySelector('.testproduct-name');
  nameElement.textContent = oneProduct.title;

  const imgElement = document.querySelector('#testproduct-image');
  imgElement.src = oneProduct.image;
});
