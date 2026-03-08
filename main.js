const products = [
  {
    id: 1,
    name: "كيكة الشوكولاتة الفاخرة",
    description: "كيكة شوكولاتة غنية مع غاناش مخملي",
    price: 85,
    image: "IMG/chocoPyramides.jpg",
  },
  {
    id: 2,
    name: "بانكيك بالتوت",
    description: "بانكيك هش مع التوت الطازج والشراب",
    price: 45,
    image: "IMG/circles.jpg",
  },
  {
    id: 3,
    name: "تورتة أنيقة",
    description: "تورتة إيطالية كلاسيكية مع حشوة الكريمة",
    price: 95,
    image: "IMG/snowPyramids.jpg",
  },
  {
    id: 4,
    name: "بقلاوة تقليدية",
    description: "طبقات مقرمشة مع العسل والفستق",
    price: 55,
    image: "IMG/lemon.jpg",
  },
  {
    id: 5,
    name: "علبة شوكولاتة فاخرة",
    description: "علبة هدايا شوكولاتة متنوعة فاخرة",
    price: 120,
    image: "IMG/anotherMix.jpg",
  },
  {
    id: 6,
    name: "كب كيك الفانيليا",
    description: "كب كيك فانيليا ناعمة مع كريمة الزبدة",
    price: 35,
    image: "IMG/circles.jpg",
  },
  {
    id: 7,
    name: "ماكرون فرنسي",
    description: "بسكويت اللوز الرقيق بنكهات متنوعة",
    price: 65,
    image: "IMG/chocoPyramides.jpg",
  },
  {
    id: 8,
    name: "كيكة الفراولة",
    description: "كيكة إسفنجية خفيفة مع الفراولة الطازجة",
    price: 75,
    image: "IMG/lemon.jpg",
  },
];

const quantities = Object.fromEntries(products.map((p) => [p.id, 0]));

function calculateTotal() {
  return products.reduce(
    (total, product) =>
      total + product.price * (quantities[product.id] || 0),
    0,
  );
}

function calculateItemCount() {
  return Object.values(quantities).reduce(
    (sum, qty) => sum + (qty || 0),
    0,
  );
}

function updateOrderSummary() {
  const total = calculateTotal();
  const itemCount = calculateItemCount();

  const totalEl = document.getElementById("orderTotal");
  const summaryEl = document.getElementById("orderItemSummary");
  const sendBtn = document.getElementById("sendOrderButton");

  if (totalEl) {
    totalEl.textContent = String(total);
  }

  if (summaryEl) {
    if (itemCount > 0) {
      const label = itemCount === 1 ? "منتج" : "منتجات";
      summaryEl.textContent = `(${itemCount} ${label})`;
    } else {
      summaryEl.textContent = "";
    }
  }

  if (sendBtn) {
    sendBtn.disabled = total === 0;
  }
}
function createProductCard(product) {
  const card = document.createElement("div");
  card.className = "product-card";

  card.innerHTML = `
    <div class="product-image-wrapper">
      <img src="${product.image}" alt="${product.name}">
    </div>
    <div class="product-body">
      <h3 class="product-title">${product.name}</h3>
      <p class="product-description">${product.description}</p>
      <div class="product-price-row">
        <span>${product.price} دينار</span>
      </div>
      <div class="product-controls">
        <div class="qty-control">
          <button type="button" class="qty-btn" aria-label="تقليل الكمية">−</button>
          <span class="qty-value">0</span>
          <button type="button" class="qty-btn" aria-label="زيادة الكمية">+</button>
        </div>
        <button type="button" class="add-btn">أضف للطلب</button>
      </div>
    </div>
  `;

  const minusBtn = card.querySelector(".qty-control .qty-btn:first-child");
  const qtySpan = card.querySelector(".qty-value");
  const plusBtn = card.querySelector(".qty-control .qty-btn:last-child");
  const addBtn = card.querySelector(".add-btn");

  function sync() {
    const qty = quantities[product.id] || 0;
    qtySpan.textContent = String(qty);

    minusBtn.disabled = qty === 0;
    addBtn.disabled = qty > 0;
    addBtn.textContent = qty === 0 ? "أضف للطلب" : "تمت الإضافة";
  }

  plusBtn.addEventListener("click", () => {
    quantities[product.id] = (quantities[product.id] || 0) + 1;
    sync();
    updateOrderSummary();
  });

  minusBtn.addEventListener("click", () => {
    quantities[product.id] = Math.max(0, (quantities[product.id] || 0) - 1);
    sync();
    updateOrderSummary();
  });

  addBtn.addEventListener("click", () => {
    if ((quantities[product.id] || 0) === 0) {
      quantities[product.id] = 1;
      sync();
      updateOrderSummary();
    }
  });

  sync();
  return card;
}

function renderProducts() {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  grid.innerHTML = "";
  products.forEach((product) => {
    grid.appendChild(createProductCard(product));
  });
}

function sendOrder() {
  const orderItems = products
    .filter((product) => (quantities[product.id] || 0) > 0)
    .map(
      (product) =>
        ` ${quantities[product.id]} ${product.name} = ${product.price * (quantities[product.id] || 0)} دينار`,  //ردبالك تمسها
    ).join("\n");

  if (!orderItems) return;

  const message = `مرحباً! أرغب بطلب:\n\n${orderItems}\n\nالمجموع: ${calculateTotal()} دينار`;

  const whatsappUrl = `https://wa.me/218946282461?text=${encodeURIComponent(
    message,
  )}`;
  window.open(whatsappUrl, "_blank");
}

function openHeroWhatsApp() {
  const message = "مرحباً! أنا مهتم بالطلب من Sugar Stories.";
  const whatsappUrl = `https://wa.me/218946282461?text=${encodeURIComponent(
    message,
  )}`;
  window.open(whatsappUrl, "_blank");
}

function scrollToProducts() {
  const section = document.getElementById("best-sellers");
  if (!section) return;

  section.scrollIntoView({ behavior: "smooth" });
}

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  updateOrderSummary();

  const orderBtn = document.getElementById("orderNowButton");
  if (orderBtn) {
    orderBtn.addEventListener("click", scrollToProducts);
  }

  const waHeroBtn = document.getElementById("whatsappHeroButton");
  if (waHeroBtn) {
    waHeroBtn.addEventListener("click", openHeroWhatsApp);
  }

  const sendOrderBtn = document.getElementById("sendOrderButton");
  if (sendOrderBtn) {
    sendOrderBtn.addEventListener("click", sendOrder);
  }
});

