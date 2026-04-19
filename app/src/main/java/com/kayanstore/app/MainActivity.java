package com.kayanstore.app;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.view.View;
import android.view.WindowManager;
import android.webkit.*;
import android.widget.ProgressBar;
import android.widget.Toast;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.core.content.FileProvider;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class MainActivity extends AppCompatActivity {

    private WebView webView;
    private ProgressBar progressBar;
    private SwipeRefreshLayout swipeRefresh;

    // File upload support
    private ValueCallback<Uri[]> filePathCallback;
    private Uri cameraImageUri;

    private static final int PERMISSION_REQUEST_CODE = 100;
    private static final String APP_URL = "file:///android_asset/www/index.html";

    // Activity result launchers
    private final ActivityResultLauncher<Intent> filePickerLauncher =
        registerForActivityResult(new ActivityResultContracts.StartActivityForResult(), result -> {
            if (filePathCallback == null) return;
            Uri[] results = null;
            if (result.getResultCode() == Activity.RESULT_OK) {
                Intent data = result.getData();
                if (data != null) {
                    String dataString = data.getDataString();
                    if (dataString != null) {
                        results = new Uri[]{Uri.parse(dataString)};
                    }
                } else if (cameraImageUri != null) {
                    results = new Uri[]{cameraImageUri};
                }
            }
            filePathCallback.onReceiveValue(results);
            filePathCallback = null;
        });

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Status bar color matching app theme (#0A0A0F dark)
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
        getWindow().setStatusBarColor(Color.parseColor("#0A0A0F"));
        getWindow().setNavigationBarColor(Color.parseColor("#0A0A0F"));

        setContentView(R.layout.activity_main);

        webView = findViewById(R.id.webView);
        progressBar = findViewById(R.id.progressBar);
        swipeRefresh = findViewById(R.id.swipeRefresh);

        setupWebView();
        setupSwipeRefresh();

        // Request permissions
        requestStoragePermission();

        // Load app
        if (savedInstanceState != null) {
            webView.restoreState(savedInstanceState);
        } else {
            webView.loadUrl(APP_URL);
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    private void setupWebView() {
        WebSettings settings = webView.getSettings();

        // JavaScript
        settings.setJavaScriptEnabled(true);
        settings.setJavaScriptCanOpenWindowsAutomatically(true);

        // DOM Storage (needed for localStorage)
        settings.setDomStorageEnabled(true);

        // Database storage
        settings.setDatabaseEnabled(true);

        // Caching
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setAppCacheEnabled(true);

        // Media
        settings.setMediaPlaybackRequiresUserGesture(false);

        // Zoom
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);

        // Viewport
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);

        // Encoding
        settings.setDefaultTextEncodingName("UTF-8");

        // Mixed content (allow local assets)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        }

        // Allow file access
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowUniversalAccessFromFileURLs(true);

        // User agent with Arabic hint
        String ua = settings.getUserAgentString();
        settings.setUserAgentString(ua + " KayanStoreApp/2.0 Android");

        // WebViewClient
        webView.setWebViewClient(new KayanWebViewClient());

        // WebChromeClient (for JS dialogs, file upload, geolocation)
        webView.setWebChromeClient(new KayanWebChromeClient());

        // Background color matching app
        webView.setBackgroundColor(Color.parseColor("#0A0A0F"));

        // Hardware acceleration
        webView.setLayerType(View.LAYER_TYPE_HARDWARE, null);

        // JavaScript bridge
        webView.addJavascriptInterface(new AndroidBridge(this), "AndroidBridge");
    }

    private void setupSwipeRefresh() {
        swipeRefresh.setColorSchemeColors(
            Color.parseColor("#FF6B2B"),
            Color.parseColor("#FF8C42"),
            Color.parseColor("#FFB347")
        );
        swipeRefresh.setProgressBackgroundColorSchemeColor(Color.parseColor("#1A1A2E"));
        swipeRefresh.setOnRefreshListener(() -> {
            webView.reload();
        });
        // Disable pull-to-refresh when not at top
        webView.getViewTreeObserver().addOnScrollChangedListener(() -> {
            swipeRefresh.setEnabled(webView.getScrollY() == 0);
        });
    }

    // ===== WebViewClient =====
    private class KayanWebViewClient extends WebViewClient {

        @Override
        public void onPageStarted(WebView view, String url, Bitmap favicon) {
            super.onPageStarted(view, url, favicon);
            progressBar.setVisibility(View.VISIBLE);
            progressBar.setProgress(0);
        }

        @Override
        public void onPageFinished(WebView view, String url) {
            super.onPageFinished(view, url);
            progressBar.setVisibility(View.GONE);
            swipeRefresh.setRefreshing(false);

            // Inject Android detection JS
            view.evaluateJavascript(
                "window.isAndroidApp = true;" +
                "window.AndroidBridge = window.AndroidBridge || {};" +
                "document.documentElement.classList.add('android-app');",
                null
            );
        }

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
            String url = request.getUrl().toString();

            // Handle external links
            if (url.startsWith("http://") || url.startsWith("https://")) {
                Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                startActivity(intent);
                return true;
            }

            // Handle WhatsApp
            if (url.startsWith("whatsapp://") || url.startsWith("https://wa.me/")) {
                try {
                    startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url)));
                } catch (Exception e) {
                    Toast.makeText(MainActivity.this, "واتساب غير مثبت", Toast.LENGTH_SHORT).show();
                }
                return true;
            }

            // Handle tel:
            if (url.startsWith("tel:")) {
                startActivity(new Intent(Intent.ACTION_DIAL, Uri.parse(url)));
                return true;
            }

            // Handle mailto:
            if (url.startsWith("mailto:")) {
                startActivity(new Intent(Intent.ACTION_SENDTO, Uri.parse(url)));
                return true;
            }

            return false;
        }

        @Override
        public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
            super.onReceivedError(view, request, error);
            // Only show error for main frame
            if (request.isForMainFrame()) {
                view.loadUrl("about:blank");
                view.loadData(
                    "<html dir='rtl'><body style='background:#0A0A0F;color:#fff;font-family:sans-serif;text-align:center;padding:50px'>" +
                    "<h2>⚠️ خطأ في التحميل</h2><p>تحقق من الاتصال وحاول مجدداً</p>" +
                    "<button onclick='location.reload()' style='background:#FF6B2B;color:#fff;border:none;padding:12px 24px;border-radius:8px;font-size:16px'>إعادة المحاولة</button>" +
                    "</body></html>",
                    "text/html", "UTF-8"
                );
            }
        }
    }

    // ===== WebChromeClient =====
    private class KayanWebChromeClient extends WebChromeClient {

        @Override
        public void onProgressChanged(WebView view, int newProgress) {
            progressBar.setProgress(newProgress);
            if (newProgress == 100) {
                progressBar.setVisibility(View.GONE);
            }
        }

        @Override
        public boolean onJsAlert(WebView view, String url, String message, JsResult result) {
            // Let alerts pass through natively
            result.confirm();
            return false;
        }

        @Override
        public boolean onJsConfirm(WebView view, String url, String message, JsResult result) {
            result.confirm();
            return false;
        }

        // Geolocation permission
        @Override
        public void onGeolocationPermissionsShowPrompt(String origin, GeolocationPermissions.Callback callback) {
            callback.invoke(origin, true, false);
        }

        // File upload handler (Android 5+)
        @Override
        public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallback,
                                          FileChooserParams fileChooserParams) {
            if (MainActivity.this.filePathCallback != null) {
                MainActivity.this.filePathCallback.onReceiveValue(null);
            }
            MainActivity.this.filePathCallback = filePathCallback;

            Intent chooserIntent = fileChooserParams.createIntent();

            // Add camera option
            Intent cameraIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
            if (cameraIntent.resolveActivity(getPackageManager()) != null) {
                File photoFile = null;
                try {
                    photoFile = createImageFile();
                } catch (IOException ex) {
                    // ignore
                }
                if (photoFile != null) {
                    cameraImageUri = FileProvider.getUriForFile(
                        MainActivity.this,
                        getApplicationContext().getPackageName() + ".fileprovider",
                        photoFile
                    );
                    cameraIntent.putExtra(MediaStore.EXTRA_OUTPUT, cameraImageUri);
                }
            }

            Intent intentArray[] = {cameraIntent};
            Intent finalIntent = new Intent(Intent.ACTION_CHOOSER);
            finalIntent.putExtra(Intent.EXTRA_INTENT, chooserIntent);
            finalIntent.putExtra(Intent.EXTRA_TITLE, "اختر ملفاً");
            finalIntent.putExtra(Intent.EXTRA_INITIAL_INTENTS, intentArray);

            filePickerLauncher.launch(finalIntent);
            return true;
        }
    }

    // ===== JavaScript Bridge =====
    public static class AndroidBridge {
        private final Activity activity;

        AndroidBridge(Activity activity) {
            this.activity = activity;
        }

        @JavascriptInterface
        public void shareText(String text) {
            activity.runOnUiThread(() -> {
                Intent share = new Intent(Intent.ACTION_SEND);
                share.setType("text/plain");
                share.putExtra(Intent.EXTRA_TEXT, text);
                activity.startActivity(Intent.createChooser(share, "مشاركة عبر"));
            });
        }

        @JavascriptInterface
        public void openWhatsApp(String phone, String message) {
            activity.runOnUiThread(() -> {
                String url = "https://wa.me/" + phone + "?text=" + Uri.encode(message);
                Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                try {
                    activity.startActivity(intent);
                } catch (Exception e) {
                    Toast.makeText(activity, "واتساب غير مثبت", Toast.LENGTH_SHORT).show();
                }
            });
        }

        @JavascriptInterface
        public void vibrate() {
            // Vibration feedback
            android.os.Vibrator v = (android.os.Vibrator) activity.getSystemService(Activity.VIBRATOR_SERVICE);
            if (v != null && v.hasVibrator()) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    v.vibrate(android.os.VibrationEffect.createOneShot(50, android.os.VibrationEffect.DEFAULT_AMPLITUDE));
                } else {
                    v.vibrate(50);
                }
            }
        }

        @JavascriptInterface
        public String getDeviceInfo() {
            return "{\"model\":\"" + Build.MODEL + "\",\"version\":\"" + Build.VERSION.RELEASE + "\",\"app\":\"KayanStore\"}";
        }
    }

    // ===== Helpers =====
    private File createImageFile() throws IOException {
        String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss", Locale.getDefault()).format(new Date());
        String imageFileName = "KAYAN_" + timeStamp + "_";
        File storageDir = getExternalFilesDir(Environment.DIRECTORY_PICTURES);
        return File.createTempFile(imageFileName, ".jpg", storageDir);
    }

    private void requestStoragePermission() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE)
                != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(this,
                    new String[]{
                        Manifest.permission.READ_EXTERNAL_STORAGE,
                        Manifest.permission.WRITE_EXTERNAL_STORAGE
                    }, PERMISSION_REQUEST_CODE);
            }
        }
    }

    // ===== Back button =====
    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            // Ask before exit
            new androidx.appcompat.app.AlertDialog.Builder(this)
                .setTitle("كيان ستور")
                .setMessage("هل تريد الخروج من التطبيق؟")
                .setPositiveButton("خروج", (d, w) -> super.onBackPressed())
                .setNegativeButton("إلغاء", null)
                .show();
        }
    }

    @Override
    protected void onSaveInstanceState(@NonNull Bundle outState) {
        super.onSaveInstanceState(outState);
        webView.saveState(outState);
    }

    @Override
    protected void onResume() {
        super.onResume();
        webView.onResume();
        webView.resumeTimers();
    }

    @Override
    protected void onPause() {
        super.onPause();
        webView.onPause();
        webView.pauseTimers();
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            webView.stopLoading();
            webView.clearHistory();
            webView.removeAllViews();
            webView.destroy();
        }
        super.onDestroy();
    }
}
