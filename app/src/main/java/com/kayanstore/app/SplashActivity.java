package com.kayanstore.app;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.WindowManager;
import android.view.animation.AlphaAnimation;
import android.view.animation.Animation;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;

public class SplashActivity extends AppCompatActivity {

    private static final int SPLASH_DURATION = 2000; // 2 seconds

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Full screen
        getWindow().setFlags(
            WindowManager.LayoutParams.FLAG_FULLSCREEN,
            WindowManager.LayoutParams.FLAG_FULLSCREEN
        );

        setContentView(R.layout.activity_splash);

        // Fade-in animation
        Animation fadeIn = new AlphaAnimation(0f, 1f);
        fadeIn.setDuration(800);
        fadeIn.setFillAfter(true);

        ImageView logo = findViewById(R.id.splash_logo);
        TextView title = findViewById(R.id.splash_title);
        TextView subtitle = findViewById(R.id.splash_subtitle);

        if (logo != null) logo.startAnimation(fadeIn);
        if (title != null) title.startAnimation(fadeIn);
        if (subtitle != null) subtitle.startAnimation(fadeIn);

        // Navigate to MainActivity after delay
        new Handler(Looper.getMainLooper()).postDelayed(() -> {
            Intent intent = new Intent(SplashActivity.this, MainActivity.class);
            startActivity(intent);
            finish();
            // Smooth transition
            overridePendingTransition(android.R.anim.fade_in, android.R.anim.fade_out);
        }, SPLASH_DURATION);
    }
}
