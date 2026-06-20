<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // 1. Absennya Header Proteksi MIME Sniffing (X-Content-Type-Options)
        $response->headers->set('X-Content-Type-Options', 'nosniff');

        // 2. Absennya Kebijakan Enkripsi Paksa (Strict-Transport-Security / HSTS)
        if (config('app.env') === 'production' || $request->secure()) {
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
        }

        // 3. Absennya Kebijakan Sumber Aset (Content-Security-Policy / CSP)
        // 4. Penggunaan Header Proteksi Iframe yang Usang (X-Frame-Options Deprecated) -> frame-ancestors
        $cspDirectives = [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.bunny.net",
            "style-src 'self' 'unsafe-inline' https://fonts.bunny.net",
            "font-src 'self' https://fonts.bunny.net",
            "img-src 'self' data: https: blob:",
            "media-src 'self'",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "frame-ancestors 'self'",
        ];

        // For local development, allow Vite HMR connect-src (WebSocket and HTTP)
        if (config('app.env') === 'local') {
            $cspDirectives[] = "connect-src 'self' ws: wss: http://localhost:* ws://localhost:* http://127.0.0.1:* ws://127.0.0.1:* https:";
        } else {
            $cspDirectives[] = "connect-src 'self' https:";
        }

        $response->headers->set('Content-Security-Policy', implode('; ', $cspDirectives));

        // Legacy clickjacking protection
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');

        // 5. Absennya Pengontrol Informasi Rujukan (Referrer-Policy)
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');

        // 6. Kebocoran Informasi Perangkat Keras (Permissions-Policy)
        $response->headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), vr=()');

        // Extra standard security headers
        $response->headers->set('X-XSS-Protection', '1; mode=block');

        return $response;
    }
}
