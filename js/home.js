/* Home page – fetch 4 produits et badge panier */
import { getProducts } from './api.js';
import { loadCart }    from './store.js';

const gridEl = document.getElementById('home-product-grid');
const badge  = document.getElementById('cart-count');

/* 1. affiche les 4 premiers produits */
(async () => {
  const { products } = await getProducts(1);        // 12 produits
  const top = products.slice(0, 4);                 // on garde 4

  gridEl.innerHTML = top.map(p => `
    <div class="col-6 col-md-3">
      <div class="card h-100 shadow-sm">
        <img src="${p.thumbnail}" class="card-img-top"
             style="object-fit:cover;height:160px;">
        <div class="card-body">
          <h6 class="card-title text-truncate">${p.title}</h6>
          <div class="d-flex justify-content-between align-items-center">
            <span class="fw-bold">${p.price} $</span>
            <a class="stretched-link" href="shop.html"></a>
          </div>
        </div>
      </div>
    </div>
  `).join('');
})();

/* 2. met à jour le badge panier */
function updateCartBadge () {
  badge.textContent = loadCart().reduce((s,p)=>s+p.qty,0);
}
updateCartBadge();
