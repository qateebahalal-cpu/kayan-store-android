# Kayan Store ProGuard Rules

# Keep WebView JavaScript interface
-keepclassmembers class com.kayanstore.app.MainActivity$AndroidBridge {
    public *;
}

# Keep all classes in our package
-keep class com.kayanstore.app.** { *; }

# Keep AndroidX
-keep class androidx.** { *; }
-dontwarn androidx.**

# Keep WebView related
-keepclassmembers class * extends android.webkit.WebViewClient {
    public void *(android.webkit.WebView, java.lang.String, android.graphics.Bitmap);
    public boolean *(android.webkit.WebView, java.lang.String);
}
-keepclassmembers class * extends android.webkit.WebChromeClient {
    public void *(android.webkit.WebView, java.lang.String);
}

# Remove logging in release
-assumenosideeffects class android.util.Log {
    public static *** d(...);
    public static *** v(...);
    public static *** i(...);
}
