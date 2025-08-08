import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('✅ SaintVisionAI PWA: Service Worker registered successfully');
      
      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('📱 New SaintVisionAI app version available');
            }
          });
        }
      });
    } catch (error) {
      console.log('❌ SaintVisionAI PWA: Service Worker registration failed:', error);
    }
  });
}

// PWA install prompt handling
let deferredPrompt: any;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  console.log('📱 SaintVisionAI PWA install prompt ready');
});

// PWA install success tracking
window.addEventListener('appinstalled', () => {
  console.log('🎉 SaintVisionAI PWA installed successfully');
  deferredPrompt = null;
});

createRoot(document.getElementById("root")!).render(<App />);
