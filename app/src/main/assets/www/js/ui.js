/* ===== KAYAN STORE - UI JS ===== */

// ===== INIT UI =====
KayanStore.initUI = function() {
  this.renderHeader();
  this.renderCartSidebar();
  this.renderMobileSidebar();
  this.renderToastContainer();
  this.renderCompareBarEl();
  this.renderFooter();
  this.initHeaderScroll();
  this.initKeyboardShortcuts();
  this.initLazyLoad();
};

// ===== RENDER HEADER =====
KayanStore.renderHeader = function() {
  const cats = this.data?.categories || [];
  const header = document.getElementById('appHeader');
  if (!header) return;

  header.innerHTML = `
    <!-- Announcement Bar -->
    <div class="announcement-bar" id="announcementBar">
      <div class="ann-ticker">
        🎉 مرحباً بك في كيان ستور | شحن مجاني للطلبات فوق 50,000 ريال | استخدم كوبون KAYAN10 للحصول على خصم 10%
      </div>
      <button class="close-ann" title="إغلاق">×</button>
    </div>

    <!-- Main Header -->
    <div class="header">
      <div class="header-inner">
        <!-- Mobile Menu Btn -->
        <button class="mobile-menu-btn" id="mobileMenuBtn">☰</button>

        <!-- Logo -->
        <a href="#home" class="logo">
          <div class="logo-icon">🛍️</div>
          <div class="logo-text">
            <span class="logo-name">كيان ستور</span>
            <span class="logo-tagline">تسوق بذكاء • تسوق بكيان</span>
          </div>
        </a>

        <!-- Search -->
        <div class="search-container">
          <div class="search-box">
            <div class="search-category" id="searchCatBtn">
              الكل <span>▾</span>
            </div>
            <input
              type="text"
              class="search-input"
              id="searchInput"
              placeholder="ابحث عن منتجات، ماركات، فئات..."
              autocomplete="off"
            >
            <button class="search-btn" id="searchSubmitBtn">🔍</button>
          </div>
          <div class="search-suggestions" id="searchSuggestions"></div>
        </div>

        <!-- Header Actions -->
        <div class="header-actions">
          <!-- Mobile search -->
          <button class="header-action-btn" id="mobileSearchBtn" title="بحث" style="display:none">🔍</button>

          <!-- Notifications -->
          <button class="header-action-btn" title="الإشعارات" onclick="KayanStore.toast('info','🔔 الإشعارات','لا توجد إشعارات جديدة')">
            🔔
            <span class="badge-count" style="display:none">3</span>
          </button>

          <!-- Wishlist -->
          <a href="#wishlist" class="header-action-btn" title="المفضلة">
            ❤️
            <span class="badge-count wishlist-badge" style="display:none">0</span>
          </a>

          <!-- Cart -->
          <button class="header-action-btn" id="cartToggleBtn" title="السلة">
            🛒
            <span class="badge-count cart-badge" style="display:none">0</span>
          </button>

          <!-- User Menu -->
          <div class="user-menu-wrap">
            <div class="user-btn" id="userMenuBtn">
              <div class="user-avatar">${this.user?.name?.[0] || '👤'}</div>
              <span class="user-name">${this.user?.name || 'تسجيل الدخول'}</span>
              <span>▾</span>
            </div>
            <div class="user-dropdown" id="userDropdown">
              <div style="padding:12px 12px 8px;border-bottom:1px solid var(--border);margin-bottom:4px">
                <div style="font-weight:800;font-size:0.9rem">${this.user?.name || 'مستخدم كيان'}</div>
                <div style="font-size:0.75rem;color:var(--text-muted)">${this.user?.email || 'user@kayanstore.ye'}</div>
              </div>
              <div class="dropdown-item" onclick="KayanStore.navigate('profile')"><span>👤</span> حسابي</div>
              <div class="dropdown-item" onclick="KayanStore.navigate('orders')"><span>📦</span> طلباتي</div>
              <div class="dropdown-item" onclick="KayanStore.navigate('wishlist')"><span>❤️</span> المفضلة</div>
              <div class="dropdown-item" onclick="KayanStore.navigate('cart')"><span>🛒</span> السلة</div>
              <div class="dropdown-divider"></div>
              <div class="dropdown-item" onclick="KayanStore.toast('info','⚙️','الإعدادات قيد التطوير')"><span>⚙️</span> الإعدادات</div>
              <div class="dropdown-item danger" onclick="KayanStore.toast('info','👋','تم تسجيل الخروج')"><span>🚪</span> تسجيل الخروج</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Category Nav -->
    <nav class="category-nav">
      <div class="category-nav-inner">
        ${cats.map(c => `
          <div class="cat-nav-item" data-category="${c.id}" data-page="shop">
            <span class="cat-icon">${c.icon}</span>
            ${c.name}
          </div>
        `).join('')}
        <div class="cat-nav-item" style="color:var(--error);font-weight:800" onclick="KayanStore.navigate('offers')">🔥 العروض</div>
        <div class="cat-nav-item" onclick="KayanStore.navigate('track')">📍 تتبع الطلب</div>
        <div class="cat-nav-item" onclick="KayanStore.navigate('about')">🏢 من نحن</div>
        <div class="cat-nav-item" onclick="KayanStore.navigate('contact')">📞 تواصل معنا</div>
      </div>
    </nav>
  `;

  // Attach header events
  this.attachHeaderEvents();
};

