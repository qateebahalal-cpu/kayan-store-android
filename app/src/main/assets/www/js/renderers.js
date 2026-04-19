/* ===== KAYAN STORE - RENDERERS ===== */

// ===== RENDER PRODUCT CARD =====
KayanStore.renderProductCard = function(product, extraClass = '') {
  const isList = this.viewMode === 'list';
  const discount = product.discount ? `<span class="product-discount">-${product.discount}%</span>` : '';
  const badgeHtml = product.badge ? `<span class="product-badge ${product.badge}">${product.badgeText || product.badge}</span>` : '';
  const stars = Array.from({length: 5}, (_, i) =>
    `<span class="star${i < Math.floor(product.rating) ? ' active' : ''}">★</span>`
  ).join('');

  return `
    <div class="product-card ${isList ? 'list-card' : ''} ${extraClass} fade-in" data-product-id="${product.id}">
      <div class="product-badges">${badgeHtml}</div>
      <button class="product-wishlist" data-wishlist="${product.id}" title="أضف للمفضلة">♡</button>
      <div class="product-img-wrap">
        <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/300x300/1a1a2e/FF6B2B?text=K'">
        <div class="product-quick-actions">
          <button class="btn btn-primary btn-sm" style="flex:1" data-add-cart="${product.id}" onclick="event.stopPropagation()">🛒 أضف للسلة</button>
          <button class="btn btn-secondary btn-sm btn-icon" onclick="event.stopPropagation();KayanStore.toggleCompare(${product.id})" title="مقارنة">⚖️</button>
        </div>
      </div>
      <div class="product-body">
        <div class="product-category">${this.data.categories.find(c => c.id === product.category)?.name || ''}</div>
        <div class="product-name">${product.name}</div>
        <div class="product-rating">
          <div class="stars">${stars}</div>
          <span class="product-rating-text">${product.rating} (${product.reviews.toLocaleString('ar')})</span>
        </div>
        <div class="product-prices">
          <span class="product-price">${this.formatPrice(product.price)}</span>
          ${product.oldPrice ? `<span class="product-price-old">${this.formatPrice(product.oldPrice)}</span>` : ''}
          ${discount}
        </div>
        <button class="product-add-btn" data-add-cart="${product.id}" onclick="event.stopPropagation()">
          <span>🛒</span> أضف للسلة
        </button>
      </div>
    </div>
  `;
};

// ===== RENDER PRODUCTS GRID =====
KayanStore.renderProductsGrid = function(productList = null) {
  const prods = productList || this.getProducts(this.currentCategory, this.sortBy, this.searchQuery);
  if (!prods.length) return `
    <div class="empty-state" style="grid-column:1/-1">
      <div class="empty-icon">🔍</div>
      <h3 class="empty-title">لا توجد منتجات</h3>
      <p class="empty-desc">جرب تغيير الفئة أو كلمة البحث</p>
    </div>
  `;
  return prods.map(p => this.renderProductCard(p)).join('');
};

