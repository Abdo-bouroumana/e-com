/* UI : catalogue + pagination + ajout panier + recherche ----------------- */
import { getProducts, PAGE_SIZE } from './api.js';
import { addToCart, loadCart }    from './store.js';

/* éléments du DOM */
const gridEl      = document.getElementById('product-grid');
const pagEl       = document.getElementById('pagination');
const cartBadge   = document.getElementById('cart-count');

/*  éléments présents UNIQUEMENT sur shop.html (sélecteur de produits)  */
const searchForm  = document.getElementById('search-form');   // peut être null sur index
const searchInput = document.getElementById('search-input');
const clearBtn    = document.getElementById('clear-search');

/* état global */
let currentPage   = 1;
let lastProducts  = [];     // produits de la page courante (pour add-to-cart)
let searchQuery   = '';     // chaîne vide → mode catalogue normal

/* utilitaires */
function updateCartBadge () {
  cartBadge.textContent = loadCart().reduce((s, p) => s + p.qty, 0);
}

function productCardHTML (p) {
  return `
    <div class="col-sm-6 col-lg-3">
      <div class="card h-100 shadow-sm">
        <img src="${p.thumbnail}"
             class="card-img-top"
             style="object-fit:cover;height:180px">
        <div class="card-body d-flex flex-column">
          <h6 class="card-title">${p.title}</h6>
          <p class="card-text text-truncate">${p.description}</p>

          <div class="mt-auto">
            <span class="h6">${p.price} $</span>
            <button class="btn btn-sm btn-primary w-100 mt-2" data-add="${p.id}">
              Ajouter
            </button>
          </div>
        </div>
      </div>
    </div>`;
}

function renderPagination (total) {
  const pages = Math.ceil(total / PAGE_SIZE);
  pagEl.innerHTML = '';
  for (let i = 1; i <= pages; i++) {
    pagEl.insertAdjacentHTML('beforeend', `
      <li class="page-item ${i === currentPage ? 'active' : ''}">
        <a class="page-link" href="#" data-page="${i}">${i}</a>
      </li>`);
  }
}

/* Appel direct de l’endpoint recherche de DummyJSON */
async function searchProducts (q) {
  const res = await fetch(
    `https://dummyjson.com/products/search?q=${encodeURIComponent(q)}`
  );
  if (!res.ok) throw new Error('API search error');
  return res.json();               // { products, total }
}

/* Charge la page courante (catalogue ou résultat de recherche) */
async function loadPage (page = 1) {
  currentPage = page;

  let products, total;
  if (searchQuery) {
    ({ products, total } = await searchProducts(searchQuery));
    pagEl.classList.add('d-none');        // on masque la pagination en mode recherche
  } else {
    ({ products, total } = await getProducts(page));
    pagEl.classList.remove('d-none');
  }

  lastProducts = products;
  gridEl.innerHTML = products.map(productCardHTML).join('');

  if (!searchQuery) renderPagination(total);
  updateCartBadge();
}

/* Listeners */
/* pagination */
pagEl.addEventListener('click', e => {
  const page = e.target.dataset.page;
  if (page) {
    e.preventDefault();
    loadPage(+page);
  }
});

/* ajout panier */
gridEl.addEventListener('click', e => {
  const id = e.target.dataset.add;
  if (id) {
    const product = lastProducts.find(p => p.id === +id);
    if (product) addToCart(product);
    updateCartBadge();
  }
});

/* recherche (uniquement si le formulaire existe sur la page) */
if (searchForm) {
  searchForm.addEventListener('submit', e => {
    e.preventDefault();
    searchQuery = searchInput.value.trim();
    if (searchQuery) {
      clearBtn.classList.remove('d-none');
      loadPage();                 // page ignorée en mode recherche
    }
  });

  clearBtn.addEventListener('click', () => {
    searchQuery = '';
    searchInput.value = '';
    clearBtn.classList.add('d-none');
    loadPage(1);                  // retour au catalogue normal
  });
}

/* Initialisation */
loadPage();
