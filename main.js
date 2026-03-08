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

  const imageWrapper = document.createElement("div");
  imageWrapper.className = "product-image-wrapper";
  const img = document.createElement("img");
  img.src = product.image;
  img.alt = product.name;
  imageWrapper.appendChild(img);

  const body = document.createElement("div");
  body.className = "product-body";

  const title = document.createElement("h3");
  title.className = "product-title";
  title.textContent = product.name;

  const desc = document.createElement("p");
  desc.className = "product-description";
  desc.textContent = product.description;

  const priceRow = document.createElement("div");
  priceRow.className = "product-price-row";
  const priceSpan = document.createElement("span");
  priceSpan.textContent = `${product.price} دينار`;
  priceRow.appendChild(priceSpan);

  const controls = document.createElement("div");
  controls.className = "product-controls";

  const qtyControl = document.createElement("div");
  qtyControl.className = "qty-control";

  const minusBtn = document.createElement("button");
  minusBtn.type = "button";
  minusBtn.className = "qty-btn";
  minusBtn.setAttribute("aria-label", "تقليل الكمية");
  minusBtn.textContent = "−";

  const qtySpan = document.createElement("span");
  qtySpan.className = "qty-value";

  const plusBtn = document.createElement("button");
  plusBtn.type = "button";
  plusBtn.className = "qty-btn";
  plusBtn.setAttribute("aria-label", "زيادة الكمية");
  plusBtn.textContent = "+";

  qtyControl.appendChild(minusBtn);
  qtyControl.appendChild(qtySpan);
  qtyControl.appendChild(plusBtn);

  const addBtn = document.createElement("button");
  addBtn.type = "button";
  addBtn.className = "add-btn";

  function sync() {
    const qty = quantities[product.id] || 0;
    qtySpan.textContent = String(qty);

    if (qty === 0) {
      minusBtn.disabled = true;
      addBtn.disabled = false;
      addBtn.textContent = "أضف للطلب";
    } else {
      minusBtn.disabled = false;
      addBtn.disabled = true;
      addBtn.textContent = "تمت الإضافة";
    }
  }

  plusBtn.addEventListener("click", () => {
    quantities[product.id] = (quantities[product.id] || 0) + 1;
    sync();
    updateOrderSummary();
  });

  minusBtn.addEventListener("click", () => {
    quantities[product.id] = Math.max(
      0,
      (quantities[product.id] || 0) - 1,
    );
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

  controls.appendChild(qtyControl);
  controls.appendChild(addBtn);

  body.appendChild(title);
  body.appendChild(desc);
  body.appendChild(priceRow);
  body.appendChild(controls);

  card.appendChild(imageWrapper);
  card.appendChild(body);

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

