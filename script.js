// PawPaw House interactivity: slider, products, cart, checkout, animations
const $ = (s, ctx=document) => ctx.querySelector(s);
const $$ = (s, ctx=document) => Array.from(ctx.querySelectorAll(s));

// Theme toggle
const themeToggle = $("#themeToggle");
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("pph_theme", document.documentElement.classList.contains("dark") ? "dark" : "light");
  });
  const saved = localStorage.getItem("pph_theme");
  if (saved === "dark") document.documentElement.classList.add("dark");
}

// Year
const yearEl = $("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Products (sample data)
const PRODUCTS = [
  {id:"p1", name:"Premium Kibble", price:120000, compareAt:150000, img:"assets/images/prod-1.svg", desc:"Crunchy chicken & rice formula."},
  {id:"p2", name:"Durable Chew Toy", price:60000, compareAt:80000, img:"assets/images/prod-2.svg", desc:"Non-toxic rubber chew for all sizes."},
  {id:"p3", name:"Catnip Mouse", price:45000, compareAt:55000, img:"assets/images/prod-3.svg", desc:"Organic catnip for endless fun."},
  {id:"p4", name:"Smart Feeder", price:480000, compareAt:520000, img:"assets/images/prod-4.svg", desc:"Schedule meals with app control."},
  {id:"p5", name:"Cozy Pet Bed", price:220000, compareAt:250000, img:"assets/images/prod-5.svg", desc:"Ultra-soft, machine-washable cover."},
  {id:"p6", name:"Grooming Kit", price:90000, compareAt:110000, img:"assets/images/prod-6.svg", desc:"Brush, nail clipper, and comb set."},
  {id:"p7", name:"PawPaw Collar", price:35000, compareAt:45000, img:"assets/images/prod-7.svg", desc:"Adjustable nylon collar with tag."},
  {id:"p8", name:"Travel Carrier", price:370000, compareAt:410000, img:"assets/images/prod-8.svg", desc:"Airline-approved hard shell carrier."}
];

// Currency formatter
const rupiah = n => new Intl.NumberFormat("id-ID", {style:"currency", currency:"IDR", maximumFractionDigits:0}).format(n);

// Render product cards
const grid = $("#productGrid");
if (grid) {
  grid.innerHTML = PRODUCTS.map(p => `
    <article class="card" data-id="${p.id}">
      <img src="${p.img}" alt="${p.name}" />
      <div class="body">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-top:8px">
          <div>
            <span class="price">${rupiah(p.price)}</span>
            <span class="muted">${rupiah(p.compareAt)}</span>
          </div>
          <button class="btn primary add" data-id="${p.id}">Tambah</button>
        </div>
      </div>
    </article>
  `).join("");

  grid.addEventListener("click", (e) => {
    const btn = e.target.closest(".add");
    if (!btn) return;
    addToCart(btn.dataset.id);
    bounce($("#cartBtn"));
  });
}

// Slider
function slider(el) {
  const slidesEl = el.querySelector(".slides");
  const slides = $$(".slide", el);
  const prev = el.querySelector(".prev");
  const next = el.querySelector(".next");
  const dots = el.querySelector(".dots");

  let i = 0;
  const set = idx => {
    i = (idx + slides.length) % slides.length;
    slidesEl.style.transform = `translateX(-${i*100}%)`;
    dots.innerHTML = slides.map((_, d)=>`<button class="${d===i?'active':''}" aria-label="Slide ${d+1}"></button>`).join("");
  };
  set(0);

  prev.addEventListener("click",()=>set(i-1));
  next.addEventListener("click",()=>set(i+1));
  dots.addEventListener("click",(e)=>{
    const idx = Array.from(dots.children).indexOf(e.target);
    if (idx>-1) set(idx);
  });

  let timer = setInterval(()=>set(i+1), 4500);
  el.addEventListener("mouseenter", ()=>clearInterval(timer));
  el.addEventListener("mouseleave", ()=>timer = setInterval(()=>set(i+1), 4500));
}
const heroSlider = $("#heroSlider");
if (heroSlider) slider(heroSlider);

// Cart logic with localStorage
const CART_KEY = "pph_cart";
const loadCart = () => JSON.parse(localStorage.getItem(CART_KEY) || "[]");
const saveCart = (cart) => localStorage.setItem(CART_KEY, JSON.stringify(cart));
const findProduct = id => PRODUCTS.find(p => p.id === id);

function addToCart(id, qty=1){
  const cart = loadCart();
  const idx = cart.findIndex(i => i.id === id);
  if (idx>-1) cart[idx].qty += qty; else cart.push({id, qty});
  saveCart(cart);
  renderCart();
}

function removeFromCart(id){
  saveCart(loadCart().filter(i => i.id !== id));
  renderCart();
}

function setQty(id, qty){
  const cart = loadCart();
  const item = cart.find(i=>i.id===id);
  if (!item) return;
  item.qty = Math.max(1, qty|0);
  saveCart(cart);
  renderCart();
}

function cartCount(){
  return loadCart().reduce((a,b)=>a+b.qty,0);
}

function cartSubtotal(){
  return loadCart().reduce((sum, it)=>{
    const p = findProduct(it.id);
    return sum + (p ? p.price * it.qty : 0);
  }, 0);
}

const cartBtn = $("#cartBtn");
const cartDrawer = $("#cartDrawer");
const cartItems = $("#cartItems");
const closeCart = $("#closeCart");
const badge = $("#cartCount");
const subtotalEl = $("#subtotal");

function renderCart(){
  const cart = loadCart();
  if (badge) badge.textContent = cartCount();
  if (!cartItems) return;
  if (cart.length === 0){
    cartItems.innerHTML = `<p>Keranjang kosong. Yuk belanja! 🐶🐱</p>`;
  } else {
    cartItems.innerHTML = cart.map(it => {
      const p = findProduct(it.id);
      return `<div class="cart-item">
        <img src="${p.img}" alt="${p.name}"/>
        <div>
          <h4>${p.name}</h4>
          <div class="qty">
            <button aria-label="Minus" onclick="setQty('${it.id}', ${it.qty-1})">-</button>
            <span>${it.qty}</span>
            <button aria-label="Plus" onclick="setQty('${it.id}', ${it.qty+1})">+</button>
          </div>
          <div class="price">${rupiah(p.price * it.qty)}</div>
        </div>
        <button class="remove" aria-label="Hapus" onclick="removeFromCart('${it.id}')">×</button>
      </div>`;
    }).join("");
  }
  if (subtotalEl) subtotalEl.textContent = rupiah(cartSubtotal());
}
renderCart();

if (cartBtn && cartDrawer){
  cartBtn.addEventListener("click", ()=>{
    cartDrawer.classList.add("open");
    cartDrawer.setAttribute("aria-hidden", "false");
  });
}
if (closeCart && cartDrawer){
  closeCart.addEventListener("click", ()=>{
    cartDrawer.classList.remove("open");
    cartDrawer.setAttribute("aria-hidden", "true");
  });
}

// Subtle animation helper
function bounce(el){
  if (!el) return;
  el.animate([{transform:"scale(1)"},{transform:"scale(1.12)"},{transform:"scale(1)"}],{duration:260});
}

// Checkout page logic
if (location.pathname.endsWith("checkout.html")){
  const summary = $("#summary");
  const summarySubtotal = $("#summarySubtotal");
  const cart = loadCart();

  if (!cart.length){
    summary.innerHTML = "<p>Keranjang Anda kosong. Silakan kembali ke <a href='index.html#shop'>Shop</a>.</p>";
  }else{
    summary.innerHTML = cart.map(it=>{
      const p = findProduct(it.id);
      return `<div class="line"><span>${p.name} × ${it.qty}</span><span>${rupiah(p.price*it.qty)}</span></div>`;
    }).join("");
  }
  summarySubtotal.textContent = rupiah(cartSubtotal());

  $("#checkoutForm").addEventListener("submit", (e)=>{
    e.preventDefault();
    // simple form serialize
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd.entries());
    const orderId = Math.random().toString(36).slice(2,8).toUpperCase();
    // In real life, send to server; here we just clear and redirect
    localStorage.removeItem(CART_KEY);
    location.href = `thankyou.html?order=${orderId}`;
  });
}
