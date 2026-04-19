# 📱 كيان ستور — تطبيق Android

> نسخة Android من متجر كيان ستور — WebView App احترافي
> تطوير: **علي قتيبة** | aliqateebah@gmail.com

---

## 🗂️ هيكل المشروع

```
kayan-store-android/
├── app/
│   ├── src/main/
│   │   ├── AndroidManifest.xml
│   │   ├── assets/
│   │   │   └── www/                   ← ملفات المتجر الكاملة
│   │   │       ├── index.html
│   │   │       ├── css/
│   │   │       ├── js/
│   │   │       └── data/
│   │   ├── java/com/kayanstore/app/
│   │   │   ├── KayanApp.java          ← Application class
│   │   │   ├── SplashActivity.java    ← شاشة البداية
│   │   │   └── MainActivity.java      ← WebView الرئيسي
│   │   └── res/
│   │       ├── layout/
│   │       │   ├── activity_splash.xml
│   │       │   └── activity_main.xml
│   │       ├── drawable/              ← أيقونات وخلفيات
│   │       ├── mipmap-*/              ← أيقونات Launcher
│   │       ├── values/                ← ألوان، سترينجز، ستايلز
│   │       └── xml/
│   │           ├── file_paths.xml
│   │           └── network_security_config.xml
│   ├── build.gradle
│   └── proguard-rules.pro
├── gradle/wrapper/
│   └── gradle-wrapper.properties
├── build.gradle
├── settings.gradle
└── gradle.properties
```

---

## 🚀 كيفية فتح المشروع وبناؤه

### المتطلبات
- Android Studio Hedgehog (2023.1.1) أو أحدث
- JDK 11 أو 17
- Android SDK (API 21 → 34)

### الخطوات

**1. افتح المشروع**
```
Android Studio → File → Open → اختر مجلد kayan-store-android
```

**2. انتظر Gradle Sync**
سيقوم Android Studio تلقائياً بتحميل المكتبات. قد يستغرق 2-5 دقائق.

**3. بناء APK للاختبار**
```
Build → Build Bundle(s) / APK(s) → Build APK(s)
```
📍 الناتج: `app/build/outputs/apk/debug/KayanStore-v2.0-debug.apk`

**4. بناء APK للإنتاج (موقّع)**
```
Build → Generate Signed Bundle / APK
```
اتبع المعالج لإنشاء Keystore وتوقيع APK.

---

## ✨ ميزات التطبيق

| الميزة | التفاصيل |
|--------|----------|
| 🌙 Dark Mode | خلفية `#0A0A0F` تطابق تصميم المتجر تماماً |
| 🌊 Splash Screen | شاشة بداية مع أنيميشن fade-in (2 ثانية) |
| 🔄 Pull to Refresh | سحب للأسفل لإعادة تحميل الصفحة |
| 📶 Progress Bar | شريط تحميل برتقالي في أعلى الشاشة |
| 💬 WhatsApp | فتح واتساب مباشرة من التطبيق |
| 📁 File Upload | دعم رفع الملفات والصور من الكاميرا |
| 🔙 Back Button | رجوع داخل الصفحات أو سؤال قبل الخروج |
| 📳 Vibration | اهتزاز خفيف عند التفاعل (عبر JS Bridge) |
| 🔗 JS Bridge | تواصل بين JavaScript والكود الأصيل |
| 🌐 RTL | دعم كامل للغة العربية والاتجاه RTL |
| 📦 Offline | الملفات مضمّنة داخل APK — تعمل بدون انترنت |
| 🔒 ProGuard | حماية الكود في نسخة Release |

---

## 🔧 JavaScript Bridge

يمكن استدعاء دوال Android مباشرة من JavaScript في المتجر:

```javascript
// مشاركة نص
AndroidBridge.shareText("تحقق من هذا المنتج الرائع!");

// فتح واتساب
AndroidBridge.openWhatsApp("967781208883", "السلام عليكم، أريد الاستفسار عن...");

// اهتزاز خفيف
AndroidBridge.vibrate();

// معلومات الجهاز
const info = JSON.parse(AndroidBridge.getDeviceInfo());
console.log(info.model); // مثلاً: "Samsung Galaxy S23"

// كشف أن التطبيق يعمل على Android
if (window.isAndroidApp) {
    console.log("يعمل داخل تطبيق Android");
}
```

---

## 📲 معلومات التوزيع

| الحقل | القيمة |
|-------|--------|
| Package ID | `com.kayanstore.app` |
| Min Android | 5.0 (API 21) |
| Target Android | 14 (API 34) |
| Version | 2.0 (versionCode 2) |
| Architecture | Universal (ARM + x86) |

---

## 🔑 إنشاء Keystore للنشر على Play Store

```bash
keytool -genkey -v \
  -keystore kayan-store.keystore \
  -alias kayan \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

ثم في `app/build.gradle`، عدّل:
```groovy
signingConfigs {
    release {
        storeFile file("kayan-store.keystore")
        storePassword "YOUR_PASSWORD"
        keyAlias "kayan"
        keyPassword "YOUR_KEY_PASSWORD"
    }
}
```

---

## 📞 التواصل

| الوسيلة | التفاصيل |
|---------|----------|
| البريد | aliqateebah@gmail.com |
| واتساب | +967783265552 |

---

*© 2026 كيان ستور — تطوير: علي قتيبة*
