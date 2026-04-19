package com.kayanstore.app;

import android.app.Application;
import android.webkit.WebView;

public class KayanApp extends Application {

    @Override
    public void onCreate() {
        super.onCreate();
        // Enable WebView debugging in debug builds
        if (BuildConfig.DEBUG) {
            WebView.setWebContentsDebuggingEnabled(true);
        }
    }
}
