/* Gestion LocalStorage du panier */
const KEY = 'miniShopCart';

/* Lecture */
export function loadCart () {
  return JSON.parse(localStorage.getItem(KEY) || '[]');
}

/* Écriture */
export function saveCart (cart) {
  localStorage.setItem(KEY, JSON.stringify(cart));
}

/* Ajouter un article */
export function addToCart (product) {
  const cart = loadCart();
  const existing = cart.find(i => i.id === product.id);

  if (existing) existing.qty += 1;
  else cart.push({ ...product, qty: 1 });

  saveCart(cart);
}

/* Supprimer un article */
export function removeFromCart (id) {
  saveCart(loadCart().filter(item => item.id !== id));
}

/* Vider le panier */
export function clearCart () {
  localStorage.removeItem(KEY);
}
