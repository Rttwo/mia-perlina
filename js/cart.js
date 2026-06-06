
// ===== CART SYSTEM =====
const CART_KEY = 'mia_perlina_cart';

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(id, name, price, img) {
  const cart = getCart();
  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, name, price, img, qty: 1 });
  }
  saveCart(cart);
  showCartNotice(name);
}

function removeFromCart(id) {
  const cart = getCart().filter(i => i.id !== id);
  saveCart(cart);
}

function changeQty(id, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) return removeFromCart(id);
  }
  saveCart(cart);
  renderCart();
}

function updateCartBadge() {
  const total = getCart().reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('.cart-badge, .badge').forEach(b => {
    b.textContent = total;
    b.style.display = total > 0 ? 'flex' : 'none';
  });
}

function showCartNotice(name) {
  let n = document.getElementById('cart-notice');
  if (!n) {
    n = document.createElement('div');
    n.id = 'cart-notice';
    n.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#1a2a3a;color:#fff;padding:12px 24px;font-size:12px;letter-spacing:1px;z-index:9999;font-family:Raleway,sans-serif;white-space:nowrap;transition:opacity .3s';
    document.body.appendChild(n);
  }
  n.textContent = '✓ Добавлено в корзину';
  n.style.opacity = '1';
  clearTimeout(n._t);
  n._t = setTimeout(() => n.style.opacity = '0', 2500);
}

function renderCart() {
  const wrap = document.getElementById('cart-items');
  const summary = document.getElementById('cart-summary');
  if (!wrap) return;
  const cart = getCart();
  if (cart.length === 0) {
    wrap.innerHTML = '<div style="text-align:center;padding:60px 20px;color:#6b7f92"><div style="font-family:Cormorant Garamond,serif;font-size:28px;margin-bottom:12px">Корзина пуста</div><a href="catalog.html" style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#4a6480;border-bottom:1px solid #c5d3e0">Перейти в каталог →</a></div>';
    if (summary) summary.style.display = 'none';
    return;
  }
  if (summary) summary.style.display = 'block';
  wrap.innerHTML = cart.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <div class="ci-img"><img src="${item.img}" alt="${item.name}"></div>
      <div class="ci-info">
        <div class="ci-name">${item.name}</div>
        <div class="ci-price">${item.price.toLocaleString('ru-RU')} ₽</div>
      </div>
      <div class="ci-qty">
        <button onclick="changeQty('${item.id}',-1)">−</button>
        <span>${item.qty}</span>
        <button onclick="changeQty('${item.id}',1)">+</button>
      </div>
      <div class="ci-total">${(item.price * item.qty).toLocaleString('ru-RU')} ₽</div>
      <button class="ci-del" onclick="removeFromCart('${item.id}');renderCart()">✕</button>
    </div>
  `).join('');

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const delivery = getSelectedDelivery();
  const total = subtotal + delivery.price;

  document.getElementById('subtotal').textContent = subtotal.toLocaleString('ru-RU') + ' ₽';
  document.getElementById('delivery-cost').textContent = delivery.price === 0 ? 'Бесплатно' : delivery.price.toLocaleString('ru-RU') + ' ₽';
  document.getElementById('total').textContent = total.toLocaleString('ru-RU') + ' ₽';
}

function getSelectedDelivery() {
  const sel = document.querySelector('.delivery-opt.selected');
  if (!sel) return { name: 'Самовывоз', price: 0 };
  return { name: sel.dataset.name, price: parseInt(sel.dataset.price) };
}

function selectDelivery(el) {
  document.querySelectorAll('.delivery-opt').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  renderCart();
}

function selectPayment(el) {
  document.querySelectorAll('.payment-opt').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
}

document.addEventListener('DOMContentLoaded', function() {
  updateCartBadge();
  renderCart();
  // Set default delivery
  const first = document.querySelector('.delivery-opt');
  if (first) first.classList.add('selected');
  const firstPay = document.querySelector('.payment-opt');
  if (firstPay) firstPay.classList.add('selected');
});
