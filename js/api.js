/* Appels vers l’API DummyJSON */
const BASE = 'https://dummyjson.com';
const PAGE_SIZE = 12;           // 12 produits par page

export async function getProducts (page = 1) {
  const skip = (page - 1) * PAGE_SIZE;
  const res  = await fetch(`${BASE}/products?limit=${PAGE_SIZE}&skip=${skip}`);

  if (!res.ok) throw new Error('Erreur API');

  return res.json();            // { products, total, skip, limit }
}

export { PAGE_SIZE };
