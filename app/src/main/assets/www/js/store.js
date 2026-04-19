/* ===== KAYAN STORE - MAIN JS ===== */
'use strict';

// ===== GLOBAL STATE =====
const KayanStore = {
  data: null,
  cart: [],
  wishlist: [],
  compare: [],
  recentlyViewed: [],
  currentPage: 'home',
  currentCategory: 'all',
  currentProduct: null,
  searchQuery: '',
  filters: { price: [0, 1000000], brands: [], ratings: 0 },
  sortBy: 'popular',
  viewMode: 'grid',
  user: null,
  currency: 'YER',
  theme: 'dark',

  // Init
  async init() {
    this.loadFromStorage();
    await this.loadData();
    this.initUI();
    this.initRouter();
    this.renderPage();
    this.startCountdown();
    this.initScrollAnimations();
    this.initSearchAutocomplete();
    this.updateCartBadge();
    this.updateWishlistBadge();
    this.showWelcomeToast();
  },

  // Load data
  async loadData() {
    try {
      const res = await fetch('data/products.json');
      this.data = await res.json();
    } catch (e) {
      // fallback
      console.warn('Data load fallback');
    }
  },

  // Storage
  loadFromStorage() {
    this.cart = JSON.parse(localStorage.getItem('kayan_cart') || '[]');
    this.wishlist = JSON.parse(localStorage.getItem('kayan_wishlist') || '[]');
    this.compare = JSON.parse(localStorage.getItem('kayan_compare') || '[]');
    this.recentlyViewed = JSON.parse(localStorage.getItem('kayan_recent') || '[]');
    this.user = JSON.parse(localStorage.getItem('kayan_user') || 'null');
    if (!this.user) {
      this.user = { name: 'زائر', email: '', avatar: null, points: 0 };
    }
  },

  saveCart() { localStorage.setItem('kayan_cart', JSON.stringify(this.cart)); },
  saveWishlist() { localStorage.setItem('kayan_wishlist', JSON.stringify(this.wishlist)); },
  saveCompare() { localStorage.setItem('kayan_compare', JSON.stringify(this.compare)); },
  saveRecent() { localStorage.setItem('kayan_recent', JSON.stringify(this.recentlyViewed)); },

  // Format price
  formatPrice(price) {
    return new Intl.NumberFormat('ar-YE').format(price) + ' ريال';
  },

  // Get product by id
  getProduct(id) {
    return this.data?.products?.find(p => p.id === id);
  },

  // Get products by category
  getProducts(catId = 'all', sortBy = 'popular', search = '') {
    if (!this.data) return [];
    let prods = [...this.data.products];
    if (catId !== 'all') prods = prods.filter(p => p.category === catId);
    if (search) {
      const q = search.toLowerCase();
      prods = prods.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    // Sort
    switch (sortBy) {
      case 'price-low': prods.sort((a, b) => a.price - b.price); break;
      case 'price-high': prods.sort((a, b) => b.price - a.price); break;
      case 'rating': prods.sort((a, b) => b.rating - a.rating); break;
      case 'newest': prods.sort((a, b) => b.id - a.id); break;
      case 'discount': prods.sort((a, b) => b.discount - a.discount); break;
      default: prods.sort((a, b) => b.reviews - a.reviews);
    }
    return prods;
  },

  // Cart operations
  addToCart(productId, qty = 1, options = {}) {
    const product = this.getProduct(productId);
    if (!product) return;
    const key = `${productId}_${JSON.stringify(options)}`;
    const existing = this.cart.find(i => i.key === key);
    if (existing) {
      existing.qty += qty;
    } else {
      this.cart.push({ key, productId, qty, options, price: product.price });
    }
    this.saveCart();
    this.updateCartBadge();
    this.toast('success', '🛒 تمت الإضافة للسلة', product.name);
  },

  removeFromCart(key) {
    this.cart = this.cart.filter(i => i.key !== key);
    this.saveCart();
    this.updateCartBadge();
    this.renderCartItems();
  },

  updateCartQty(key, qty) {
    const item = this.cart.find(i => i.key === key);
    if (item) {
      if (qty <= 0) { this.removeFromCart(key); return; }
      item.qty = qty;
      this.saveCart();
      this.renderCartItems();
    }
  },

  getCartTotal() {
    return this.cart.reduce((sum, item) => {
      const p = this.getProduct(item.productId);
      return sum + (p ? p.price * item.qty : 0);
    }, 0);
  },

  getCartCount() {
    return this.cart.reduce((s, i) => s + i.qty, 0);
  },

  // Wishlist
  toggleWishlist(productId) {
    const idx = this.wishlist.indexOf(productId);
    if (idx > -1) {
      this.wishlist.splice(idx, 1);
      this.toast('info', '💔 تمت الإزالة من المفضلة');
    } else {
      this.wishlist.push(productId);
      this.toast('success', '❤️ تمت الإضافة للمفضلة');
    }
    this.saveWishlist();
    this.updateWishlistBadge();
    return idx === -1;
  },

  isWishlisted(productId) {
    return this.wishlist.includes(productId);
  },

  // Compare
  toggleCompare(productId) {
    const idx = this.compare.indexOf(productId);
    if (idx > -1) {
      this.compare.splice(idx, 1);
    } else {
      if (this.compare.length >= 3) {
        this.toast('warning', '⚠️ يمكن مقارنة 3 منتجات كحد أقصى');
        return;
      }
      this.compare.push(productId);
    }
    this.saveCompare();
    this.renderCompareBar();
  },

  // Recently viewed
  addToRecent(productId) {
    this.recentlyViewed = [productId, ...this.recentlyViewed.filter(id => id !== productId)].slice(0, 10);
    this.saveRecent();
  },

  // Badges
  updateCartBadge() {
    const count = this.getCartCount();
    document.querySelectorAll('.cart-badge').forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });
  },

  updateWishlistBadge() {
    const count = this.wishlist.length;
    document.querySelectorAll('.wishlist-badge').forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });
  },

  // Toast
  toast(type = 'info', title = '', message = '') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    el.innerHTML = `
      <span style="font-size:18px">${icons[type]}</span>
      <div>
        <div style="font-weight:700;font-size:0.88rem">${title}</div>
        ${message ? `<div style="font-size:0.78rem;color:var(--text-muted);margin-top:2px">${message}</div>` : ''}
      </div>
      <button onclick="this.parentElement.remove()" style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:16px;margin-right:auto">×</button>
    `;
    container.appendChild(el);
    setTimeout(() => {
      el.classList.add('removing');
      setTimeout(() => el.remove(), 300);
    }, 3500);
  },

  // Welcome toast
  showWelcomeToast() {
    setTimeout(() => {
      this.toast('info', '🎉 مرحباً بك في كيان ستور', 'استمتع بتجربة تسوق استثنائية!');
    }, 1000);
  },

  // Countdown for flash deals
  startCountdown() {
    const end = new Date();
    end.setHours(end.getHours() + 7, 30, 0, 0);
    const update = () => {
      const now = new Date();
      const diff = Math.max(0, end - now);
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      document.querySelectorAll('.cd-hours').forEach(el => el.textContent = String(h).padStart(2,'0'));
      document.querySelectorAll('.cd-minutes').forEach(el => el.textContent = String(m).padStart(2,'0'));
      document.querySelectorAll('.cd-seconds').forEach(el => el.textContent = String(s).padStart(2,'0'));
    };
    update();
    setInterval(update, 1000);
  },

  // Scroll animations
  initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
  },

  // Router (hash-based)
  initRouter() {
    window.addEventListener('hashchange', () => this.handleRoute());
    this.handleRoute();
  },

  handleRoute() {
    const hash = window.location.hash.slice(1) || 'home';
    const [page, param] = hash.split('/');
    this.currentPage = page;
    if (page === 'product' && param) {
      this.currentProduct = parseInt(param);
    }
    if (page === 'category' && param) {
      this.currentCategory = param;
    }
    this.renderPage();
    document.querySelector('.main-content')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  },

  navigate(page, param = '') {
    const hash = param ? `#${page}/${param}` : `#${page}`;
    window.location.hash = hash;
  },

  // Search autocomplete
  initSearchAutocomplete() {
    const input = document.getElementById('searchInput');
    const suggestions = document.getElementById('searchSuggestions');
    if (!input || !suggestions) return;

    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      if (!q || !this.data) { suggestions.classList.remove('show'); return; }
      const results = this.data.products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      ).slice(0, 6);
      if (!results.length) { suggestions.classList.remove('show'); return; }
      suggestions.innerHTML = results.map(p => `
        <div class="suggestion-item" onclick="KayanStore.navigate('product', ${p.id}); document.getElementById('searchSuggestions').classList.remove('show')">
          <img src="${p.image}" alt="${p.name}" class="suggestion-img" onerror="this.src='https://via.placeholder.com/44x44/1a1a2e/FF6B2B?text=K'">
          <div class="suggestion-info">
            <div class="suggestion-name">${p.name}</div>
            <div class="suggestion-price">${KayanStore.formatPrice(p.price)}</div>
          </div>
        </div>
      `).join('');
      suggestions.classList.add('show');
    });

    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        suggestions.classList.remove('show');
        KayanStore.searchQuery = input.value.trim();
        KayanStore.navigate('search');
      }
    });

    document.addEventListener('click', e => {
      if (!input.contains(e.target) && !suggestions.contains(e.target)) {
        suggestions.classList.remove('show');
      }
    });
  },

  // Render the current page
  renderPage() {
    const main = document.getElementById('mainContent');
    if (!main || !this.data) return;

    // Update active nav
    document.querySelectorAll('[data-page]').forEach(el => {
      el.classList.toggle('active', el.dataset.page === this.currentPage);
    });

    switch (this.currentPage) {
      case 'home':     main.innerHTML = this.renderHome(); break;
      case 'shop':     main.innerHTML = this.renderShop(); break;
      case 'product':  main.innerHTML = this.renderProductDetail(); break;
      case 'cart':     main.innerHTML = this.renderCartPage(); break;
      case 'checkout': main.innerHTML = this.renderCheckout(); break;
      case 'wishlist': main.innerHTML = this.renderWishlistPage(); break;
      case 'profile':  main.innerHTML = this.renderProfilePage(); break;
      case 'orders':   main.innerHTML = this.renderOrdersPage(); break;
      case 'category': main.innerHTML = this.renderShop(); break;
      case 'success':  main.innerHTML = this.renderSuccessPage(); break;
      case 'compare':  main.innerHTML = this.renderComparePage(); break;
      case 'offers':   main.innerHTML = this.renderOffersPage(); break;
      case 'about':    main.innerHTML = this.renderAboutPage(); break;
      case 'contact':  main.innerHTML = this.renderContactPage(); break;
      case 'track':    main.innerHTML = this.renderTrackPage(); break;
      case 'faq':      main.innerHTML = this.renderFaqPage(); break;
      case 'search':   main.innerHTML = this.renderSearchPage(); break;
      case 'settings': main.innerHTML = this.renderSettingsPage(); break;
      default:         main.innerHTML = this.renderHome();
    }

    // Re-attach events
    this.attachPageEvents();
    this.initScrollAnimations();
  },

  // Attach events after render
  attachPageEvents() {
    // Product cards add to cart
    document.querySelectorAll('[data-add-cart]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const id = parseInt(btn.dataset.addCart);
        this.addToCart(id);
        btn.textContent = '✓ تمت الإضافة';
        btn.style.background = 'var(--success)';
        btn.style.color = 'white';
        setTimeout(() => {
          btn.textContent = '🛒 أضف للسلة';
          btn.style.background = '';
          btn.style.color = '';
        }, 2000);
      });
    });

    // Wishlist buttons
    document.querySelectorAll('[data-wishlist]').forEach(btn => {
      const id = parseInt(btn.dataset.wishlist);
      if (this.isWishlisted(id)) btn.classList.add('active');
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const added = this.toggleWishlist(id);
        btn.classList.toggle('active', added);
        document.querySelectorAll(`[data-wishlist="${id}"]`).forEach(b => b.classList.toggle('active', added));
      });
    });

    // Product card click -> navigate
    document.querySelectorAll('[data-product-id]').forEach(card => {
      card.addEventListener('click', () => {
        this.navigate('product', card.dataset.productId);
      });
    });

    // Category nav
    document.querySelectorAll('[data-category]').forEach(el => {
      el.addEventListener('click', () => {
        this.currentCategory = el.dataset.category;
        document.querySelectorAll('[data-category]').forEach(e => e.classList.remove('active'));
        el.classList.add('active');
        this.navigate('shop');
      });
    });

    // Sort/View
    const sortSel = document.getElementById('sortSelect');
    if (sortSel) {
      sortSel.value = this.sortBy;
      sortSel.addEventListener('change', () => {
        this.sortBy = sortSel.value;
        document.getElementById('productsContainer').innerHTML = this.renderProductsGrid();
        this.attachPageEvents();
        this.initScrollAnimations();
      });
    }

    const gridViewBtn = document.getElementById('gridViewBtn');
    const listViewBtn = document.getElementById('listViewBtn');
    if (gridViewBtn) gridViewBtn.addEventListener('click', () => { this.viewMode = 'grid'; this.navigate('shop'); });
    if (listViewBtn) listViewBtn.addEventListener('click', () => { this.viewMode = 'list'; this.navigate('shop'); });

    // Tab switching
    document.querySelectorAll('[data-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        document.querySelectorAll('[data-tab]').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('[data-tab-content]').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        const content = document.querySelector(`[data-tab-content="${target}"]`);
        if (content) content.classList.add('active');
      });
    });

    // Checkout steps
    document.querySelectorAll('[data-step]').forEach(btn => {
      btn.addEventListener('click', () => {
        const step = btn.dataset.step;
        this.goToCheckoutStep(step);
      });
    });

    // Payment options
    document.querySelectorAll('.payment-option').forEach(opt => {
      opt.addEventListener('click', () => {
        document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
      });
    });

    // Filter options
    document.querySelectorAll('.filter-option').forEach(opt => {
      opt.addEventListener('click', () => {
        opt.classList.toggle('active');
        const check = opt.querySelector('.filter-check');
        if (check) check.innerHTML = opt.classList.contains('active') ? '✓' : '';
      });
    });

    // Gallery thumbnails
    document.querySelectorAll('.gallery-thumb').forEach((thumb, idx) => {
      thumb.addEventListener('click', () => {
        document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        const mainImg = document.querySelector('.gallery-main img');
        if (mainImg) mainImg.src = thumb.querySelector('img').src.replace('w=100', 'w=600');
      });
    });

    // Color options
    document.querySelectorAll('.color-option').forEach(opt => {
      opt.addEventListener('click', () => {
        document.querySelectorAll('.color-option').forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
      });
    });

    // Size/options buttons
    document.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const group = btn.closest('.option-btns');
        group?.querySelectorAll('.option-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Qty selector
    document.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const wrap = btn.closest('.qty-selector');
        const num = wrap?.querySelector('.qty-num');
        if (!num) return;
        let val = parseInt(num.value || num.textContent) || 1;
        if (btn.dataset.action === 'plus') val++;
        if (btn.dataset.action === 'minus') val = Math.max(1, val - 1);
        if (num.tagName === 'INPUT') num.value = val;
        else num.textContent = val;
      });
    });

    // Hero slider
    const heroSlider = document.querySelector('.hero-slider');
    if (heroSlider) this.initHeroSlider();

    // Announcement close
    const closeAnn = document.querySelector('.close-ann');
    if (closeAnn) closeAnn.addEventListener('click', () => {
      document.querySelector('.announcement-bar')?.remove();
    });

    // Profile nav
    document.querySelectorAll('.profile-nav-item').forEach(item => {
      item.addEventListener('click', () => {
        document.querySelectorAll('.profile-nav-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        const section = item.dataset.section;
        document.querySelectorAll('.profile-section').forEach(s => s.classList.add('hidden'));
        const target = document.getElementById(`section-${section}`);
        if (target) target.classList.remove('hidden');
      });
    });

    // Newsletter form
    const nlForm = document.getElementById('newsletterForm');
    if (nlForm) {
      nlForm.addEventListener('submit', e => {
        e.preventDefault();
        this.toast('success', '🎉 تم الاشتراك بنجاح!', 'ستصلك أحدث العروض والأخبار');
        nlForm.reset();
      });
    }

    // Coupon
    const applyCoupon = document.getElementById('applyCoupon');
    if (applyCoupon) {
      applyCoupon.addEventListener('click', () => {
        const inp = document.getElementById('couponInput');
        if (!inp) return;
        const code = inp.value.trim().toUpperCase();
        if (code === 'KAYAN10') {
          this.toast('success', '🎟️ تم تطبيق الكوبون!', 'خصم 10% على إجمالي الطلب');
        } else if (code === 'WELCOME20') {
          this.toast('success', '🎟️ تم تطبيق الكوبون!', 'خصم 20% للعملاء الجدد');
        } else {
          this.toast('error', '❌ كوبون غير صالح');
        }
      });
    }

    // Place order
    const placeOrder = document.getElementById('placeOrderBtn');
    if (placeOrder) {
      placeOrder.addEventListener('click', () => {
        this.cart = [];
        this.saveCart();
        this.updateCartBadge();
        this.navigate('success');
      });
    }

    // Search mobile
    const mobileSearchBtn = document.getElementById('mobileSearchBtn');
    if (mobileSearchBtn) {
      mobileSearchBtn.addEventListener('click', () => {
        const sc = document.querySelector('.search-container');
        if (sc) { sc.style.display = sc.style.display === 'block' ? 'none' : 'block'; }
      });
    }
  },

  // Hero Slider
  initHeroSlider() {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    if (!slides.length) return;

    const goTo = (idx) => {
      slides.forEach(s => s.classList.remove('active'));
      dots.forEach(d => d.classList.remove('active'));
      currentSlide = (idx + slides.length) % slides.length;
      slides[currentSlide]?.classList.add('active');
      dots[currentSlide]?.classList.add('active');
    };

    document.querySelector('.hero-prev')?.addEventListener('click', () => goTo(currentSlide - 1));
    document.querySelector('.hero-next')?.addEventListener('click', () => goTo(currentSlide + 1));
    dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

    let autoSlide = setInterval(() => goTo(currentSlide + 1), 5000);
    document.querySelector('.hero-slider')?.addEventListener('mouseenter', () => clearInterval(autoSlide));
    document.querySelector('.hero-slider')?.addEventListener('mouseleave', () => {
      autoSlide = setInterval(() => goTo(currentSlide + 1), 5000);
    });

    // Touch/swipe
    let touchStart = 0;
    document.querySelector('.hero-slider')?.addEventListener('touchstart', e => touchStart = e.changedTouches[0].clientX);
    document.querySelector('.hero-slider')?.addEventListener('touchend', e => {
      const diff = touchStart - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) goTo(diff > 0 ? currentSlide + 1 : currentSlide - 1);
    });
  },

  // Compare bar
  renderCompareBar() {
    const bar = document.getElementById('compareBar');
    if (!bar) return;
    if (this.compare.length === 0) { bar.classList.remove('show'); return; }
    bar.classList.add('show');
    const itemsEl = document.getElementById('compareItems');
    if (!itemsEl) return;
    const slots = [0, 1, 2].map(i => {
      const pid = this.compare[i];
      if (!pid) return `<div class="compare-item-slot"><span>+</span></div>`;
      const p = this.getProduct(pid);
      return `
        <div class="compare-item-slot">
          <img src="${p.image}" alt="${p.name}">
          <button onclick="KayanStore.toggleCompare(${pid})" style="position:absolute;top:-6px;right:-6px;width:18px;height:18px;background:var(--error);border:none;border-radius:50%;color:white;cursor:pointer;font-size:11px">×</button>
        </div>
      `;
    });
    itemsEl.innerHTML = slots.join('');
  },

  // Cart sidebar
  renderCartItems() {
    const el = document.getElementById('cartItemsList');
    if (!el) return;
    if (!this.cart.length) {
      el.innerHTML = `<div class="empty-state"><div class="empty-icon">🛒</div><p class="empty-title">السلة فارغة</p><p class="empty-desc">أضف منتجات للبدء بالتسوق</p></div>`;
      return;
    }
    el.innerHTML = this.cart.map(item => {
      const p = this.getProduct(item.productId);
      if (!p) return '';
      return `
        <div class="cart-item">
          <img src="${p.image}" alt="${p.name}" class="cart-item-img" onerror="this.src='https://via.placeholder.com/70x70/1a1a2e/FF6B2B?text=K'">
          <div class="cart-item-info">
            <div class="cart-item-name">${p.name}</div>
            <div class="cart-item-price">${this.formatPrice(p.price)}</div>
            <div class="cart-item-qty">
              <div class="qty-btn" onclick="KayanStore.updateCartQty('${item.key}', ${item.qty - 1})">−</div>
              <span class="qty-num">${item.qty}</span>
              <div class="qty-btn" onclick="KayanStore.updateCartQty('${item.key}', ${item.qty + 1})">+</div>
            </div>
          </div>
          <span class="cart-item-remove" onclick="KayanStore.removeFromCart('${item.key}')">🗑️</span>
        </div>
      `;
    }).join('');

    // Update totals
    const subtotal = this.getCartTotal();
    const shipping = subtotal > 50000 ? 0 : 3000;
    const total = subtotal + shipping;
    document.getElementById('cartSubtotal')?.let?.(el => el.textContent = this.formatPrice(subtotal));
    document.getElementById('cartShipping')?.let?.(el => el.textContent = shipping === 0 ? 'مجاني' : this.formatPrice(shipping));
    document.getElementById('cartTotal')?.let?.(el => el.textContent = this.formatPrice(total));
  },

  goToCheckoutStep(step) {
    document.querySelectorAll('.checkout-step').forEach(s => s.classList.remove('active'));
    const target = document.querySelector(`[data-step="${step}"]`);
    if (target) target.classList.add('active');
    document.querySelectorAll('[data-step-content]').forEach(c => c.classList.add('hidden'));
    const content = document.querySelector(`[data-step-content="${step}"]`);
    if (content) content.classList.remove('hidden');
  }
};

// Polyfill for Element.prototype.let
Element.prototype.let = function(fn) { fn(this); return this; };