// ===== ATTACH HEADER EVENTS =====
KayanStore.attachHeaderEvents = function() {
  // Mobile menu
  document.getElementById('mobileMenuBtn')?.addEventListener('click', () => {
    document.getElementById('mobileSidebar')?.classList.toggle('open');
    document.getElementById('mobileOverlay')?.classList.toggle('show');
  });

  // Cart toggle
  document.getElementById('cartToggleBtn')?.addEventListener('click', () => {
    this.openCart();
  });

  // User menu
  document.getElementById('userMenuBtn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    const dd = document.getElementById('userDropdown');
    dd?.classList.toggle('show');
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.user-menu-wrap')) {
      document.getElementById('userDropdown')?.classList.remove('show');
    }
    if (!e.target.closest('.search-container')) {
      document.getElementById('searchSuggestions')?.classList.remove('show');
    }
  });

  // Search submit
  document.getElementById('searchSubmitBtn')?.addEventListener('click', () => {
    const val = document.getElementById('searchInput')?.value?.trim();
    if (val) {
      KayanStore.searchQuery = val;
      KayanStore.navigate('search');
      document.getElementById('searchSuggestions')?.classList.remove('show');
    }
  });

  // Mobile search toggle
  document.getElementById('mobileSearchBtn')?.addEventListener('click', () => {
    const sc = document.querySelector('.search-container');
    if (sc) {
      if (sc.style.display === 'block') {
        sc.style.display = '';
      } else {
        sc.style.display = 'block';
        sc.style.position = 'fixed';
        sc.style.top = '70px';
        sc.style.left = '0';
        sc.style.right = '0';
        sc.style.zIndex = '250';
        sc.style.padding = '10px 16px';
        sc.style.background = 'var(--bg-secondary)';
        sc.style.borderBottom = '1px solid var(--border)';
        document.getElementById('searchInput')?.focus();
      }
    }
  });

  // Announcement close
  document.querySelector('.close-ann')?.addEventListener('click', () => {
    document.getElementById('announcementBar')?.remove();
  });

  // Category nav
  document.querySelectorAll('.cat-nav-item[data-category]').forEach(item => {
    item.addEventListener('click', () => {
      KayanStore.currentCategory = item.dataset.category;
      document.querySelectorAll('.cat-nav-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      KayanStore.navigate('shop');
    });
  });

  // Init search autocomplete
  this.initSearchAutocomplete();
};

