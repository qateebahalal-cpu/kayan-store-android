/* ===== ADDITIONAL PAGES RENDERERS ===== */

// ===== COMPARE PAGE =====
KayanStore.renderComparePage = function() {
  const prods = this.compare.map(id => this.getProduct(id)).filter(Boolean);
  if (prods.length < 2) return `
    <div class="page-hero fade-in">
      <span class="page-hero-icon">⚖️</span>
      <div><h1 class="page-hero-title">مقارنة المنتجات</h1></div>
    </div>
    <div class="empty-state">
      <div class="empty-icon">⚖️</div>
      <h3 class="empty-title">يلزم منتجان على الأقل للمقارنة</h3>
      <p class="empty-desc">اضغط على زر ⚖️ في أي منتج لإضافته للمقارنة</p>
      <button class="btn btn-primary btn-lg" onclick="KayanStore.navigate('shop')">🛍️ تصفح المنتجات</button>
    </div>
  `;

  const allSpecs = [...new Set(prods.flatMap(p => Object.keys(p.specs || {})))];
  const stars = (r) => Array.from({length:5},(_,i)=>`<span class="star${i<Math.floor(r)?' active':''}">★</span>`).join('');

  return `
    <div class="page-hero fade-in">
      <span class="page-hero-icon">⚖️</span>
      <div>
        <h1 class="page-hero-title">مقارنة المنتجات (${prods.length})</h1>
        <div class="page-hero-breadcrumb">
          <span onclick="KayanStore.navigate('home')" style="cursor:pointer;color:var(--primary)">الرئيسية</span>
          <span class="breadcrumb-sep">/</span><span>المقارنة</span>
        </div>
      </div>
    </div>
    <div style="overflow-x:auto">
      <table style="width:100%;border-collapse:collapse;min-width:600px">
        <!-- Images Row -->
        <tr>
          <td style="padding:16px;font-weight:800;color:var(--text-muted);width:180px;background:var(--bg-card);border:1px solid var(--border)">المنتج</td>
          ${prods.map(p=>`
            <td style="padding:16px;text-align:center;background:var(--bg-card);border:1px solid var(--border);vertical-align:top">
              <div style="position:relative;display:inline-block">
                <img src="${p.image}" style="width:120px;height:120px;object-fit:cover;border-radius:var(--radius-md);margin-bottom:12px" onerror="this.src='https://via.placeholder.com/120/1a1a2e/FF6B2B?text=K'">
                <button onclick="KayanStore.toggleCompare(${p.id});KayanStore.navigate('compare')" style="position:absolute;top:-8px;right:-8px;background:var(--error);border:none;border-radius:50%;width:22px;height:22px;color:white;cursor:pointer;font-size:12px">×</button>
              </div>
              <div style="font-weight:800;font-size:0.9rem;margin-bottom:4px">${p.name}</div>
              <div style="color:var(--primary);font-weight:900;font-size:1.1rem">${this.formatPrice(p.price)}</div>
            </td>
          `).join('')}
          ${prods.length < 3 ? `<td style="padding:16px;text-align:center;background:var(--bg-input);border:1px solid var(--border);cursor:pointer" onclick="KayanStore.navigate('shop')"><div style="font-size:40px;margin-bottom:8px;opacity:0.3">+</div><div style="color:var(--text-muted);font-size:0.85rem">إضافة منتج للمقارنة</div></td>` : ''}
        </tr>
        <!-- Rating Row -->
        <tr>
          <td style="padding:14px 16px;background:var(--bg-secondary);border:1px solid var(--border);font-weight:700;font-size:0.88rem;color:var(--text-secondary)">التقييم</td>
          ${prods.map(p=>`
            <td style="padding:14px 16px;text-align:center;background:var(--bg-secondary);border:1px solid var(--border)">
              <div class="stars" style="justify-content:center;margin-bottom:4px">${stars(p.rating)}</div>
              <div style="font-size:0.82rem;color:var(--text-muted)">${p.rating} (${p.reviews.toLocaleString('ar')})</div>
            </td>
          `).join('')}
          ${prods.length < 3 ? '<td style="border:1px solid var(--border);background:var(--bg-input)"></td>' : ''}
        </tr>
        <!-- Stock Row -->
        <tr>
          <td style="padding:14px 16px;background:var(--bg-card);border:1px solid var(--border);font-weight:700;font-size:0.88rem;color:var(--text-secondary)">التوفر</td>
          ${prods.map(p=>`
            <td style="padding:14px 16px;text-align:center;background:var(--bg-card);border:1px solid var(--border)">
              <span class="badge ${p.stock > 20 ? 'badge-success' : p.stock > 0 ? 'badge-warning' : 'badge-error'}">${p.stock > 20 ? '✅ متوفر' : p.stock > 0 ? '⚠️ كمية محدودة ('+p.stock+')' : '❌ نفد'}</span>
            </td>
          `).join('')}
          ${prods.length < 3 ? '<td style="border:1px solid var(--border);background:var(--bg-input)"></td>' : ''}
        </tr>
        <!-- Specs Rows -->
        ${allSpecs.map((spec,i)=>`
          <tr>
            <td style="padding:14px 16px;background:${i%2===0?'var(--bg-secondary)':'var(--bg-card)'};border:1px solid var(--border);font-weight:700;font-size:0.88rem;color:var(--text-secondary)">${spec}</td>
            ${prods.map(p=>`
              <td style="padding:14px 16px;text-align:center;background:${i%2===0?'var(--bg-secondary)':'var(--bg-card)'};border:1px solid var(--border);font-size:0.88rem">
                ${p.specs?.[spec] || '<span style="color:var(--text-muted)">—</span>'}
              </td>
            `).join('')}
            ${prods.length < 3 ? `<td style="border:1px solid var(--border);background:var(--bg-input)"></td>` : ''}
          </tr>
        `).join('')}
        <!-- Actions Row -->
        <tr>
          <td style="padding:16px;background:var(--bg-card);border:1px solid var(--border);font-weight:800">الإجراءات</td>
          ${prods.map(p=>`
            <td style="padding:16px;text-align:center;background:var(--bg-card);border:1px solid var(--border)">
              <div style="display:flex;flex-direction:column;gap:8px">
                <button class="btn btn-primary btn-sm w-full" data-add-cart="${p.id}">🛒 أضف للسلة</button>
                <button class="btn btn-outline btn-sm w-full" onclick="KayanStore.navigate('product',${p.id})">👁️ عرض التفاصيل</button>
              </div>
            </td>
          `).join('')}
          ${prods.length < 3 ? '<td style="border:1px solid var(--border);background:var(--bg-input)"></td>' : ''}
        </tr>
      </table>
    </div>
    <div style="margin-top:24px;text-align:center">
      <button class="btn btn-ghost" onclick="KayanStore.compare=[];KayanStore.saveCompare();KayanStore.renderCompareBar();KayanStore.navigate('shop')">🗑️ مسح المقارنة والعودة للمتجر</button>
    </div>
  `;
};

