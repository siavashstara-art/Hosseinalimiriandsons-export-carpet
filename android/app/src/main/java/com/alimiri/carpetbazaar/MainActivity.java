package com.alimiri.carpetbazaar;

import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Security hardening for embedded WebView
        try {
            // Disable remote web contents debugging in production
            WebView.setWebContentsDebuggingEnabled(false);

            if (this.bridge != null && this.bridge.getWebView() != null) {
                WebView webView = this.bridge.getWebView();
                WebSettings settings = webView.getSettings();

                // Disallow arbitrary file access
                settings.setAllowFileAccess(false);
                settings.setAllowContentAccess(false);
                settings.setAllowFileAccessFromFileURLs(false);
                settings.setAllowUniversalAccessFromFileURLs(false);

                // Strictly disallow mixed HTTP/HTTPS content
                settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
            }
        } catch (Exception ignored) {
            // Log defensively without leaking internal state
        }
    }
}