// ===== CART SIDEBAR =====
KayanStore.renderCartSidebar = function() {
  const existing = document.getElementById('cartSidebar');
  if (existing) existing.remove();

  const sidebar = document.createElement('div');
  sidebar.className = 'cart-sidebar';
  sidebar.id = 'cartSidebar';
  sidebar.innerHTML = `
    <div class="cart-header">
      <h3>🛒 سلة التسوق</h3>
      <div style="display:flex;align-items:center;gap:8px">
        <span class="badge badge-primary cart-badge">0</span>
        <button class="btn btn-ghost btn-sm btn-icon" id="closeCartBtn" title="إغلاق">×</button>
      </div>
    </div>
    <div class="cart-items" id="cartItemsList">
      <div class="empty-state">
        <div class="empty-icon">🛒</div>
        <p class="empty-title">السلة فارغة</p>
        <p class="empty-desc">أضف منتجات للبدء</p>
      </div>
    </div>
    <div class="cart-footer">
      <div class="cart-coupon">
        <input class="input" id="couponInput" placeholder="كود الخصم">
        <button class="btn btn-outline btn-sm" id="applyCoupon">تطبيق</button>
      </div>
      <div class="cart-summary">
        <div class="cart-summary-row">
          <span>المجموع الفرعي</span>
          <span id="cartSubtotal">0 ريال</span>
        </div>
        <div class="cart-summary-row">
          <span>الشحن</span>
          <span id="cartShipping">3,000 ريال</span>
        </div>
      </div>
      <div class="cart-total">
        <span>الإجمالي</span>
        <span id="cartTotal">0 ريال</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;margin-top:16px">
        <button class="btn btn-primary btn-lg w-full" onclick="KayanStore.closeCart();KayanStore.navigate('checkout')">
          ⚡ إتمام الشراء
        </button>
        <button class="btn btn-secondary w-full" onclick="KayanStore.closeCart();KayanStore.navigate('cart')">
          👀 عرض السلة الكاملة
        </button>
      </div>
    </div>
  `;

  const overlay = document.createElement('div');
  overlay.className = 'cart-overlay';
  overlay.id = 'cartOverlay';
  overlay.addEventListener('click', () => this.closeCart());

  document.body.appendChild(overlay);
  document.body.appendChild(sidebar);

  document.getElementById('closeCartBtn')?.addEventListener('click', () => this.closeCart());

  // Coupon in sidebar
  document.getElementById('applyCoupon')?.addEventListener('click', () => {
    const inp = document.getElementById('couponInput');
    const code = inp?.value?.trim()?.toUpperCase();
    if (code === 'KAYAN10') {
      this.toast('success', '🎟️ كوبون مقبول!', 'خصم 10% على الإجمالي');
    } else if (code === 'WELCOME20') {
      this.toast('success', '🎟️ كوبون مقبول!', 'خصم 20% للعملاء الجدد');
    } else {
      this.toast('error', '❌ كوبون غير صالح');
    }
  });
};

KayanStore.openCart = function() {
  this.renderCartItems();
  document.getElementById('cartSidebar')?.classList.add('open');
  document.getElementById('cartOverlay')?.classList.add('show');
  document.body.style.overflow = 'hidden';
};

KayanStore.closeCart = function() {
  document.getElementById('cartSidebar')?.classList.remove('open');
  document.getElementById('cartOverlay')?.classList.remove('show');
  document.body.style.overflow = '';
};