// ===== OFFERS PAGE =====
KayanStore.renderOffersPage = function() {
  const saleProds = this.data.products.filter(p => p.discount >= 20).sort((a,b) => b.discount - a.discount);
  return `
    <div class="page-hero fade-in" style="background:linear-gradient(135deg,rgba(255,71,87,0.1),rgba(255,107,43,0.1));border-color:rgba(255,107,43,0.2)">
      <span class="page-hero-icon">🏷️</span>
      <div>
        <h1 class="page-hero-title">العروض والخصومات 🔥</h1>
        <p style="color:var(--text-secondary);font-size:0.9rem">أفضل الأسعار والخصومات الحصرية لفترة محدودة</p>
        <div class="page-hero-breadcrumb">
          <span onclick="KayanStore.navigate('home')" style="cursor:pointer;color:var(--primary)">الرئيسية</span>
          <span class="breadcrumb-sep">/</span><span>العروض</span>
        </div>
      </div>
    </div>

    <!-- Coupon Cards -->
    <div class="fade-in" style="margin-bottom:32px">
      <div class="section-header"><h2 class="section-title">🎟️ كوبونات الخصم</h2></div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px">
        ${(this.data.coupons || []).map(c => `
          <div class="card" style="padding:20px;background:linear-gradient(135deg,rgba(255,107,43,0.08),rgba(233,69,96,0.05));border-color:rgba(255,107,43,0.2);display:flex;gap:16px;align-items:center">
            <div style="font-size:36px">🎟️</div>
            <div style="flex:1">
              <div style="font-family:monospace;font-size:1.1rem;font-weight:900;color:var(--primary);background:rgba(255,107,43,0.1);padding:4px 10px;border-radius:6px;letter-spacing:2px;display:inline-block;margin-bottom:6px">${c.code}</div>
              <div style="font-size:0.82rem;color:var(--text-secondary);margin-bottom:4px">${c.desc}</div>
              <div style="font-size:0.75rem;color:var(--text-muted)">حد أدنى للطلب: ${c.minOrder > 0 ? this.formatPrice(c.minOrder) : 'بدون حد أدنى'}</div>
            </div>
            <button class="btn btn-outline btn-sm" onclick="navigator.clipboard.writeText('${c.code}').then(()=>KayanStore.toast('success','✅ تم النسخ!','كوبون ${c.code} جاهز للاستخدام'))">نسخ</button>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Flash Deals -->
    <div class="flash-section fade-in" style="margin-bottom:32px">
      <div class="flash-header">
        <div class="flash-title">⚡ عروض لفترة محدودة</div>
        <div class="countdown">
          <div class="countdown-unit"><span class="cd-hours countdown-num">07</span><span class="countdown-label">ساعة</span></div>
          <span class="countdown-sep">:</span>
          <div class="countdown-unit"><span class="cd-minutes countdown-num">30</span><span class="countdown-label">دقيقة</span></div>
          <span class="countdown-sep">:</span>
          <div class="countdown-unit"><span class="cd-seconds countdown-num">00</span><span class="countdown-label">ثانية</span></div>
        </div>
      </div>
      <div class="flash-products">
        ${this.data.flashDeals.map(id=>{const p=this.getProduct(id);return p?this.renderProductCard(p):''}).join('')}
      </div>
    </div>

    <!-- All Sale Products sorted by discount -->
    <div class="fade-in">
      <div class="section-header">
        <h2 class="section-title">🏷️ جميع العروض (${saleProds.length} منتج)</h2>
        <select class="sort-select" id="sortSelect" style="width:auto">
          <option value="discount">الأعلى خصماً</option>
          <option value="price-low">الأقل سعراً</option>
          <option value="rating">الأعلى تقييماً</option>
        </select>
      </div>
      <div class="products-grid" id="productsContainer">
        ${saleProds.map(p=>this.renderProductCard(p)).join('')}
      </div>
    </div>
  `;
};

// ===== ABOUT PAGE =====
KayanStore.renderAboutPage = function() {
  return `
    <div class="page-hero fade-in">
      <span class="page-hero-icon">🏢</span>
      <div>
        <h1 class="page-hero-title">من نحن</h1>
        <div class="page-hero-breadcrumb">
          <span onclick="KayanStore.navigate('home')" style="cursor:pointer;color:var(--primary)">الرئيسية</span>
          <span class="breadcrumb-sep">/</span><span>من نحن</span>
        </div>
      </div>
    </div>

    <!-- Hero Story -->
    <div class="card p-24 fade-in" style="margin-bottom:32px;background:linear-gradient(135deg,rgba(255,107,43,0.05),rgba(233,69,96,0.05));position:relative;overflow:hidden">
      <div style="position:absolute;top:-30px;left:-30px;width:200px;height:200px;background:radial-gradient(circle,rgba(255,107,43,0.1),transparent);border-radius:50%"></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:center">
        <div>
          <div class="badge badge-primary" style="margin-bottom:16px;font-size:0.8rem">🇾🇪 صنعاء، اليمن</div>
          <h2 style="font-size:2rem;font-weight:900;margin-bottom:16px;line-height:1.3">كيان ستور — قصة <span style="color:var(--primary)">نجاح</span> يمنية</h2>
          <p style="color:var(--text-secondary);line-height:1.9;font-size:0.95rem;margin-bottom:16px">
            بدأت رحلة كيان ستور عام 2022 بحلم بسيط: تمكين كل يمني من التسوق بأمان وثقة من أفضل المنتجات العالمية والمحلية دون عناء.
          </p>
          <p style="color:var(--text-secondary);line-height:1.9;font-size:0.95rem">
            اليوم، نفخر بخدمة أكثر من 200,000 عميل في جميع محافظات اليمن، مع فريق يضم أكثر من 150 موظفاً ملتزماً بتقديم أفضل تجربة تسوق إلكتروني.
          </p>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
          ${[['200K+','عميل راضٍ','👥'],['50K+','منتج متاح','📦'],['4.9★','متوسط التقييم','⭐'],['3 سنوات','خبرة متراكمة','🏆']].map(([n,l,i])=>`
            <div class="card p-16 text-center fade-in">
              <div style="font-size:32px;margin-bottom:8px">${i}</div>
              <div style="font-size:1.6rem;font-weight:900;color:var(--primary)">${n}</div>
              <div style="font-size:0.78rem;color:var(--text-muted)">${l}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- Mission & Vision -->
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px;margin-bottom:32px">
      ${[
        ['🎯','مهمتنا','تمكين المتسوق اليمني من الحصول على أفضل المنتجات العالمية والمحلية بأسعار منافسة وبتجربة تسوق آمنة وموثوقة.','rgba(255,107,43,0.1)','rgba(255,107,43,0.2)'],
        ['👁️','رؤيتنا','أن نكون المنصة التجارية الإلكترونية رقم واحد في اليمن ومنطقة الجزيرة العربية بحلول 2028.','rgba(69,183,209,0.1)','rgba(69,183,209,0.2)'],
        ['💎','قيمنا','الأمانة، الجودة، الابتكار، وخدمة العملاء هي أساس كل قرار نتخذه في كيان ستور.','rgba(0,212,170,0.1)','rgba(0,212,170,0.2)']
      ].map(([i,t,d,bg,border])=>`
        <div class="card p-24 fade-in" style="background:${bg};border-color:${border}">
          <div style="font-size:40px;margin-bottom:16px">${i}</div>
          <h3 style="font-size:1.1rem;font-weight:900;margin-bottom:12px">${t}</h3>
          <p style="color:var(--text-secondary);line-height:1.8;font-size:0.9rem">${d}</p>
        </div>
      `).join('')}
    </div>

    <!-- Team -->
    <div class="fade-in" style="margin-bottom:32px">
      <div class="section-header"><h2 class="section-title">👥 فريق القيادة</h2></div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:20px">
        ${[
          ['علي قتيبة','المؤسس والرئيس التنفيذي','💼','خبرة 10+ سنوات في التجارة الإلكترونية'],
          ['محمد الأهنومي','مدير العمليات','⚙️','متخصص في سلاسل التوريد واللوجستيات'],
          ['فاطمة السنباني','مديرة التسويق','📣','خبيرة في التسويق الرقمي والمحتوى'],
          ['أحمد الربيعي','مدير تقنية المعلومات','💻','مطور Full-Stack ومهندس سحابي']
        ].map(([name,title,icon,desc])=>`
          <div class="card p-20 text-center fade-in">
            <div style="width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,var(--primary),var(--accent2));display:flex;align-items:center;justify-content:center;font-size:28px;margin:0 auto 14px">${icon}</div>
            <div style="font-weight:900;font-size:0.95rem;margin-bottom:4px">${name}</div>
            <div style="font-size:0.8rem;color:var(--primary);font-weight:700;margin-bottom:8px">${title}</div>
            <div style="font-size:0.78rem;color:var(--text-muted);line-height:1.6">${desc}</div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Partners & Certifications -->
    <div class="card p-24 fade-in" style="margin-bottom:32px">
      <h3 style="font-size:1rem;font-weight:900;margin-bottom:20px">🏆 شهاداتنا وشراكاتنا</h3>
      <div style="display:flex;flex-wrap:wrap;gap:12px">
        ${['شهادة ISO 9001:2015','معتمد من وزارة الصناعة','شريك Amazon Global','شريك Alibaba B2B','شهادة SSL Extended','عضو اتحاد التجارة الإلكترونية'].map(cert=>`
          <div style="background:rgba(255,215,0,0.1);border:1px solid rgba(255,215,0,0.2);border-radius:var(--radius-full);padding:6px 16px;font-size:0.82rem;font-weight:700;color:var(--gold)">✓ ${cert}</div>
        `).join('')}
      </div>
    </div>

    <!-- CTA -->
    <div class="newsletter-section fade-in">
      <h2 class="newsletter-title">🤝 انضم لعائلة كيان ستور</h2>
      <p class="newsletter-desc">سواء كنت عميلاً أو شريكاً أو مورداً، نحن هنا لنبني معاً مستقبل التجارة الإلكترونية في اليمن</p>
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
        <button class="btn btn-gold btn-lg" onclick="KayanStore.navigate('shop')">🛍️ تسوق الآن</button>
        <button class="btn btn-secondary btn-lg" onclick="KayanStore.navigate('contact')">📞 تواصل معنا</button>
      </div>
    </div>
  `;
};

// ===== CONTACT PAGE =====
KayanStore.renderContactPage = function() {
  return `
    <div class="page-hero fade-in">
      <span class="page-hero-icon">📞</span>
      <div>
        <h1 class="page-hero-title">تواصل معنا</h1>
        <div class="page-hero-breadcrumb">
          <span onclick="KayanStore.navigate('home')" style="cursor:pointer;color:var(--primary)">الرئيسية</span>
          <span class="breadcrumb-sep">/</span><span>تواصل معنا</span>
        </div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1.5fr;gap:32px;align-items:start">
      <!-- Contact Info -->
      <div>
        <div class="card p-24 fade-in" style="margin-bottom:20px">
          <h3 style="font-size:1rem;font-weight:900;margin-bottom:20px">📋 معلومات التواصل</h3>
          ${[
            ['👤','المطور','علي قتيبة'],
            ['📧','البريد الإلكتروني','aliqateebah@gmail.com'],
            ['📱','الهاتف','+967 781 208 883'],
            ['💬','واتساب 1','+967 783 265 552'],
            ['💬','واتساب 2','+967 783 265 553'],
            ['🇾🇪','البلد','اليمن - صنعاء'],
            ['⏰','ساعات العمل','يومياً 8 صباحاً - 11 مساءً']
          ].map(([i,l,v])=>`
            <div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--border)">
              <span style="font-size:20px;width:28px;text-align:center">${i}</span>
              <div>
                <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:2px">${l}</div>
                <div style="font-weight:700;font-size:0.9rem;${l.includes('واتساب')||l.includes('الهاتف')||l.includes('البريد')?'direction:ltr;text-align:right':''}">${v}</div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Social Links -->
        <div class="card p-20 fade-in">
          <h3 style="font-size:0.95rem;font-weight:900;margin-bottom:14px">🌐 تابعنا على</h3>
          <div style="display:flex;flex-direction:column;gap:10px">
            ${[['📘','Facebook','@KayanStore.ye'],['📸','Instagram','@kayan.store'],['🐦','Twitter/X','@KayanStore'],['▶️','YouTube','قناة كيان ستور'],['💬','Telegram','@KayanStoreBot']].map(([i,n,h])=>`
              <div style="display:flex;align-items:center;gap:10px;padding:10px;background:var(--bg-input);border-radius:var(--radius-md);cursor:pointer;transition:var(--transition-fast)" onmouseover="this.style.background='rgba(255,107,43,0.1)'" onmouseout="this.style.background='var(--bg-input)'" onclick="KayanStore.toast('info','${i} ${n}','صفحتنا الرسمية')">
                <span style="font-size:22px">${i}</span>
                <div><div style="font-weight:700;font-size:0.88rem">${n}</div><div style="font-size:0.75rem;color:var(--text-muted)">${h}</div></div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Contact Form -->
      <div class="card p-24 fade-in">
        <h3 style="font-size:1rem;font-weight:900;margin-bottom:20px">✉️ أرسل لنا رسالة</h3>
        <div class="form-grid" style="gap:16px">
          <div class="form-grid form-grid-2" style="gap:16px">
            <div class="form-group">
              <label class="form-label">الاسم الكامل <span class="form-required">*</span></label>
              <input class="input" id="contactName" placeholder="أحمد محمد">
            </div>
            <div class="form-group">
              <label class="form-label">البريد الإلكتروني <span class="form-required">*</span></label>
              <input class="input" id="contactEmail" type="email" placeholder="email@example.com" dir="ltr">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">رقم الهاتف</label>
            <input class="input" id="contactPhone" placeholder="+967 7XX XXX XXX" dir="ltr">
          </div>
          <div class="form-group">
            <label class="form-label">موضوع الرسالة <span class="form-required">*</span></label>
            <select class="select" id="contactSubject">
              <option value="">اختر الموضوع</option>
              <option>استفسار عن منتج</option>
              <option>مشكلة في طلب</option>
              <option>طلب إرجاع أو استبدال</option>
              <option>شكوى</option>
              <option>اقتراح</option>
              <option>شراكة تجارية</option>
              <option>أخرى</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">رقم الطلب (إن وجد)</label>
            <input class="input" placeholder="KY-2026-XXXX" dir="ltr">
          </div>
          <div class="form-group">
            <label class="form-label">تفاصيل الرسالة <span class="form-required">*</span></label>
            <textarea class="textarea" id="contactMsg" rows="5" placeholder="اكتب رسالتك هنا بالتفصيل..."></textarea>
          </div>
          <div class="form-group">
            <label class="form-label">كيف تفضل التواصل؟</label>
            <div style="display:flex;gap:12px;flex-wrap:wrap">
              ${['واتساب','بريد إلكتروني','مكالمة هاتفية'].map(m=>`
                <label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:0.88rem">
                  <input type="radio" name="contactPref" value="${m}" style="accent-color:var(--primary)"> ${m}
                </label>
              `).join('')}
            </div>
          </div>
          <button class="btn btn-primary btn-lg w-full" onclick="
            const name = document.getElementById('contactName').value;
            const email = document.getElementById('contactEmail').value;
            const msg = document.getElementById('contactMsg').value;
            if(name && email && msg) {
              KayanStore.toast('success','✅ تم إرسال رسالتك!','سنتواصل معك خلال 24 ساعة');
              document.getElementById('contactName').value='';
              document.getElementById('contactEmail').value='';
              document.getElementById('contactMsg').value='';
            } else {
              KayanStore.toast('error','❌ يرجى ملء الحقول المطلوبة');
            }
          ">📤 إرسال الرسالة</button>
        </div>

        <!-- WhatsApp Quick -->
        <div class="divider-text" style="margin:20px 0">أو تواصل مباشرة عبر</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <a href="https://wa.me/967783265552" target="_blank" class="btn btn-success" style="background:#25D366;color:white;text-decoration:none">
            💬 واتساب 1
          </a>
          <a href="https://wa.me/967783265553" target="_blank" class="btn" style="background:#25D366;color:white">
            💬 واتساب 2
          </a>
        </div>
      </div>
    </div>

    <!-- Map placeholder -->
    <div class="card fade-in" style="margin-top:32px;height:260px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,rgba(255,107,43,0.05),rgba(69,183,209,0.05))">
      <div style="text-align:center">
        <div style="font-size:48px;margin-bottom:12px">📍</div>
        <div style="font-weight:800;margin-bottom:4px">موقعنا</div>
        <div style="color:var(--text-muted);font-size:0.88rem">صنعاء، اليمن — شارع الزبيري، مبنى كيان</div>
        <button class="btn btn-outline btn-sm" style="margin-top:12px" onclick="KayanStore.toast('info','🗺️','سيتم إضافة الخريطة التفاعلية قريباً')">فتح على الخريطة</button>
      </div>
    </div>
  `;
};

// ===== TRACK ORDER PAGE =====
KayanStore.renderTrackPage = function() {
  return `
    <div class="page-hero fade-in">
      <span class="page-hero-icon">📦</span>
      <div>
        <h1 class="page-hero-title">تتبع الطلب</h1>
        <div class="page-hero-breadcrumb">
          <span onclick="KayanStore.navigate('home')" style="cursor:pointer;color:var(--primary)">الرئيسية</span>
          <span class="breadcrumb-sep">/</span><span>تتبع الطلب</span>
        </div>
      </div>
    </div>

    <!-- Track Form -->
    <div class="card p-32 fade-in" style="max-width:600px;margin:0 auto 32px;text-align:center">
      <div style="font-size:48px;margin-bottom:16px">🔍</div>
      <h2 style="font-size:1.3rem;margin-bottom:8px">تتبع طلبك في الوقت الفعلي</h2>
      <p style="color:var(--text-muted);font-size:0.9rem;margin-bottom:24px">أدخل رقم طلبك لمعرفة حالته الحالية</p>
      <div style="display:flex;gap:10px;margin-bottom:16px">
        <input class="input" id="trackInput" placeholder="مثال: KY-2026-1234" dir="ltr" style="flex:1">
        <button class="btn btn-primary" id="trackBtn" onclick="KayanStore.trackOrder()">🔍 تتبع</button>
      </div>
      <p style="font-size:0.78rem;color:var(--text-muted)">يمكنك أيضاً تتبع طلبك عبر رقم الهاتف الذي سجلت به</p>
    </div>

    <!-- Track Result (hidden by default) -->
    <div id="trackResult" class="hidden">
      <div class="card p-24 fade-in" style="max-width:700px;margin:0 auto">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px">
          <div>
            <div style="font-size:0.8rem;color:var(--text-muted)">رقم الطلب</div>
            <div style="font-weight:900;font-size:1.1rem;color:var(--primary)" id="trackOrderId">KY-2026-1234</div>
          </div>
          <span class="order-status shipped">في الطريق إليك 🚀</span>
        </div>

        <!-- Progress Steps -->
        <div style="position:relative;margin-bottom:32px">
          <div style="position:absolute;top:22px;right:20px;left:20px;height:3px;background:var(--bg-input);z-index:0"></div>
          <div style="position:absolute;top:22px;right:20px;width:60%;height:3px;background:var(--primary);z-index:1;transition:width 1s ease"></div>
          <div style="display:flex;justify-content:space-between;position:relative;z-index:2">
            ${[
              ['✅','تأكيد الطلب','14 أبريل 2026 - 09:30',true],
              ['✅','تجهيز الطلب','14 أبريل 2026 - 11:00',true],
              ['🚀','في الطريق','15 أبريل 2026 - 08:00',true],
              ['📦','التوصيل','اليوم المتوقع',false]
            ].map(([i,t,d,done])=>`
              <div style="display:flex;flex-direction:column;align-items:center;gap:6px;flex:1">
                <div style="width:44px;height:44px;border-radius:50%;background:${done?'var(--primary)':'var(--bg-input)'};border:3px solid ${done?'var(--primary)':'var(--border)'};display:flex;align-items:center;justify-content:center;font-size:18px;transition:all 0.3s">${i}</div>
                <div style="font-size:0.78rem;font-weight:700;text-align:center;color:${done?'var(--text-primary)':'var(--text-muted)'}">${t}</div>
                <div style="font-size:0.68rem;color:var(--text-muted);text-align:center">${d}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Details -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px">
          <div class="card p-16">
            <div style="font-size:0.78rem;color:var(--text-muted);margin-bottom:4px">📍 عنوان التوصيل</div>
            <div style="font-size:0.88rem;font-weight:600">صنعاء - شارع الزبيري، حي الحصبة</div>
          </div>
          <div class="card p-16">
            <div style="font-size:0.78rem;color:var(--text-muted);margin-bottom:4px">🚚 شركة الشحن</div>
            <div style="font-size:0.88rem;font-weight:600">كيان إكسبريس</div>
            <div style="font-size:0.75rem;color:var(--primary)">رقم التتبع: EX-78234</div>
          </div>
        </div>

        <!-- Timeline -->
        <div>
          <div style="font-weight:800;margin-bottom:14px;font-size:0.9rem">📋 سجل الشحنة</div>
          ${[
            ['15 أبريل - 08:00','خرجت الشحنة من المستودع الرئيسي في صنعاء','var(--primary)'],
            ['14 أبريل - 23:30','تم تحضير الشحنة وفحصها','var(--success)'],
            ['14 أبريل - 11:00','جاري تجهيز طلبك في المستودع','var(--success)'],
            ['14 أبريل - 09:30','تم تأكيد الطلب واستلام الدفع','var(--success)']
          ].map(([time,event,color])=>`
            <div style="display:flex;gap:12px;margin-bottom:12px">
              <div style="display:flex;flex-direction:column;align-items:center">
                <div style="width:10px;height:10px;border-radius:50%;background:${color};margin-top:5px;flex-shrink:0"></div>
                <div style="width:2px;flex:1;background:var(--border);margin-top:4px"></div>
              </div>
              <div style="padding-bottom:12px">
                <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:2px">${time}</div>
                <div style="font-size:0.88rem;font-weight:600">${event}</div>
              </div>
            </div>
          `).join('')}
        </div>
        <a href="https://wa.me/967783265552?text=استفسار عن طلب رقم KY-2026-1234" target="_blank" class="btn btn-outline w-full" style="margin-top:8px">💬 تواصل مع المندوب عبر واتساب</a>
      </div>
    </div>
  `;
};

KayanStore.trackOrder = function() {
  const input = document.getElementById('trackInput');
  if (!input?.value?.trim()) {
    this.toast('error','❌','يرجى إدخال رقم الطلب');
    return;
  }
  const result = document.getElementById('trackResult');
  const orderId = document.getElementById('trackOrderId');
  if (result) result.classList.remove('hidden');
  if (orderId) orderId.textContent = input.value.trim();
  this.toast('success','✅ تم العثور على طلبك','جاري عرض تفاصيل الشحن');
  result?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

// ===== FAQ PAGE =====
KayanStore.renderFaqPage = function() {
  const faqs = [
    { cat: '🛒 التسوق', items: [
      ['كيف أضيف منتجاً للسلة؟', 'اضغط على "أضف للسلة" في صفحة المنتج أو من شبكة المنتجات. ستظهر السلة الجانبية تلقائياً.'],
      ['كيف أبحث عن منتج؟', 'استخدم شريط البحث في أعلى الصفحة وأدخل اسم المنتج أو الفئة أو الماركة.'],
      ['هل يمكنني مقارنة المنتجات؟', 'نعم، اضغط على زر ⚖️ في أي منتج لإضافته للمقارنة. يمكن مقارنة حتى 3 منتجات معاً.'],
      ['كيف أضيف منتجاً للمفضلة؟', 'اضغط على أيقونة القلب ♡ في أي منتج لحفظه في قائمة المفضلة لديك.']
    ]},
    { cat: '💳 الدفع', items: [
      ['ما هي طرق الدفع المتاحة؟', 'نقبل: الدفع النقدي عند الاستلام، التحويل البنكي، المحافظ الإلكترونية (كريمي، سبأفون، هواش).'],
      ['هل الدفع آمن؟', 'نعم، جميع معاملاتنا مشفرة بتقنية SSL المتقدمة لضمان حماية بياناتك.'],
      ['كيف أستخدم كوبون الخصم؟', 'أدخل كود الكوبون في حقل "كوبون الخصم" في صفحة السلة أو الدفع واضغط "تطبيق".'],
      ['ما هي كوبونات الخصم المتاحة؟', 'KAYAN10 (خصم 10%)، WELCOME20 (20% للعملاء الجدد)، FREESHIP (شحن مجاني).']
    ]},
    { cat: '🚚 الشحن والتوصيل', items: [
      ['كم يستغرق وقت التوصيل؟', 'صنعاء: نفس اليوم إلى 24 ساعة. عدن وتعز: 2-3 أيام. باقي المحافظات: 3-7 أيام.'],
      ['كم تكلفة الشحن؟', 'صنعاء: مجاني للطلبات فوق 50,000 ريال. المحافظات الأخرى: 2,500-4,500 ريال.'],
      ['كيف أتابع طلبي؟', 'ستتلقى رسالة واتساب برقم التتبع فور الشحن، ويمكنك متابعته من صفحة "تتبع الطلب".'],
      ['ماذا أفعل إذا لم يصل طلبي؟', 'تواصل معنا فوراً عبر واتساب أو من صفحة "تواصل معنا" وسنحل المشكلة خلال 24 ساعة.']
    ]},
    { cat: '↩️ الإرجاع والاستبدال', items: [
      ['ما سياسة الإرجاع؟', 'يمكنك إرجاع أي منتج خلال 30 يوماً من تاريخ الاستلام بدون الحاجة لأي مبرر.'],
      ['كيف أطلب إرجاع منتج؟', 'من صفحة "طلباتي" اضغط على "تفاصيل" ثم "طلب إرجاع"، أو تواصل معنا مباشرة.'],
      ['كم يستغرق استرداد المبلغ؟', 'يتم استرداد المبلغ خلال 3-7 أيام عمل بعد استلام المنتج المُرجَع.'],
      ['ما شروط الإرجاع؟', 'يجب أن يكون المنتج بحالته الأصلية في علبته الأصلية مع جميع الملحقات.']
    ]},
    { cat: '👤 الحساب', items: [
      ['كيف أنشئ حساباً جديداً؟', 'اضغط على "تسجيل الدخول" ثم "إنشاء حساب مجاني" وأدخل بياناتك.'],
      ['نسيت كلمة المرور، ماذا أفعل؟', 'في صفحة تسجيل الدخول اضغط "نسيت كلمة المرور" وأدخل بريدك لإعادة الضبط.'],
      ['كيف أحصل على نقاط المكافآت؟', 'تحصل على نقطة مكافأة لكل 1,000 ريال تشتريها. يمكن استبدال النقاط بخصومات.']
    ]}
  ];

  return `
    <div class="page-hero fade-in">
      <span class="page-hero-icon">❓</span>
      <div>
        <h1 class="page-hero-title">الأسئلة الشائعة</h1>
        <div class="page-hero-breadcrumb">
          <span onclick="KayanStore.navigate('home')" style="cursor:pointer;color:var(--primary)">الرئيسية</span>
          <span class="breadcrumb-sep">/</span><span>الأسئلة الشائعة</span>
        </div>
      </div>
    </div>

    <!-- Search FAQ -->
    <div class="card p-20 fade-in" style="max-width:600px;margin:0 auto 32px">
      <div class="search-box" style="border-radius:var(--radius-md)">
        <input class="search-input" placeholder="ابحث في الأسئلة الشائعة..." id="faqSearch" oninput="KayanStore.filterFaq(this.value)">
        <button class="search-btn">🔍</button>
      </div>
    </div>

    <!-- FAQ Sections -->
    <div id="faqContainer">
      ${faqs.map((section, si) => `
        <div class="card fade-in" style="margin-bottom:20px;overflow:hidden">
          <div style="padding:16px 20px;background:rgba(255,107,43,0.05);border-bottom:1px solid var(--border);font-weight:900;font-size:1rem">${section.cat}</div>
          ${section.items.map((item, i) => `
            <div class="faq-item" style="border-bottom:${i < section.items.length-1 ? '1px solid var(--border)' : 'none'}">
              <div class="faq-q" style="padding:16px 20px;cursor:pointer;display:flex;align-items:center;justify-content:space-between;font-weight:700;font-size:0.92rem;transition:var(--transition-fast)" onclick="KayanStore.toggleFaq(this)">
                <span>${item[0]}</span>
                <span class="faq-icon" style="font-size:18px;transition:transform 0.3s;color:var(--primary);flex-shrink:0;margin-right:8px">+</span>
              </div>
              <div class="faq-a" style="display:none;padding:0 20px 16px;color:var(--text-secondary);font-size:0.9rem;line-height:1.8">${item[1]}</div>
            </div>
          `).join('')}
        </div>
      `).join('')}
    </div>

    <!-- Still need help? -->
    <div class="card p-32 fade-in" style="text-align:center;background:linear-gradient(135deg,rgba(255,107,43,0.05),rgba(69,183,209,0.05))">
      <div style="font-size:48px;margin-bottom:12px">🤔</div>
      <h3 style="font-size:1.1rem;margin-bottom:8px">لم تجد إجابتك؟</h3>
      <p style="color:var(--text-muted);font-size:0.88rem;margin-bottom:20px">فريق دعمنا متاح 24/7 للإجابة على جميع استفساراتك</p>
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
        <button class="btn btn-primary" onclick="KayanStore.navigate('contact')">📞 تواصل معنا</button>
        <a href="https://wa.me/967783265552" target="_blank" class="btn btn-gold">💬 واتساب مباشر</a>
      </div>
    </div>
  `;
};

KayanStore.toggleFaq = function(el) {
  const answer = el.nextElementSibling;
  const icon = el.querySelector('.faq-icon');
  const isOpen = answer.style.display !== 'none';
  answer.style.display = isOpen ? 'none' : 'block';
  icon.textContent = isOpen ? '+' : '−';
  icon.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(45deg)';
  if (!isOpen) {
    el.style.color = 'var(--primary)';
    el.style.background = 'rgba(255,107,43,0.03)';
  } else {
    el.style.color = '';
    el.style.background = '';
  }
};

KayanStore.filterFaq = function(query) {
  const q = query.toLowerCase();
  document.querySelectorAll('.faq-item').forEach(item => {
    const text = item.textContent.toLowerCase();
    item.style.display = !q || text.includes(q) ? '' : 'none';
  });
};

// ===== SEARCH RESULTS PAGE =====
KayanStore.renderSearchPage = function() {
  const query = this.searchQuery;
  const results = this.getProducts('all', this.sortBy, query);

  return `
    <div class="page-hero fade-in">
      <span class="page-hero-icon">🔍</span>
      <div>
        <h1 class="page-hero-title">نتائج البحث: "${query}"</h1>
        <div class="page-hero-breadcrumb">
          <span onclick="KayanStore.navigate('home')" style="cursor:pointer;color:var(--primary)">الرئيسية</span>
          <span class="breadcrumb-sep">/</span><span>البحث</span>
        </div>
      </div>
    </div>

    ${!results.length ? `
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <h3 class="empty-title">لا نتائج لـ "${query}"</h3>
        <p class="empty-desc">جرب كلمات بحث مختلفة أو تصفح الفئات</p>
        <button class="btn btn-primary btn-lg" onclick="KayanStore.navigate('shop')">🛍️ تصفح المتجر</button>
      </div>
    ` : `
      <div class="products-toolbar fade-in">
        <div class="products-count">تم العثور على <span>${results.length}</span> نتيجة</div>
        <div class="toolbar-actions">
          <select class="sort-select" id="sortSelect">
            <option value="popular">الأكثر شعبية</option>
            <option value="rating">الأعلى تقييماً</option>
            <option value="price-low">السعر: الأقل أولاً</option>
            <option value="price-high">السعر: الأعلى أولاً</option>
          </select>
        </div>
      </div>
      <div class="products-grid" id="productsContainer">${results.map(p => this.renderProductCard(p)).join('')}</div>
    `}

    <!-- Search suggestions -->
    <div class="fade-in" style="margin-top:32px">
      <div class="section-header"><h2 class="section-title">💡 قد يعجبك أيضاً</h2></div>
      <div class="products-grid">${this.data.products.slice(0,4).map(p=>this.renderProductCard(p)).join('')}</div>
    </div>
  `;
};

// ===== SETTINGS PAGE =====
KayanStore.renderSettingsPage = function() {
  return `
    <div class="page-hero fade-in">
      <span class="page-hero-icon">⚙️</span>
      <div>
        <h1 class="page-hero-title">الإعدادات</h1>
        <div class="page-hero-breadcrumb">
          <span onclick="KayanStore.navigate('home')" style="cursor:pointer;color:var(--primary)">الرئيسية</span>
          <span class="breadcrumb-sep">/</span><span>الإعدادات</span>
        </div>
      </div>
    </div>
    <div style="display:grid;gap:20px;max-width:700px">
      <!-- Theme -->
      <div class="card p-24 fade-in">
        <h3 style="font-size:0.95rem;font-weight:900;margin-bottom:16px">🎨 المظهر</h3>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">
          ${[['🌙','داكن (افتراضي)','dark'],['☀️','فاتح','light'],['🌅','تلقائي','auto']].map(([i,l,v])=>`
            <div style="border:2px solid ${v==='dark'?'var(--primary)':'var(--border)'};border-radius:var(--radius-md);padding:16px;text-align:center;cursor:pointer;transition:var(--transition-fast)" onclick="KayanStore.toast('info','${i} ${l}','تم تطبيق المظهر')" onmouseover="this.style.borderColor='var(--primary)'" onmouseout="this.style.borderColor='${v==='dark'?'var(--primary)':'var(--border)'}'">
              <div style="font-size:28px;margin-bottom:6px">${i}</div>
              <div style="font-size:0.8rem;font-weight:700">${l}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Language -->
      <div class="card p-24 fade-in">
        <h3 style="font-size:0.95rem;font-weight:900;margin-bottom:16px">🌐 اللغة</h3>
        <div style="display:flex;gap:12px">
          ${[['🇾🇪','العربية',true],['🇬🇧','English',false]].map(([f,l,a])=>`
            <div style="border:2px solid ${a?'var(--primary)':'var(--border)'};border-radius:var(--radius-md);padding:12px 20px;cursor:pointer;display:flex;align-items:center;gap:8px;font-weight:700;font-size:0.9rem;transition:var(--transition-fast)" onclick="KayanStore.toast('info','${f} ${l}','سيتم دعم اللغة قريباً')">
              <span>${f}</span>${l}${a?'<span style="color:var(--primary);font-size:0.75rem"> ✓ نشط</span>':''}
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Currency -->
      <div class="card p-24 fade-in">
        <h3 style="font-size:0.95rem;font-weight:900;margin-bottom:16px">💰 العملة</h3>
        <div style="display:flex;gap:12px;flex-wrap:wrap">
          ${[['🇾🇪','ريال يمني','YER',true],['💵','دولار أمريكي','USD',false],['🇸🇦','ريال سعودي','SAR',false]].map(([f,l,c,a])=>`
            <div style="border:2px solid ${a?'var(--primary)':'var(--border)'};border-radius:var(--radius-md);padding:10px 16px;cursor:pointer;font-size:0.85rem;font-weight:700;transition:var(--transition-fast)" onclick="KayanStore.toast('info','${f} ${l}','تم تغيير العملة')">
              ${f} ${c} ${a?'✓':''}
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Notifications -->
      <div class="card p-24 fade-in">
        <h3 style="font-size:0.95rem;font-weight:900;margin-bottom:16px">🔔 الإشعارات</h3>
        <div style="display:flex;flex-direction:column;gap:14px">
          ${[
            ['إشعارات الطلبات','تحديثات حالة طلبك',true],
            ['إشعارات العروض','عروض وتخفيضات حصرية',true],
            ['إشعارات المنتجات','وصول منتجات جديدة',false],
            ['إشعارات البريد الإلكتروني','تلقي الإشعارات على بريدك',true]
          ].map(([t,d,on])=>`
            <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--border)">
              <div><div style="font-weight:700;font-size:0.88rem">${t}</div><div style="font-size:0.75rem;color:var(--text-muted)">${d}</div></div>
              <div style="width:48px;height:26px;border-radius:13px;background:${on?'var(--primary)':'var(--bg-input)'};border:2px solid ${on?'var(--primary)':'var(--border)'};cursor:pointer;position:relative;transition:var(--transition-fast)" onclick="this.style.background=this.style.background.includes('FF6B2B')?'var(--bg-input)':'var(--primary)';KayanStore.toast('info','⚙️','تم تحديث الإعداد')">
                <div style="width:18px;height:18px;border-radius:50%;background:white;position:absolute;top:2px;${on?'left:24px':'left:2px'};transition:left 0.3s"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Privacy -->
      <div class="card p-24 fade-in">
        <h3 style="font-size:0.95rem;font-weight:900;margin-bottom:16px">🔒 الخصوصية والبيانات</h3>
        <div style="display:flex;flex-direction:column;gap:10px">
          ${[
            ['📋','عرض سياسة الخصوصية'],
            ['📜','الشروط والأحكام'],
            ['🗑️','حذف بيانات التصفح المحلية'],
            ['⬇️','تحميل بياناتي الشخصية']
          ].map(([i,t])=>`
            <div class="card p-14" style="display:flex;align-items:center;justify-content:space-between;cursor:pointer" onclick="KayanStore.toast('info','${i} ${t}','هذه الميزة قيد التطوير')">
              <div style="display:flex;align-items:center;gap:10px;font-size:0.88rem;font-weight:600"><span>${i}</span>${t}</div>
              <span style="color:var(--text-muted)">›</span>
            </div>
          `).join('')}
        </div>
        <button class="btn btn-secondary w-full" style="margin-top:14px;color:var(--error);border-color:rgba(255,71,87,0.3)" onclick="if(confirm('هل تريد مسح جميع البيانات المحلية؟')){localStorage.clear();KayanStore.toast('success','✅','تم مسح البيانات');location.reload()}">🗑️ مسح جميع البيانات المحلية</button>
      </div>
    </div>
  `;
};