// ===== RENDER HOME PAGE =====
KayanStore.renderHome = function() {
  const slides = this.data.heroSlides;
  const heroHTML = slides.map((s, i) => `
    <div class="hero-slide ${i === 0 ? 'active' : ''}">
      <div class="hero-bg" style="background-image:url('${s.bg}')"></div>
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <div class="hero-badge">${s.badge}</div>
        <h1 class="hero-title">${s.title}</h1>
        <p class="hero-desc">${s.desc}</p>
        <div class="hero-actions">
          <button class="btn btn-primary btn-lg" onclick="KayanStore.navigate('shop')">${s.btn1}</button>
          <button class="btn btn-secondary btn-lg" onclick="KayanStore.navigate('shop')">${s.btn2}</button>
        </div>
      </div>
      <div class="hero-stats">
        ${s.stats.map(st => `
          <div class="hero-stat">
            <div class="hero-stat-num">${st.num}</div>
            <div class="hero-stat-label">${st.label}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');

  const cats = this.data.categories.slice(1);
  const catsHTML = cats.map(c => `
    <div class="category-card fade-in" data-category="${c.id}">
      <div class="cat-icon-wrap" style="background:${c.bg}">
        <span>${c.icon}</span>
      </div>
      <div class="cat-name">${c.name}</div>
      <div class="cat-count">${this.data.products.filter(p => p.category === c.id).length} منتج</div>
    </div>
  `).join('');

  const flashProds = this.data.flashDeals.map(id => this.getProduct(id)).filter(Boolean);
  const flashHTML = flashProds.map(p => this.renderProductCard(p)).join('');

  const featuredProds = this.data.featured.map(id => this.getProduct(id)).filter(Boolean);
  const featuredHTML = featuredProds.map(p => this.renderProductCard(p)).join('');

  const bestProds = this.data.bestsellers.map(id => this.getProduct(id)).filter(Boolean);
  const bestHTML = bestProds.map(p => this.renderProductCard(p)).join('');

  const newProds = this.data.newArrivals.map(id => this.getProduct(id)).filter(Boolean);
  const newHTML = newProds.map(p => this.renderProductCard(p)).join('');

  return `
    <!-- Hero Slider -->
    <div class="hero-slider">
      ${heroHTML}
      <div class="hero-nav">
        <button class="hero-nav-btn hero-prev">›</button>
        <button class="hero-nav-btn hero-next">‹</button>
      </div>
      <div class="hero-dots">
        ${slides.map((_, i) => `<div class="hero-dot ${i === 0 ? 'active' : ''}"></div>`).join('')}
      </div>
    </div>

    <!-- Features Strip -->
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin-bottom:32px">
      ${[
        ['🚀', 'شحن سريع', 'خلال 24 ساعة في صنعاء', 'track'],
        ['🔒', 'دفع آمن', 'بروتوكولات تشفير متقدمة', 'faq'],
        ['↩️', 'إرجاع مجاني', 'خلال 30 يوم بدون شروط', 'faq'],
        ['🎧', 'دعم 24/7', 'خدمة عملاء على مدار الساعة', 'contact']
      ].map(([icon, title, desc, page]) => `
        <div class="card p-16 fade-in" style="display:flex;align-items:center;gap:12px;cursor:pointer" onclick="KayanStore.navigate('${page}')">
          <span style="font-size:28px">${icon}</span>
          <div>
            <div style="font-weight:800;font-size:0.88rem">${title}</div>
            <div style="font-size:0.75rem;color:var(--text-muted)">${desc}</div>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Categories -->
    <div class="categories-section fade-in">
      <div class="section-header">
        <h2 class="section-title">تسوق حسب الفئة</h2>
        <button class="btn btn-ghost btn-sm" onclick="KayanStore.navigate('shop')">عرض الكل ›</button>
      </div>
      <div class="categories-grid">${catsHTML}</div>
    </div>

    <!-- Flash Deals -->
    <div class="flash-section fade-in">
      <div class="flash-header">
        <div class="flash-title">⚡ صفقات اليوم</div>
        <div class="countdown">
          <div class="countdown-unit"><span class="cd-hours countdown-num">07</span><span class="countdown-label">ساعة</span></div>
          <span class="countdown-sep">:</span>
          <div class="countdown-unit"><span class="cd-minutes countdown-num">30</span><span class="countdown-label">دقيقة</span></div>
          <span class="countdown-sep">:</span>
          <div class="countdown-unit"><span class="cd-seconds countdown-num">00</span><span class="countdown-label">ثانية</span></div>
        </div>
      </div>
      <div class="flash-products">${flashHTML}</div>
    </div>

    <!-- Banners -->
    <div class="banners-grid fade-in" style="margin-bottom:40px">
      <div class="banner-card" onclick="KayanStore.navigate('shop')">
        <div class="banner-bg" style="background-image:url('https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=600&q=80');background:linear-gradient(135deg,#0F3460,#16213E)"></div>
        <div class="banner-overlay" style="background:linear-gradient(135deg,rgba(15,52,96,0.95),rgba(15,52,96,0.7))">
          <div class="banner-label">إلكترونيات</div>
          <h3 class="banner-title">أحدث <span>التقنية</span><br>بأسعار استثنائية</h3>
          <button class="btn btn-outline btn-sm">تسوق الآن</button>
        </div>
      </div>
      <div class="banner-card" onclick="KayanStore.navigate('shop')">
        <div class="banner-bg" style="background:linear-gradient(135deg,#E94560,#c73652)"></div>
        <div class="banner-overlay" style="background:linear-gradient(135deg,rgba(233,69,96,0.9),rgba(233,69,96,0.6))">
          <div class="banner-label">أزياء وجمال</div>
          <h3 class="banner-title">أناقة بلا <span style="color:#FFD700">حدود</span><br>خصم حتى 50%</h3>
          <button class="btn btn-gold btn-sm">اكتشف الآن</button>
        </div>
      </div>
    </div>

    <!-- Featured -->
    <div class="fade-in" style="margin-bottom:40px">
      <div class="section-header">
        <h2 class="section-title">منتجات مميزة</h2>
        <button class="btn btn-ghost btn-sm" onclick="KayanStore.navigate('shop')">عرض الكل ›</button>
      </div>
      <div class="products-grid">${featuredHTML}</div>
    </div>

    <!-- Newsletter -->
    <div class="newsletter-section fade-in">
      <h2 class="newsletter-title">🎁 اشترك واحصل على خصم 20%</h2>
      <p class="newsletter-desc">احصل على أحدث العروض والمنتجات مباشرة في بريدك الإلكتروني</p>
      <form class="newsletter-form" id="newsletterForm">
        <input type="email" class="newsletter-input" placeholder="أدخل بريدك الإلكتروني" required>
        <button type="submit" class="btn btn-gold btn-lg">اشترك الآن</button>
      </form>
    </div>

    <!-- Best Sellers -->
    <div class="fade-in" style="margin-bottom:40px">
      <div class="section-header">
        <h2 class="section-title">الأكثر مبيعاً 🔥</h2>
        <button class="btn btn-ghost btn-sm" onclick="KayanStore.navigate('shop')">عرض الكل ›</button>
      </div>
      <div class="products-grid">${bestHTML}</div>
    </div>

    <!-- New Arrivals -->
    <div class="fade-in" style="margin-bottom:40px">
      <div class="section-header">
        <h2 class="section-title">وصل حديثاً ✨</h2>
        <button class="btn btn-ghost btn-sm" onclick="KayanStore.navigate('shop')">عرض الكل ›</button>
      </div>
      <div class="products-grid">${newHTML}</div>
    </div>

    <!-- Brand Logos -->
    <div class="fade-in" style="margin-bottom:40px">
      <div class="section-header">
        <h2 class="section-title">شركاؤنا</h2>
      </div>
      <div style="display:flex;gap:16px;overflow-x:auto;padding-bottom:8px;scrollbar-width:none">
        ${['سامسونج', 'أبل', 'سوني', 'شاومي', 'هواوي', 'LG', 'نايكي', 'أديداس'].map(brand => `
          <div class="card p-16" style="flex-shrink:0;padding:16px 32px;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:0.9rem;color:var(--text-muted);min-width:120px;text-align:center;cursor:pointer" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">${brand}</div>
        `).join('')}
      </div>
    </div>
  `;
};

// ===== RENDER SHOP PAGE =====
KayanStore.renderShop = function() {
  const cats = this.data.categories;
  const prods = this.getProducts(this.currentCategory, this.sortBy, this.searchQuery);
  const currentCat = cats.find(c => c.id === this.currentCategory);

  const filtersHTML = `
    <div class="sidebar-card">
      <div class="sidebar-title">🔍 التصفية</div>
      <!-- Categories Filter -->
      <div class="filter-group">
        <span class="filter-label">الفئات</span>
        ${cats.map(c => `
          <div class="filter-option ${c.id === this.currentCategory ? 'active' : ''}" data-category="${c.id}">
            <div class="filter-check">${c.id === this.currentCategory ? '✓' : ''}</div>
            <span>${c.icon} ${c.name}</span>
            <span style="margin-right:auto;font-size:0.75rem;color:var(--text-muted)">${c.id === 'all' ? this.data.products.length : this.data.products.filter(p => p.category === c.id).length}</span>
          </div>
        `).join('')}
      </div>
      <!-- Price Range -->
      <div class="filter-group">
        <span class="filter-label">نطاق السعر</span>
        <div class="price-slider-wrap">
          <div class="price-range-labels"><span>0</span><span>1,000,000 ريال</span></div>
          <input type="range" class="price-slider" min="0" max="1000000" value="700000" step="10000">
        </div>
      </div>
      <!-- Ratings Filter -->
      <div class="filter-group">
        <span class="filter-label">التقييم</span>
        ${[5,4,3,2,1].map(r => `
          <div class="filter-option">
            <div class="filter-check"></div>
            <span>${'★'.repeat(r)}${'☆'.repeat(5-r)} فأكثر</span>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Flash Deals Sidebar -->
    <div class="sidebar-card" style="background:linear-gradient(135deg,rgba(255,107,43,0.1),rgba(233,69,96,0.1));border-color:rgba(255,107,43,0.2)">
      <div class="sidebar-title text-primary">⚡ العرض اليومي</div>
      <div style="margin-bottom:12px">
        <div class="countdown" style="justify-content:center">
          <div class="countdown-unit" style="background:var(--bg-input)"><span class="cd-hours countdown-num">07</span><span class="countdown-label">ساعة</span></div>
          <span class="countdown-sep" style="color:var(--primary)">:</span>
          <div class="countdown-unit" style="background:var(--bg-input)"><span class="cd-minutes countdown-num">30</span><span class="countdown-label">دقيقة</span></div>
          <span class="countdown-sep" style="color:var(--primary)">:</span>
          <div class="countdown-unit" style="background:var(--bg-input)"><span class="cd-seconds countdown-num">00</span><span class="countdown-label">ثانية</span></div>
        </div>
      </div>
      ${this.data.flashDeals.slice(0,2).map(id => {
        const p = this.getProduct(id);
        if (!p) return '';
        return `
          <div style="display:flex;gap:10px;align-items:center;margin-bottom:12px;cursor:pointer" onclick="KayanStore.navigate('product',${p.id})">
            <img src="${p.image}" style="width:52px;height:52px;border-radius:8px;object-fit:cover" onerror="this.src='https://via.placeholder.com/52x52/1a1a2e/FF6B2B?text=K'">
            <div>
              <div style="font-size:0.8rem;font-weight:700;margin-bottom:2px">${p.name}</div>
              <div style="font-size:0.85rem;color:var(--primary);font-weight:800">${this.formatPrice(p.price)}</div>
              <div class="progress-bar" style="margin-top:4px">
                <div class="progress-fill" style="width:${Math.floor(Math.random()*40+40)}%"></div>
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  return `
    <div class="page-hero fade-in">
      <span class="page-hero-icon">${currentCat?.icon || '🛍️'}</span>
      <div>
        <h1 class="page-hero-title">${currentCat?.name || 'جميع المنتجات'}</h1>
        <div class="page-hero-breadcrumb">
          <span onclick="KayanStore.navigate('home')" style="cursor:pointer;color:var(--primary)">الرئيسية</span>
          <span class="breadcrumb-sep">/</span>
          <span>المتجر</span>
          ${this.currentCategory !== 'all' ? `<span class="breadcrumb-sep">/</span><span>${currentCat?.name}</span>` : ''}
        </div>
      </div>
    </div>

    <div style="display:flex;gap:24px;align-items:flex-start">
      <!-- Sidebar -->
      <div class="sidebar">${filtersHTML}</div>

      <!-- Main Content -->
      <div class="content-area">
        <div class="products-toolbar fade-in">
          <div class="products-count">عرض <span>${prods.length}</span> منتج</div>
          <div class="toolbar-actions">
            <select class="sort-select" id="sortSelect">
              <option value="popular">الأكثر شعبية</option>
              <option value="newest">الأحدث</option>
              <option value="price-low">السعر: الأقل أولاً</option>
              <option value="price-high">السعر: الأعلى أولاً</option>
              <option value="rating">الأعلى تقييماً</option>
              <option value="discount">الأكثر خصماً</option>
            </select>
            <div class="view-toggle">
              <button class="view-btn ${this.viewMode === 'grid' ? 'active' : ''}" id="gridViewBtn" title="عرض شبكة">▦</button>
              <button class="view-btn ${this.viewMode === 'list' ? 'active' : ''}" id="listViewBtn" title="عرض قائمة">☰</button>
            </div>
          </div>
        </div>

        <div class="products-grid ${this.viewMode === 'list' ? 'list-view' : ''}" id="productsContainer">
          ${this.renderProductsGrid(prods)}
        </div>

        <!-- Pagination -->
        <div class="pagination fade-in">
          <button class="page-btn">‹‹</button>
          ${[1,2,3,4,5].map(i => `<button class="page-btn ${i === 1 ? 'active' : ''}">${i}</button>`).join('')}
          <button class="page-btn">››</button>
        </div>
      </div>
    </div>
  `;
};

// ===== RENDER PRODUCT DETAIL =====
KayanStore.renderProductDetail = function() {
  const product = this.getProduct(this.currentProduct);
  if (!product) return `<div class="empty-state"><div class="empty-icon">🔍</div><h3 class="empty-title">المنتج غير موجود</h3><button class="btn btn-primary" onclick="KayanStore.navigate('shop')">العودة للمتجر</button></div>`;

  this.addToRecent(product.id);
  const stars = Array.from({length: 5}, (_, i) =>
    `<span class="star${i < Math.floor(product.rating) ? ' active' : ''}">★</span>`
  ).join('');
  const thumbs = product.images.map((img, i) => `
    <div class="gallery-thumb ${i === 0 ? 'active' : ''}">
      <img src="${img.replace('w=600', 'w=100')}" alt="${product.name} ${i+1}">
    </div>
  `).join('');

  const colors = product.colors.length ? `
    <div class="product-options">
      <div class="option-label">اللون: <span>${product.colors[0] === '#1a1a1a' ? 'أسود' : 'الأول'}</span></div>
      <div class="option-btns">
        ${product.colors.map(c => `<div class="color-option ${c === product.colors[0] ? 'active' : ''}" style="background:${c}" title="${c}"></div>`).join('')}
      </div>
    </div>
  ` : '';

  const sizes = product.sizes.length ? `
    <div class="product-options">
      <div class="option-label">المقاس/الخيار: <span>${product.sizes[0]}</span></div>
      <div class="option-btns">
        ${product.sizes.map(s => `<button class="option-btn ${s === product.sizes[0] ? 'active' : ''}">${s}</button>`).join('')}
      </div>
    </div>
  ` : '';

  const specs = product.specs ? Object.entries(product.specs).map(([k, v]) => `
    <tr><td>${k}</td><td>${v}</td></tr>
  `).join('') : '';

  // Fake reviews
  const fakeReviews = [
    { name: 'أحمد علي', date: 'مارس 2026', rating: 5, text: 'منتج رائع جداً، استلمته بسرعة وجودته ممتازة. أنصح به بشدة لكل من يبحث عن أفضل جودة.', verified: true, helpful: 42 },
    { name: 'فاطمة محمد', date: 'فبراير 2026', rating: 4, text: 'تجربة تسوق ممتازة مع كيان ستور، المنتج كما هو موصوف بالضبط والتوصيل كان سريعاً.', verified: true, helpful: 28 },
    { name: 'محمد حسن', date: 'يناير 2026', rating: 5, text: 'أفضل منتج اشتريته هذا العام! السعر مناسب جداً مقارنة بالجودة المقدمة.', verified: false, helpful: 15 }
  ];

  const relatedProds = this.data.products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return `
    <div class="page-hero fade-in">
      <span class="page-hero-icon">📦</span>
      <div>
        <h1 class="page-hero-title">${product.name}</h1>
        <div class="page-hero-breadcrumb">
          <span onclick="KayanStore.navigate('home')" style="cursor:pointer;color:var(--primary)">الرئيسية</span>
          <span class="breadcrumb-sep">/</span>
          <span onclick="KayanStore.navigate('shop')" style="cursor:pointer;color:var(--primary)">المتجر</span>
          <span class="breadcrumb-sep">/</span>
          <span>${product.name}</span>
        </div>
      </div>
    </div>

    <div class="product-detail">
      <!-- Gallery -->
      <div class="product-gallery fade-in">
        <div class="gallery-main">
          <img src="${product.images[0]}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/500x500/1a1a2e/FF6B2B?text=K'">
          <div class="gallery-zoom-hint">🔍 تكبير</div>
        </div>
        <div class="gallery-thumbs">${thumbs}</div>
      </div>

      <!-- Info -->
      <div class="product-detail-info fade-in">
        <div class="product-detail-brand">
          <span class="brand-name">${product.brand}</span>
          ${product.badge ? `<span class="product-badge ${product.badge}">${product.badgeText}</span>` : ''}
        </div>

        <h1 class="product-detail-title">${product.name}</h1>

        <div class="product-detail-meta">
          <div class="stars">${stars}</div>
          <span style="color:var(--text-muted);font-size:0.85rem">${product.rating} (${product.reviews.toLocaleString('ar')} تقييم)</span>
          <span class="badge badge-success">${product.stock > 20 ? '✅ متوفر' : product.stock > 0 ? '⚠️ كمية محدودة' : '❌ نفد'}</span>
        </div>

        <div style="display:flex;align-items:baseline;gap:12px;margin-bottom:24px">
          <span class="product-detail-price">${this.formatPrice(product.price)}</span>
          ${product.oldPrice ? `<span class="product-detail-price-old">${this.formatPrice(product.oldPrice)}</span>` : ''}
          ${product.discount ? `<span class="badge badge-error">خصم ${product.discount}%</span>` : ''}
        </div>

        <p style="font-size:0.9rem;color:var(--text-secondary);line-height:1.8;margin-bottom:20px">${product.description}</p>

        ${colors}
        ${sizes}

        <!-- Quantity -->
        <div class="product-options">
          <div class="option-label">الكمية:</div>
          <div class="qty-selector">
            <button class="qty-btn" data-action="minus">−</button>
            <input class="qty-num" value="1" min="1" max="${product.stock}" type="number">
            <button class="qty-btn" data-action="plus">+</button>
          </div>
        </div>

        <!-- Actions -->
        <div class="detail-actions" style="margin-top:20px">
          <button class="btn btn-primary btn-lg" style="flex:2" data-add-cart="${product.id}">🛒 أضف للسلة</button>
          <button class="btn btn-gold btn-lg" style="flex:1" onclick="KayanStore.addToCart(${product.id});KayanStore.navigate('checkout')">⚡ اشتري الآن</button>
          <button class="btn btn-secondary btn-icon btn-lg" data-wishlist="${product.id}" title="أضف للمفضلة">♡</button>
          <button class="btn btn-secondary btn-icon btn-lg" onclick="KayanStore.toggleCompare(${product.id})" title="مقارنة">⚖️</button>
        </div>

        <!-- Features -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:20px">
          ${[['🚀','شحن سريع 24 ساعة'],['🔒','ضمان الأصالة 100%'],['↩️','إرجاع مجاني 30 يوم'],['🎁','تغليف مميز مجاني']].map(([i,t]) =>
            `<div style="display:flex;align-items:center;gap:8px;font-size:0.82rem;color:var(--text-secondary)"><span>${i}</span>${t}</div>`
          ).join('')}
        </div>

        <!-- Tags -->
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:16px">
          ${product.tags.map(t => `<span class="badge badge-primary">${t}</span>`).join('')}
        </div>

        <!-- Share -->
        <div style="margin-top:20px;padding-top:16px;border-top:1px solid var(--border);display:flex;align-items:center;gap:12px">
          <span style="font-size:0.85rem;color:var(--text-muted)">مشاركة:</span>
          ${['واتساب','تيليجرام','فيسبوك','تويتر'].map(s => `<button class="btn btn-ghost btn-sm" onclick="KayanStore.toast('success','✅ تم النسخ!','رابط المنتج')">${s}</button>`).join('')}
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="detail-tabs card p-24 fade-in">
      <div class="detail-tab-nav">
        <button class="detail-tab-btn active" data-tab="desc">الوصف</button>
        <button class="detail-tab-btn" data-tab="specs">المواصفات</button>
        <button class="detail-tab-btn" data-tab="reviews">التقييمات (${product.reviews})</button>
        <button class="detail-tab-btn" data-tab="shipping">الشحن والإرجاع</button>
      </div>
      <div data-tab-content="desc" class="detail-tab-content active">
        <p style="font-size:0.92rem;line-height:1.9;color:var(--text-secondary)">${product.description}</p>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin-top:20px">
          ${Object.entries(product.specs || {}).slice(0,4).map(([k,v]) =>
            `<div class="card p-16"><div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:4px">${k}</div><div style="font-weight:700;font-size:0.9rem">${v}</div></div>`
          ).join('')}
        </div>
      </div>
      <div data-tab-content="specs" class="detail-tab-content">
        <table class="specs-table"><tbody>${specs}</tbody></table>
      </div>
      <div data-tab-content="reviews" class="detail-tab-content">
        <div class="reviews-summary">
          <div class="review-big-score">
            <div class="review-big-num">${product.rating}</div>
            <div class="stars" style="justify-content:center;margin:8px 0">${stars}</div>
            <div style="font-size:0.8rem;color:var(--text-muted)">${product.reviews.toLocaleString('ar')} تقييم</div>
          </div>
          <div class="review-bars">
            ${[5,4,3,2,1].map(r => `
              <div class="review-bar-row">
                <span class="review-bar-label">${r}★</span>
                <div class="review-bar-track"><div class="review-bar-fill" style="width:${r === 5 ? 70 : r === 4 ? 20 : r === 3 ? 7 : 2}%"></div></div>
                <span class="review-bar-count">${r === 5 ? 70 : r === 4 ? 20 : r === 3 ? 7 : r === 2 ? 2 : 1}%</span>
              </div>
            `).join('')}
          </div>
        </div>
        ${fakeReviews.map(r => `
          <div class="review-item">
            <div class="review-author">
              <div class="review-avatar">${r.name[0]}</div>
              <div>
                <div class="review-name">${r.name}</div>
                <div class="review-date">${r.date}</div>
              </div>
              <div style="margin-right:auto">
                <div class="stars">${Array.from({length:5},(_,i) => `<span class="star${i<r.rating?' active':''}">★</span>`).join('')}</div>
              </div>
            </div>
            ${r.verified ? '<span class="review-verified">✓ مشتري موثق</span>' : ''}
            <p class="review-text" style="margin-top:10px">${r.text}</p>
            <div class="review-helpful" style="margin-top:12px">مفيد؟ 👍 ${r.helpful} | 👎 ${Math.floor(r.helpful/8)}</div>
          </div>
        `).join('')}
        <button class="btn btn-outline w-full" onclick="KayanStore.toast('info','💬 قريباً','ميزة إضافة التقييمات قيد التطوير')">+ أضف تقييمك</button>
      </div>
      <div data-tab-content="shipping" class="detail-tab-content">
        <div style="display:grid;gap:16px">
          ${[
            ['🚀','شحن سريع','التوصيل خلال 24-48 ساعة في صنعاء، 3-5 أيام لباقي المحافظات'],
            ['↩️','سياسة الإرجاع','إمكانية الإرجاع خلال 30 يوماً من تاريخ الاستلام بدون أي شروط'],
            ['🔒','ضمان الجودة','جميع منتجاتنا أصلية 100% ومضمونة من الشركة المصنعة'],
            ['💳','طرق الدفع','كاش عند الاستلام، تحويل بنكي، دفع إلكتروني']
          ].map(([i,t,d]) => `
            <div class="card p-16 flex gap-16 items-center">
              <span style="font-size:32px">${i}</span>
              <div><div style="font-weight:800;margin-bottom:4px">${t}</div><div style="font-size:0.85rem;color:var(--text-secondary)">${d}</div></div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- Related Products -->
    ${relatedProds.length ? `
      <div class="fade-in" style="margin-top:40px">
        <div class="section-header">
          <h2 class="section-title">منتجات ذات صلة</h2>
        </div>
        <div class="products-grid">
          ${relatedProds.map(p => this.renderProductCard(p)).join('')}
        </div>
      </div>
    ` : ''}
  `;
};

// ===== RENDER CART PAGE =====
KayanStore.renderCartPage = function() {
  if (!this.cart.length) return `
    <div class="empty-state">
      <div class="empty-icon">🛒</div>
      <h3 class="empty-title">سلة التسوق فارغة</h3>
      <p class="empty-desc">ابدأ بإضافة منتجات رائعة إلى سلتك</p>
      <button class="btn btn-primary btn-lg" onclick="KayanStore.navigate('shop')">🛍️ تسوق الآن</button>
    </div>
  `;

  const subtotal = this.getCartTotal();
  const shipping = subtotal > 50000 ? 0 : 3000;
  const tax = Math.floor(subtotal * 0.03);
  const total = subtotal + shipping + tax;

  return `
    <div class="page-hero fade-in">
      <span class="page-hero-icon">🛒</span>
      <div>
        <h1 class="page-hero-title">سلة التسوق (${this.getCartCount()} منتج)</h1>
        <div class="page-hero-breadcrumb">
          <span onclick="KayanStore.navigate('home')" style="cursor:pointer;color:var(--primary)">الرئيسية</span>
          <span class="breadcrumb-sep">/</span>
          <span>سلة التسوق</span>
        </div>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 360px;gap:24px;align-items:start">
      <div>
        ${this.cart.map(item => {
          const p = this.getProduct(item.productId);
          if (!p) return '';
          return `
            <div class="card p-16 fade-in" style="display:flex;gap:16px;align-items:center;margin-bottom:16px">
              <img src="${p.image}" style="width:90px;height:90px;border-radius:12px;object-fit:cover" onerror="this.src='https://via.placeholder.com/90x90/1a1a2e/FF6B2B?text=K'" onclick="KayanStore.navigate('product',${p.id})" style="cursor:pointer">
              <div style="flex:1">
                <div style="font-weight:800;margin-bottom:4px;cursor:pointer" onclick="KayanStore.navigate('product',${p.id})">${p.name}</div>
                <div style="font-size:0.85rem;color:var(--primary);margin-bottom:8px">${this.formatPrice(p.price)}</div>
                <div class="qty-selector">
                  <button class="qty-btn" data-action="minus" onclick="KayanStore.updateCartQty('${item.key}', ${item.qty - 1});KayanStore.renderPage()">−</button>
                  <span class="qty-num">${item.qty}</span>
                  <button class="qty-btn" data-action="plus" onclick="KayanStore.updateCartQty('${item.key}', ${item.qty + 1});KayanStore.renderPage()">+</button>
                </div>
              </div>
              <div style="text-align:left">
                <div style="font-size:1.1rem;font-weight:900;color:var(--primary);margin-bottom:12px">${this.formatPrice(p.price * item.qty)}</div>
                <button class="btn btn-ghost btn-sm" style="color:var(--error)" onclick="KayanStore.removeFromCart('${item.key}');KayanStore.renderPage()">🗑️ حذف</button>
              </div>
            </div>
          `;
        }).join('')}
        <div style="display:flex;gap:12px;margin-top:8px">
          <button class="btn btn-ghost" onclick="KayanStore.navigate('shop')">← متابعة التسوق</button>
          <button class="btn btn-secondary" onclick="if(confirm('هل تريد مسح السلة؟')){KayanStore.cart=[];KayanStore.saveCart();KayanStore.updateCartBadge();KayanStore.renderPage()}">🗑️ مسح السلة</button>
        </div>
      </div>
      <div class="order-summary-card fade-in">
        <div class="order-summary-header">ملخص الطلب</div>
        <div style="padding:16px">
          <div class="cart-coupon">
            <input id="couponInput" class="input" placeholder="أدخل كود الخصم" style="flex:1">
            <button class="btn btn-outline btn-sm" id="applyCoupon">تطبيق</button>
          </div>
        </div>
        <div class="order-totals">
          <div class="order-total-row"><span>المجموع الفرعي</span><span>${this.formatPrice(subtotal)}</span></div>
          <div class="order-total-row"><span>الشحن</span><span>${shipping === 0 ? '<span style="color:var(--success)">مجاني</span>' : this.formatPrice(shipping)}</span></div>
          <div class="order-total-row"><span>الضريبة (3%)</span><span>${this.formatPrice(tax)}</span></div>
          <div class="order-grand-total"><span>الإجمالي</span><span>${this.formatPrice(total)}</span></div>
        </div>
        <div style="padding:16px">
          <button class="btn btn-primary btn-lg w-full" onclick="KayanStore.navigate('checkout')">إتمام الشراء ›</button>
          <div style="display:flex;justify-content:center;gap:12px;margin-top:12px">
            ${['كاش','تحويل','دفع إلكتروني'].map(m => `<span class="payment-icon">${m}</span>`).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
};

// ===== RENDER CHECKOUT PAGE =====
KayanStore.renderCheckout = function() {
  const subtotal = this.getCartTotal();
  const shipping = 3000;
  const total = subtotal + shipping;

  return `
    <div class="page-hero fade-in">
      <span class="page-hero-icon">💳</span>
      <div>
        <h1 class="page-hero-title">إتمام الشراء</h1>
        <div class="page-hero-breadcrumb">
          <span onclick="KayanStore.navigate('home')" style="cursor:pointer;color:var(--primary)">الرئيسية</span>
          <span class="breadcrumb-sep">/</span>
          <span onclick="KayanStore.navigate('cart')" style="cursor:pointer;color:var(--primary)">السلة</span>
          <span class="breadcrumb-sep">/</span>
          <span>إتمام الشراء</span>
        </div>
      </div>
    </div>

    <!-- Steps -->
    <div class="checkout-steps fade-in">
      <div class="checkout-step active" data-step="1">
        <div class="step-num">1</div>
        <div class="step-info"><div class="step-title">معلومات التوصيل</div><div class="step-subtitle">عنوان الشحن</div></div>
      </div>
      <div class="checkout-step" data-step="2">
        <div class="step-num">2</div>
        <div class="step-info"><div class="step-title">طريقة الدفع</div><div class="step-subtitle">اختر الدفع</div></div>
      </div>
      <div class="checkout-step" data-step="3">
        <div class="step-num">3</div>
        <div class="step-info"><div class="step-title">مراجعة الطلب</div><div class="step-subtitle">تأكيد ودفع</div></div>
      </div>
    </div>

    <div class="checkout-layout">
      <div>
        <!-- Shipping Info -->
        <div class="checkout-section fade-in" data-step-content="1">
          <div class="checkout-section-header">📍 معلومات التوصيل</div>
          <div class="checkout-section-body">
            <div class="form-grid form-grid-2">
              <div class="form-group">
                <label class="form-label">الاسم الأول <span class="form-required">*</span></label>
                <input class="input" placeholder="أحمد" value="${this.user?.name?.split(' ')[0] || ''}">
              </div>
              <div class="form-group">
                <label class="form-label">الاسم الأخير <span class="form-required">*</span></label>
                <input class="input" placeholder="محمد">
              </div>
              <div class="form-group">
                <label class="form-label">رقم الهاتف <span class="form-required">*</span></label>
                <input class="input" placeholder="+967 7XX XXX XXX" type="tel" dir="ltr">
              </div>
              <div class="form-group">
                <label class="form-label">البريد الإلكتروني</label>
                <input class="input" placeholder="email@example.com" type="email" dir="ltr" value="${this.user?.email || ''}">
              </div>
              <div class="form-group" style="grid-column:1/-1">
                <label class="form-label">المحافظة <span class="form-required">*</span></label>
                <select class="select">
                  ${['أمانة العاصمة (صنعاء)','عدن','تعز','الحديدة','إب','ذمار','حضرموت','المكلا','المهرة','حجة','صعدة','مأرب'].map(c => `<option>${c}</option>`).join('')}
                </select>
              </div>
              <div class="form-group" style="grid-column:1/-1">
                <label class="form-label">العنوان التفصيلي <span class="form-required">*</span></label>
                <textarea class="textarea" rows="2" placeholder="الحي، الشارع، رقم المبنى..."></textarea>
              </div>
              <div class="form-group" style="grid-column:1/-1">
                <label class="form-label">ملاحظات للتوصيل</label>
                <textarea class="textarea" rows="2" placeholder="أي ملاحظات للمندوب..."></textarea>
              </div>
            </div>
            <div style="margin-top:16px;display:flex;justify-content:flex-end">
              <button class="btn btn-primary" data-step="2">التالي: طريقة الدفع ›</button>
            </div>
          </div>
        </div>

        <!-- Payment -->
        <div class="checkout-section fade-in hidden" data-step-content="2">
          <div class="checkout-section-header">💳 طريقة الدفع</div>
          <div class="checkout-section-body">
            <div class="payment-options">
              ${[
                ['cash', '💵', 'الدفع عند الاستلام', 'ادفع كاشاً عند وصول طلبك', true],
                ['bank', '🏦', 'تحويل بنكي', 'تحويل لحسابنا في البنك الأهلي', false],
                ['wallet', '📱', 'محفظة إلكترونية', 'كريمي، سبأفون، هواش', false]
              ].map(([id, icon, name, desc, selected]) => `
                <div class="payment-option ${selected ? 'selected' : ''}">
                  <div class="payment-radio ${selected ? '' : ''}"></div>
                  <span class="payment-icon-wrap">${icon}</span>
                  <div class="payment-info">
                    <div class="payment-name">${name}</div>
                    <div class="payment-desc">${desc}</div>
                  </div>
                </div>
              `).join('')}
            </div>
            <div style="margin-top:16px;display:flex;justify-content:space-between">
              <button class="btn btn-secondary" data-step="1">‹ السابق</button>
              <button class="btn btn-primary" data-step="3">التالي: مراجعة الطلب ›</button>
            </div>
          </div>
        </div>

        <!-- Review -->
        <div class="checkout-section fade-in hidden" data-step-content="3">
          <div class="checkout-section-header">✅ مراجعة الطلب</div>
          <div class="checkout-section-body">
            ${this.cart.map(item => {
              const p = this.getProduct(item.productId);
              if (!p) return '';
              return `
                <div class="order-item">
                  <img src="${p.image}" class="order-item-img" onerror="this.src='https://via.placeholder.com/48/1a1a2e/FF6B2B?text=K'">
                  <div class="order-item-info">
                    <div class="order-item-name">${p.name}</div>
                    <div class="order-item-qty">الكمية: ${item.qty}</div>
                  </div>
                  <div class="order-item-price">${this.formatPrice(p.price * item.qty)}</div>
                </div>
              `;
            }).join('')}
            <div style="margin-top:16px;display:flex;justify-content:space-between">
              <button class="btn btn-secondary" data-step="2">‹ السابق</button>
              <button class="btn btn-gold btn-lg" id="placeOrderBtn">🎉 تأكيد الطلب وادفع</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="order-summary-card fade-in">
        <div class="order-summary-header">📋 ملخص الطلب</div>
        <div class="order-summary-items">
          ${this.cart.map(item => {
            const p = this.getProduct(item.productId);
            if (!p) return '';
            return `
              <div class="order-item">
                <img src="${p.image}" class="order-item-img" onerror="this.src='https://via.placeholder.com/48/1a1a2e/FF6B2B?text=K'">
                <div class="order-item-info">
                  <div class="order-item-name">${p.name}</div>
                  <div class="order-item-qty">× ${item.qty}</div>
                </div>
                <div class="order-item-price">${this.formatPrice(p.price * item.qty)}</div>
              </div>
            `;
          }).join('')}
        </div>
        <div class="order-coupon">
          <div class="cart-coupon">
            <input id="couponInput" class="input" placeholder="كود الخصم" style="flex:1">
            <button class="btn btn-outline btn-sm" id="applyCoupon">تطبيق</button>
          </div>
        </div>
        <div class="order-totals">
          <div class="order-total-row"><span>المجموع</span><span>${this.formatPrice(subtotal)}</span></div>
          <div class="order-total-row"><span>الشحن</span><span>${this.formatPrice(shipping)}</span></div>
          <div class="order-grand-total"><span>الإجمالي</span><span>${this.formatPrice(total)}</span></div>
        </div>
      </div>
    </div>
  `;
};

// ===== RENDER WISHLIST =====
KayanStore.renderWishlistPage = function() {
  const prods = this.wishlist.map(id => this.getProduct(id)).filter(Boolean);
  return `
    <div class="page-hero fade-in">
      <span class="page-hero-icon">❤️</span>
      <div>
        <h1 class="page-hero-title">قائمة المفضلة (${prods.length})</h1>
        <div class="page-hero-breadcrumb">
          <span onclick="KayanStore.navigate('home')" style="cursor:pointer;color:var(--primary)">الرئيسية</span>
          <span class="breadcrumb-sep">/</span><span>المفضلة</span>
        </div>
      </div>
    </div>
    ${!prods.length ? `
      <div class="empty-state">
        <div class="empty-icon">💔</div>
        <h3 class="empty-title">قائمة المفضلة فارغة</h3>
        <p class="empty-desc">احفظ المنتجات التي تعجبك لشرائها لاحقاً</p>
        <button class="btn btn-primary btn-lg" onclick="KayanStore.navigate('shop')">🛍️ تسوق الآن</button>
      </div>
    ` : `
      <div style="margin-bottom:16px;display:flex;justify-content:space-between;align-items:center">
        <span style="color:var(--text-muted);font-size:0.88rem">${prods.length} منتج في المفضلة</span>
        <button class="btn btn-primary btn-sm" onclick="KayanStore.wishlist.forEach(id=>KayanStore.addToCart(id));KayanStore.toast('success','✅','تمت إضافة الكل للسلة')">🛒 إضافة الكل للسلة</button>
      </div>
      <div class="products-grid">
        ${prods.map(p => this.renderProductCard(p)).join('')}
      </div>
    `}
  `;
};

// ===== RENDER PROFILE PAGE =====
KayanStore.renderProfilePage = function() {
  return `
    <div class="page-hero fade-in">
      <span class="page-hero-icon">👤</span>
      <div>
        <h1 class="page-hero-title">حسابي</h1>
        <div class="page-hero-breadcrumb">
          <span onclick="KayanStore.navigate('home')" style="cursor:pointer;color:var(--primary)">الرئيسية</span>
          <span class="breadcrumb-sep">/</span><span>حسابي</span>
        </div>
      </div>
    </div>
    <div class="profile-layout">
      <div class="profile-sidebar-nav">
        <div class="profile-card">
          <div class="profile-cover"></div>
          <div class="profile-avatar-wrap">
            <div class="profile-avatar-big">${this.user?.name?.[0] || '👤'}</div>
          </div>
          <div class="profile-info">
            <div class="profile-name">${this.user?.name || 'مستخدم كيان'}</div>
            <div class="profile-email">${this.user?.email || 'user@kayanstore.ye'}</div>
            <div class="profile-stats">
              <div class="profile-stat"><div class="profile-stat-num">12</div><div class="profile-stat-label">طلب</div></div>
              <div class="profile-stat"><div class="profile-stat-num">4</div><div class="profile-stat-label">مراجعة</div></div>
              <div class="profile-stat"><div class="profile-stat-num">${this.wishlist.length}</div><div class="profile-stat-label">مفضلة</div></div>
            </div>
          </div>
        </div>
        ${[
          ['info', '👤', 'معلوماتي الشخصية'],
          ['orders', '📦', 'طلباتي'],
          ['addresses', '📍', 'عناويني'],
          ['wishlist-nav', '❤️', 'المفضلة'],
          ['wallet', '💰', 'محفظتي'],
          ['notifications', '🔔', 'الإشعارات'],
          ['security', '🔒', 'الأمان والخصوصية']
        ].map(([id, icon, label], i) => `
          <div class="profile-nav-item ${i === 0 ? 'active' : ''}" data-section="${id}">
            <span class="nav-icon">${icon}</span>
            ${label}
          </div>
        `).join('')}
        <div style="margin-top:8px;border-top:1px solid var(--border);padding-top:8px">
          <div class="profile-nav-item" style="color:var(--error)" onclick="KayanStore.toast('info','👋','تم تسجيل الخروج بنجاح')">
            <span class="nav-icon">🚪</span> تسجيل الخروج
          </div>
        </div>
      </div>
      <div>
        <div id="section-info" class="profile-section">
          <div class="profile-card" style="padding:24px">
            <h3 style="margin-bottom:20px;font-size:1rem">المعلومات الشخصية</h3>
            <div class="form-grid form-grid-2">
              <div class="form-group"><label class="form-label">الاسم الأول</label><input class="input" value="${this.user?.name?.split(' ')[0] || 'مستخدم'}"></div>
              <div class="form-group"><label class="form-label">الاسم الأخير</label><input class="input" value="كيان"></div>
              <div class="form-group"><label class="form-label">البريد الإلكتروني</label><input class="input" type="email" value="user@kayanstore.ye" dir="ltr"></div>
              <div class="form-group"><label class="form-label">رقم الهاتف</label><input class="input" type="tel" value="+967781200000" dir="ltr"></div>
              <div class="form-group"><label class="form-label">تاريخ الميلاد</label><input class="input" type="date" value="1995-01-01"></div>
              <div class="form-group"><label class="form-label">الجنس</label><select class="select"><option>ذكر</option><option>أنثى</option></select></div>
            </div>
            <button class="btn btn-primary" style="margin-top:16px" onclick="KayanStore.toast('success','✅ تم الحفظ','تم تحديث معلوماتك بنجاح')">💾 حفظ التغييرات</button>
          </div>
        </div>
        <div id="section-orders" class="profile-section hidden">
          ${this.renderOrdersPage(true)}
        </div>
        <div id="section-addresses" class="profile-section hidden">
          <div class="profile-card" style="padding:24px">
            <h3 style="margin-bottom:20px;font-size:1rem">عناويني</h3>
            <div style="display:grid;gap:12px">
              ${['صنعاء - شارع الزبيري، حي الحصبة، مبنى رقم 15', 'عدن - المنصورة، شارع المدينة القديمة'].map((addr, i) => `
                <div class="card p-16" style="display:flex;align-items:center;gap:12px">
                  <span style="font-size:24px">📍</span>
                  <div style="flex:1">
                    <div style="font-weight:700;font-size:0.88rem">${i === 0 ? 'المنزل (الافتراضي)' : 'العمل'}</div>
                    <div style="font-size:0.82rem;color:var(--text-muted)">${addr}</div>
                  </div>
                  <div style="display:flex;gap:8px">
                    <button class="btn btn-ghost btn-sm">تعديل</button>
                    <button class="btn btn-ghost btn-sm" style="color:var(--error)">حذف</button>
                  </div>
                </div>
              `).join('')}
            </div>
            <button class="btn btn-outline w-full" style="margin-top:16px" onclick="KayanStore.toast('info','➕','ميزة إضافة عنوان جديد')">+ إضافة عنوان جديد</button>
          </div>
        </div>
        <div id="section-wallet" class="profile-section hidden">
          <div class="profile-card" style="padding:24px">
            <h3 style="margin-bottom:20px;font-size:1rem">محفظتي</h3>
            <div style="text-align:center;padding:32px;background:linear-gradient(135deg,var(--primary-dark),var(--accent2));border-radius:var(--radius-lg);margin-bottom:20px">
              <div style="font-size:0.85rem;color:rgba(255,255,255,0.8);margin-bottom:8px">الرصيد الحالي</div>
              <div style="font-size:2.5rem;font-weight:900;color:white">15,000 ريال</div>
              <div style="font-size:0.8rem;color:rgba(255,255,255,0.7);margin-top:4px">= 450 نقطة مكافأة</div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
              <button class="btn btn-primary" onclick="KayanStore.toast('info','💰','ميزة الشحن قيد التطوير')">+ شحن المحفظة</button>
              <button class="btn btn-secondary" onclick="KayanStore.toast('info','💸','ميزة السحب قيد التطوير')">↗ سحب الرصيد</button>
            </div>
          </div>
        </div>
        <div id="section-wishlist-nav" class="profile-section hidden">
          <div class="products-grid">
            ${this.wishlist.map(id => {
              const p = this.getProduct(id);
              return p ? this.renderProductCard(p) : '';
            }).join('')}
          </div>
          ${!this.wishlist.length ? '<div class="empty-state"><div class="empty-icon">💔</div><h3 class="empty-title">المفضلة فارغة</h3></div>' : ''}
        </div>
        <div id="section-notifications" class="profile-section hidden">
          <div class="profile-card" style="padding:24px">
            <h3 style="margin-bottom:20px;font-size:1rem">الإشعارات</h3>
            ${[
              ['🎉', 'طلبك #KY-2024-001 تم توصيله بنجاح', 'منذ يومين', 'success'],
              ['🚀', 'طلبك #KY-2024-002 في الطريق إليك', 'منذ 3 أيام', 'info'],
              ['💰', 'لديك 450 نقطة مكافأة جاهزة للاستخدام', 'منذ أسبوع', 'warning'],
              ['🎁', 'عرض حصري: خصم 30% على الإلكترونيات اليوم فقط!', 'منذ أسبوع', 'primary']
            ].map(([icon, msg, time, type]) => `
              <div style="display:flex;gap:12px;padding:14px;background:var(--bg-input);border-radius:var(--radius-md);margin-bottom:10px">
                <span style="font-size:22px">${icon}</span>
                <div style="flex:1"><div style="font-size:0.88rem;font-weight:600">${msg}</div><div style="font-size:0.75rem;color:var(--text-muted);margin-top:4px">${time}</div></div>
              </div>
            `).join('')}
          </div>
        </div>
        <div id="section-security" class="profile-section hidden">
          <div class="profile-card" style="padding:24px">
            <h3 style="margin-bottom:20px;font-size:1rem">الأمان والخصوصية</h3>
            <div style="display:grid;gap:12px">
              ${[
                ['🔑', 'تغيير كلمة المرور', 'آخر تغيير: منذ 3 أشهر'],
                ['📱', 'التحقق بخطوتين', 'مفعّل - عبر رسالة SMS'],
                ['📋', 'سجل تسجيل الدخول', 'عرض جلسات الدخول'],
                ['🗑️', 'حذف الحساب', 'حذف حسابك نهائياً']
              ].map(([i, t, d]) => `
                <div class="card p-16" style="display:flex;align-items:center;gap:12px;cursor:pointer" onclick="KayanStore.toast('info','🔧','هذه الميزة قيد التطوير')">
                  <span style="font-size:24px">${i}</span>
                  <div style="flex:1"><div style="font-weight:700;font-size:0.88rem">${t}</div><div style="font-size:0.78rem;color:var(--text-muted)">${d}</div></div>
                  <span style="color:var(--text-muted)">›</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
};

// ===== RENDER ORDERS PAGE =====
KayanStore.renderOrdersPage = function(inline = false) {
  const ordersData = [
    { id: 'KY-2026-001', date: '14 أبريل 2026', items: 3, total: 450000, status: 'delivered', statusLabel: 'تم التوصيل' },
    { id: 'KY-2026-002', date: '10 أبريل 2026', items: 1, total: 299999, status: 'shipped', statusLabel: 'في الطريق' },
    { id: 'KY-2026-003', date: '5 أبريل 2026', items: 2, total: 189998, status: 'processing', statusLabel: 'قيد المعالجة' },
    { id: 'KY-2026-004', date: '1 مارس 2026', items: 1, total: 89999, status: 'delivered', statusLabel: 'تم التوصيل' },
    { id: 'KY-2025-098', date: '28 فبراير 2026', items: 4, total: 750000, status: 'cancelled', statusLabel: 'ملغي' }
  ];

  const content = `
    <div class="profile-card ${inline ? '' : 'fade-in'}" style="overflow:hidden">
      ${!inline ? `
        <div style="padding:20px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center">
          <h3 style="font-size:1rem">طلباتي</h3>
          <div style="display:flex;gap:8px">
            ${['الكل','نشط','مكتمل','ملغي'].map(s => `<button class="btn btn-ghost btn-sm">${s}</button>`).join('')}
          </div>
        </div>
      ` : `<div style="padding:20px;border-bottom:1px solid var(--border)"><h3 style="font-size:1rem">آخر الطلبات</h3></div>`}
      <div style="overflow-x:auto">
        <table class="orders-table">
          <thead>
            <tr>
              <th>رقم الطلب</th>
              <th>التاريخ</th>
              <th>عدد المنتجات</th>
              <th>الإجمالي</th>
              <th>الحالة</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            ${ordersData.map(o => `
              <tr>
                <td style="font-weight:700;color:var(--primary)">${o.id}</td>
                <td>${o.date}</td>
                <td>${o.items} منتجات</td>
                <td style="font-weight:700">${KayanStore.formatPrice(o.total)}</td>
                <td><span class="order-status ${o.status}">${o.statusLabel}</span></td>
                <td>
                  <div style="display:flex;gap:6px">
                    <button class="btn btn-ghost btn-sm" onclick="KayanStore.toast('info','📦 رقم الطلب: ${o.id}','تتبع الشحنة')">تتبع</button>
                    <button class="btn btn-ghost btn-sm" onclick="KayanStore.toast('info','📄','عرض تفاصيل الطلب')">تفاصيل</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  if (inline) return content;
  return `
    <div class="page-hero fade-in">
      <span class="page-hero-icon">📦</span>
      <div>
        <h1 class="page-hero-title">طلباتي</h1>
        <div class="page-hero-breadcrumb">
          <span onclick="KayanStore.navigate('home')" style="cursor:pointer;color:var(--primary)">الرئيسية</span>
          <span class="breadcrumb-sep">/</span><span>طلباتي</span>
        </div>
      </div>
    </div>
    ${content}
  `;
};

// ===== RENDER SUCCESS PAGE =====
KayanStore.renderSuccessPage = function() {
  const orderId = 'KY-2026-' + Math.floor(Math.random() * 9000 + 1000);
  return `
    <div class="success-page fade-in">
      <div class="success-icon">✅</div>
      <h1 style="font-size:1.8rem;margin-bottom:8px">تم تأكيد طلبك! 🎉</h1>
      <p style="color:var(--text-secondary);margin-bottom:16px">شكراً لك على ثقتك بكيان ستور. سيتم التواصل معك قريباً.</p>
      <div class="success-order-id">رقم الطلب: ${orderId}</div>
      <p style="color:var(--text-muted);font-size:0.88rem;margin-bottom:32px">سيتم إرسال تفاصيل الطلب على واتساب وبريدك الإلكتروني</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px;margin-bottom:32px;max-width:600px;margin-left:auto;margin-right:auto">
        ${[
          ['📦','تجهيز الطلب','1-2 ساعة'],
          ['🚀','الشحن','24 ساعة'],
          ['✅','التوصيل','1-3 أيام']
        ].map(([i,t,d]) => `
          <div class="card p-16 text-center">
            <div style="font-size:32px;margin-bottom:8px">${i}</div>
            <div style="font-weight:800;margin-bottom:4px;font-size:0.9rem">${t}</div>
            <div style="font-size:0.78rem;color:var(--primary)">${d}</div>
          </div>
        `).join('')}
      </div>
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
        <button class="btn btn-primary btn-lg" onclick="KayanStore.navigate('orders')">📦 تتبع الطلب</button>
        <button class="btn btn-secondary btn-lg" onclick="KayanStore.navigate('home')">🏠 العودة للرئيسية</button>
        <button class="btn btn-outline btn-lg" onclick="KayanStore.navigate('shop')">🛍️ متابعة التسوق</button>
      </div>
    </div>
  `;
};