// ===== MOBILE SIDEBAR =====
KayanStore.renderMobileSidebar = function() {
  const existing = document.getElementById('mobileSidebar');
  if (existing) existing.remove();

  const sidebar = document.createElement('div');
  sidebar.className = 'mobile-sidebar';
  sidebar.id = 'mobileSidebar';
  sidebar.innerHTML = `
    <div style="padding:16px 16px 8px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between">
      <div class="logo" onclick="KayanStore.closeMobileMenu();KayanStore.navigate('home')" style="cursor:pointer">
        <div class="logo-icon">🛍️</div>
        <div class="logo-text">
          <span class="logo-name">كيان ستور</span>
        </div>
      </div>
      <button class="btn btn-ghost btn-sm btn-icon" onclick="KayanStore.closeMobileMenu()">×</button>
    </div>

    <!-- User info -->
    <div style="padding:16px;background:rgba(255,107,43,0.05);border-bottom:1px solid var(--border)">
      <div style="display:flex;align-items:center;gap:12px">
        <div class="user-avatar" style="width:44px;height:44px;font-size:18px">${this.user?.name?.[0] || '👤'}</div>
        <div>
          <div style="font-weight:800;font-size:0.9rem">${this.user?.name || 'مستخدم كيان'}</div>
          <div style="font-size:0.75rem;color:var(--text-muted)">${this.user?.email || 'اضغط لتسجيل الدخول'}</div>
        </div>
      </div>
    </div>

    <nav class="mobile-nav">
      <div style="font-size:0.75rem;font-weight:800;color:var(--text-muted);padding:8px 12px;text-transform:uppercase;letter-spacing:1px">الفئات الرئيسية</div>
      ${(this.data?.categories || []).map(c => `
        <div class="mobile-nav-item" onclick="KayanStore.currentCategory='${c.id}';KayanStore.closeMobileMenu();KayanStore.navigate('shop')">
          <span style="font-size:20px">${c.icon}</span>
          ${c.name}
        </div>
      `).join('')}

      <div style="height:1px;background:var(--border);margin:12px 0"></div>
      <div style="font-size:0.75rem;font-weight:800;color:var(--text-muted);padding:8px 12px;text-transform:uppercase;letter-spacing:1px">حسابي</div>
      ${[
        ['👤','الملف الشخصي','profile'],
        ['📦','طلباتي','orders'],
        ['❤️','المفضلة','wishlist'],
        ['🛒','السلة','cart'],
        ['🏷️','العروض','offers'],
        ['⚖️','المقارنة','compare'],
        ['📍','تتبع الطلب','track'],
        ['❓','الأسئلة الشائعة','faq'],
        ['🏢','من نحن','about'],
        ['📞','تواصل معنا','contact'],
        ['⚙️','الإعدادات','settings']
      ].map(([icon, label, page]) => `
        <div class="mobile-nav-item" onclick="KayanStore.closeMobileMenu();KayanStore.navigate('${page}')">
          <span style="font-size:20px">${icon}</span>
          ${label}
        </div>
      `).join('')}

      <div style="height:1px;background:var(--border);margin:12px 0"></div>
      <div style="padding:12px">
        <div style="background:linear-gradient(135deg,rgba(255,107,43,0.1),rgba(233,69,96,0.1));border:1px solid rgba(255,107,43,0.2);border-radius:var(--radius-md);padding:16px;text-align:center">
          <div style="font-size:0.85rem;font-weight:700;margin-bottom:8px">📞 تواصل معنا</div>
          <div style="font-size:0.8rem;color:var(--text-muted)">واتساب: +967783265552</div>
          <div style="font-size:0.8rem;color:var(--text-muted)">البريد: aliqateebah@gmail.com</div>
        </div>
      </div>
    </nav>
  `;

  const overlay = document.createElement('div');
  overlay.id = 'mobileOverlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);backdrop-filter:blur(4px);z-index:199;opacity:0;pointer-events:none;transition:opacity 0.3s';
  overlay.addEventListener('click', () => this.closeMobileMenu());

  document.body.appendChild(overlay);
  document.body.appendChild(sidebar);
};

KayanStore.closeMobileMenu = function() {
  document.getElementById('mobileSidebar')?.classList.remove('open');
  const overlay = document.getElementById('mobileOverlay');
  if (overlay) { overlay.style.opacity = '0'; overlay.style.pointerEvents = 'none'; }
};

// Fix mobile overlay show
const origOpen = KayanStore.openCart;
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('mobileMenuBtn')?.addEventListener('click', () => {
    const overlay = document.getElementById('mobileOverlay');
    if (overlay) { overlay.style.opacity = '1'; overlay.style.pointerEvents = 'all'; }
  });
});

// ===== TOAST CONTAINER =====
KayanStore.renderToastContainer = function() {
  if (document.getElementById('toast-container')) return;
  const el = document.createElement('div');
  el.id = 'toast-container';
  document.body.appendChild(el);
};

