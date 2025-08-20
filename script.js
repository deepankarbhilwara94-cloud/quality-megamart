
const PRODUCTS = [
  { id: "p1", name: "T-shirt", price: 499, category: "Fashion", image: "https://images.unsplash.com/photo-1520975922091-a3801c8a57c3?q=80&w=800&auto=format&fit=crop" },
  { id: "p2", name: "Shoes", price: 1299, category: "Fashion", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop" },
  { id: "p3", name: "Watch", price: 899, category: "Accessories", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop" },
  { id: "p4", name: "Bag", price: 699, category: "Accessories", image: "https://images.unsplash.com/photo-1585386959984-a4155223f6ae?q=80&w=800&auto=format&fit=crop" },
];

const INR = n => n.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

let cart = {}; // {id: {product, qty}}

function renderProducts(list) {
  const grid = document.getElementById('products-grid');
  grid.innerHTML = '';
  list.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="cover"><img src="${p.image}" alt="${p.name}"/></div>
      <div class="body">
        <div class="row">
          <strong>${p.name}</strong>
          <span class="price">${INR(p.price)}</span>
        </div>
        <button class="btn primary" data-id="${p.id}">Add to Cart</button>
      </div>
    `;
    grid.appendChild(card);
  });
  grid.querySelectorAll('button[data-id]').forEach(btn => {
    btn.addEventListener('click', () => addToCart(btn.getAttribute('data-id')));
  });
}

function addToCart(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  if (!cart[id]) cart[id] = { product: p, qty: 0 };
  cart[id].qty += 1;
  updateCartUI();
  openCart();
}

function decFromCart(id) {
  if (!cart[id]) return;
  cart[id].qty -= 1;
  if (cart[id].qty <= 0) delete cart[id];
  updateCartUI();
}

function removeLine(id) {
  delete cart[id];
  updateCartUI();
}

function getLines() {
  return Object.values(cart);
}

function subtotal() {
  return getLines().reduce((s, l) => s + l.product.price * l.qty, 0);
}

function updateCartUI() {
  const count = getLines().length;
  document.getElementById('cart-count').textContent = count;
  const body = document.getElementById('cart-lines');
  body.innerHTML = '';
  if (count === 0) {
    body.innerHTML = '<p style="color:#64748b">Cart khali hai. Items add kijiye.</p>';
  } else {
    getLines().forEach(({product, qty}) => {
      const row = document.createElement('div');
      row.className = 'cart-line';
      row.innerHTML = `
        <img src="${product.image}" alt="${product.name}"/>
        <div>
          <div style="font-weight:600">${product.name}</div>
          <div style="color:#64748b">${INR(product.price)} × ${qty}</div>
          <div class="qty" style="margin-top:8px">
            <button class="btn icon" data-dec="${product.id}">-</button>
            <span>${qty}</span>
            <button class="btn icon" data-add="${product.id}">+</button>
          </div>
        </div>
        <button class="btn icon" data-rem="${product.id}">✕</button>
      `;
      body.appendChild(row);
    });
  }
  document.getElementById('subtotal').textContent = INR(subtotal());
  body.querySelectorAll('[data-dec]').forEach(b => b.onclick = () => decFromCart(b.getAttribute('data-dec')));
  body.querySelectorAll('[data-add]').forEach(b => b.onclick = () => addToCart(b.getAttribute('data-add')));
  body.querySelectorAll('[data-rem]').forEach(b => b.onclick = () => removeLine(b.getAttribute('data-rem')));
}

function openCart() {
  document.getElementById('cart').classList.add('open');
}
function closeCart() {
  document.getElementById('cart').classList.remove('open');
}

function filterAndSearch() {
  const q = document.getElementById('search').value.trim().toLowerCase();
  const cat = document.getElementById('category').value;
  const filtered = PRODUCTS.filter(p => (cat === 'All' || p.category === cat) && (!q || p.name.toLowerCase().includes(q)));
  renderProducts(filtered);
}

document.addEventListener('DOMContentLoaded', () => {
  renderProducts(PRODUCTS);
  updateCartUI();
  document.getElementById('open-cart').addEventListener('click', openCart);
  document.getElementById('close-cart').addEventListener('click', closeCart);
  document.getElementById('search').addEventListener('input', filterAndSearch);
  document.getElementById('category').addEventListener('change', filterAndSearch);
  document.getElementById('checkout').addEventListener('click', () => {
    const total = INR(subtotal());
    const msg = encodeURIComponent("Hello Quality Megamart! Mera cart total: " + total + ". Kripya order confirm karein.");
    window.open("https://wa.me/917876938008?text=" + msg, "_blank");
  });
});