// ===== COMPARE BAR =====
KayanStore.renderCompareBarEl = function() {
  if (document.getElementById('compareBar')) return;
  const el = document.createElement('div');
  el.className = 'compare-bar';
  el.id = 'compareBar';
  el.innerHTML = `
    <div style="font-weight:800;font-size:0.88rem;white-space:nowrap">⚖️ المقارنة</div>
    <div class="compare-items" id="compareItems"></div>
    <div style="display:flex;gap:8px;flex-shrink:0">
      <button class="btn btn-primary btn-sm" onclick="KayanStore.toast('info','⚖️','صفحة المقارنة قيد التطوير')">مقارنة الآن</button>
      <button class="btn btn-ghost btn-sm" onclick="KayanStore.compare=[];KayanStore.saveCompare();KayanStore.renderCompareBar()">مسح الكل</button>
    </div>
  `;
  document.body.appendChild(el);
};

// ===== FOOTER =====
KayanStore.renderFooter = function() {
  const footer = document.getElementById('appFooter');
  if (!footer) return;

  footer.innerHTML = `
    <div class="footer">
      <div class="footer-top">
        <div class="footer-brand">
          <div class="logo" style="margin-bottom:16px">
            <div class="logo-icon">🛍️</div>
            <div class="logo-text">
              <span class="logo-name">كيان ستور</span>
              <span class="logo-tagline">تسوق بذكاء • تسوق بكيان</span>
            </div>
          </div>
          <p class="footer-desc">
            كيان ستور - وجهتك الأولى للتسوق الإلكتروني في اليمن. نقدم أفضل المنتجات الأصيلة بأسعار منافسة مع خدمة توصيل سريعة وموثوقة.
          </p>
          <div class="footer-social">
            ${[['📘','Facebook'],['📸','Instagram'],['🐦','Twitter'],['▶️','YouTube'],['💬','WhatsApp']].map(([i,n]) =>
              `<div class="social-btn" title="${n}" onclick="KayanStore.toast('info','${i} ${n}','صفحتنا الرسمية')">${i}</div>`
            ).join('')}
          </div>
          <div style="margin-top:16px;padding:12px;background:rgba(255,107,43,0.05);border-radius:var(--radius-md);border:1px solid rgba(255,107,43,0.1)">
            <div style="font-size:0.78rem;color:var(--text-muted);margin-bottom:4px">📞 خدمة العملاء 24/7</div>
            <div style="font-weight:700;font-size:0.9rem;color:var(--primary)">+967 783 265 552</div>
            <div style="font-weight:700;font-size:0.9rem;color:var(--primary)">+967 783 265 553</div>
          </div>
        </div>

        <div>
          <div class="footer-col-title">روابط سريعة</div>
          <div class="footer-links">
            ${[
              ['🏠 الرئيسية','home'],
              ['🛍️ المتجر','shop'],
              ['🏷️ العروض','offers'],
              ['📦 طلباتي','orders'],
              ['❤️ المفضلة','wishlist'],
              ['⚖️ المقارنة','compare'],
              ['👤 حسابي','profile'],
              ['🛒 السلة','cart']
            ].map(([t,p]) => `<div class="footer-link" onclick="KayanStore.navigate('${p}')">${t}</div>`).join('')}
          </div>
        </div>

        <div>
          <div class="footer-col-title">الفئات</div>
          <div class="footer-links">
            ${(this.data?.categories?.slice(1,8) || []).map(c =>
              `<div class="footer-link" onclick="KayanStore.currentCategory='${c.id}';KayanStore.navigate('shop')">${c.icon} ${c.name}</div>`
            ).join('')}
          </div>
        </div>

        <div>
          <div class="footer-col-title">مركز المساعدة</div>
          <div class="footer-links">
            ${[
              ['❓ الأسئلة الشائعة','faq'],
              ['📍 تتبع الطلب','track'],
              ['↩️ سياسة الإرجاع','faq'],
              ['💳 طرق الدفع','faq'],
              ['🚚 الشحن والتوصيل','faq'],
              ['🏢 من نحن','about'],
              ['📞 اتصل بنا','contact'],
              ['⚙️ الإعدادات','settings']
            ].map(([t,p]) => `<div class="footer-link" onclick="KayanStore.navigate('${p}')">${t}</div>`).join('')}
          </div>
          <div style="margin-top:16px">
            <div class="footer-col-title" style="margin-bottom:8px">تطبيقاتنا</div>
            <div style="display:flex;flex-direction:column;gap:8px">
              <div class="btn btn-secondary btn-sm" onclick="KayanStore.toast('info','📱','التطبيق قيد التطوير')">📱 App Store</div>
              <div class="btn btn-secondary btn-sm" onclick="KayanStore.toast('info','🤖','التطبيق قيد التطوير')">🤖 Google Play</div>
            </div>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div>© 2026 كيان ستور. جميع الحقوق محفوظة | تطوير: <a href="mailto:aliqateebah@gmail.com" style="color:var(--primary)">علي قتيبة</a></div>
        <div class="payment-icons">
          <span style="color:var(--text-muted);font-size:0.8rem">طرق الدفع:</span>
          ${['كاش','تحويل بنكي','كريمي','سبأفون','هواش'].map(m =>
            `<span class="payment-icon">${m}</span>`
          ).join('')}
        </div>
      </div>
    </div>
  `;
};

// ===== HEADER SCROLL =====
KayanStore.initHeaderScroll = function() {
  let lastScroll = 0;
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    if (current > 80) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
    lastScroll = current;
  }, { passive: true });
};

// ===== KEYBOARD SHORTCUTS =====
KayanStore.initKeyboardShortcuts = function() {
  document.addEventListener('keydown', (e) => {
    // Escape
    if (e.key === 'Escape') {
      this.closeCart();
      this.closeMobileMenu();
      document.querySelectorAll('.modal-overlay').forEach(m => m.remove());
      document.getElementById('searchSuggestions')?.classList.remove('show');
    }
    // Ctrl+K or / = focus search
    if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName))) {
      e.preventDefault();
      document.getElementById('searchInput')?.focus();
    }
    // C = open cart
    if (e.key === 'c' && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) {
      this.openCart();
    }
  });
};

// ===== LAZY LOAD IMAGES =====
KayanStore.initLazyLoad = function() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const img = e.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      }
    });
  }, { rootMargin: '100px' });

  document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));
};

// ===== SCROLL TO TOP =====
KayanStore.renderScrollTop = function() {
  const btn = document.createElement('button');
  btn.id = 'scrollTopBtn';
  btn.innerHTML = '▲';
  btn.style.cssText = `
    position:fixed;bottom:24px;left:24px;
    width:44px;height:44px;border-radius:50%;
    background:var(--primary);border:none;color:white;
    font-size:18px;cursor:pointer;z-index:150;
    opacity:0;transition:opacity 0.3s,transform 0.3s;
    transform:translateY(10px);
    box-shadow:0 4px 12px rgba(255,107,43,0.4);
  `;
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.style.opacity = '1';
      btn.style.transform = 'translateY(0)';
    } else {
      btn.style.opacity = '0';
      btn.style.transform = 'translateY(10px)';
    }
  }, { passive: true });

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
};

// ===== QUICK VIEW MODAL =====
KayanStore.openQuickView = function(productId) {
  const product = this.getProduct(productId);
  if (!product) return;

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal" style="max-width:800px">
      <div class="modal-header">
        <h3 style="font-size:1rem">${product.name}</h3>
        <button class="btn btn-ghost btn-sm btn-icon" onclick="this.closest('.modal-overlay').remove()">×</button>
      </div>
      <div class="modal-body" style="display:grid;grid-template-columns:1fr 1fr;gap:24px">
        <div>
          <img src="${product.images[0]}" style="width:100%;border-radius:var(--radius-lg);aspect-ratio:1;object-fit:cover" onerror="this.src='https://via.placeholder.com/300x300/1a1a2e/FF6B2B?text=K'">
        </div>
        <div>
          <div style="color:var(--primary);font-weight:700;margin-bottom:8px">${product.brand}</div>
          <h3 style="font-size:1.1rem;margin-bottom:12px">${product.name}</h3>
          <div style="font-size:1.3rem;font-weight:900;color:var(--primary);margin-bottom:16px">${this.formatPrice(product.price)}</div>
          <p style="font-size:0.85rem;color:var(--text-secondary);line-height:1.7;margin-bottom:20px">${product.description}</p>
          <div style="display:flex;gap:10px;flex-direction:column">
            <button class="btn btn-primary w-full" data-add-cart="${product.id}">🛒 أضف للسلة</button>
            <button class="btn btn-outline w-full" onclick="this.closest('.modal-overlay').remove();KayanStore.navigate('product',${product.id})">👁️ عرض التفاصيل الكاملة</button>
          </div>
        </div>
      </div>
    </div>
  `;

  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
  this.attachPageEvents();
};

// ===== LOGIN MODAL =====
KayanStore.openLoginModal = function() {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal" style="max-width:440px">
      <div class="modal-header">
        <h3>تسجيل الدخول</h3>
        <button class="btn btn-ghost btn-sm btn-icon" onclick="this.closest('.modal-overlay').remove()">×</button>
      </div>
      <div class="modal-body">
        <div style="text-align:center;margin-bottom:24px">
          <div style="font-size:48px;margin-bottom:8px">🛍️</div>
          <div style="font-weight:800;font-size:1.1rem">مرحباً بك في كيان ستور</div>
          <div style="color:var(--text-muted);font-size:0.85rem">سجل الدخول للاستمتاع بجميع المميزات</div>
        </div>
        <div class="form-group" style="margin-bottom:14px">
          <label class="form-label">البريد الإلكتروني أو رقم الهاتف</label>
          <input class="input" id="loginEmail" placeholder="email@example.com" type="email" dir="ltr">
        </div>
        <div class="form-group" style="margin-bottom:20px">
          <label class="form-label" style="display:flex;justify-content:space-between">
            كلمة المرور
            <span style="color:var(--primary);cursor:pointer;font-weight:400" onclick="KayanStore.toast('info','🔑','ميزة نسيت كلمة المرور قيد التطوير')">نسيت كلمة المرور؟</span>
          </label>
          <input class="input" id="loginPwd" type="password" placeholder="••••••••">
        </div>
        <button class="btn btn-primary w-full btn-lg" onclick="
          const email = document.getElementById('loginEmail').value;
          const pwd = document.getElementById('loginPwd').value;
          if(email && pwd) {
            KayanStore.user = {name: 'مستخدم كيان', email: email};
            localStorage.setItem('kayan_user', JSON.stringify(KayanStore.user));
            this.closest('.modal-overlay').remove();
            KayanStore.toast('success','✅ تم تسجيل الدخول','مرحباً بك في كيان ستور!');
            KayanStore.renderHeader();
          } else {
            KayanStore.toast('error','❌ خطأ','يرجى ملء جميع الحقول');
          }
        ">تسجيل الدخول</button>
        <div class="divider-text" style="margin:16px 0">أو</div>
        <button class="btn btn-secondary w-full" onclick="KayanStore.toast('info','📱','تسجيل الدخول بواتساب قيد التطوير')">📱 تسجيل الدخول بواتساب</button>
        <div style="text-align:center;margin-top:16px;font-size:0.85rem;color:var(--text-muted)">
          ليس لديك حساب؟
          <span style="color:var(--primary);cursor:pointer;font-weight:700" onclick="KayanStore.toast('info','✨','ميزة إنشاء حساب قيد التطوير')">إنشاء حساب مجاني</span>
        </div>
      </div>
    </div>
  `;
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
};

// ===== PRODUCT SHARE =====
KayanStore.shareProduct = function(productId) {
  const product = this.getProduct(productId);
  if (!product) return;
  const text = `${product.name} - ${this.formatPrice(product.price)} | كيان ستور`;
  if (navigator.share) {
    navigator.share({ title: product.name, text, url: window.location.href })
      .catch(() => {});
  } else {
    navigator.clipboard.writeText(window.location.href)
      .then(() => this.toast('success', '📋 تم النسخ!', 'تم نسخ رابط المنتج'))
      .catch(() => this.toast('info', '📋', 'انسخ الرابط من شريط العنوان'));
  }
};

// ===== LOADING SCREEN =====
KayanStore.showLoader = function() {
  const loader = document.getElementById('appLoader');
  if (loader) loader.style.display = 'flex';
};

KayanStore.hideLoader = function() {
  const loader = document.getElementById('appLoader');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => loader.remove(), 500);
  }
};
