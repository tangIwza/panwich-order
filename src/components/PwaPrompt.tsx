import { useState, useEffect } from 'react';
import { Download, RefreshCw, WifiOff, CheckCircle2, X } from 'lucide-react';
import { useRegisterSW } from 'virtual:pwa-register/react';

export default function PwaPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // SW auto-update and refresh check
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      // Periodically check for updates every hour
      if (r) {
        setInterval(() => {
          r.update();
        }, 60 * 60 * 1000);
      }
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  // Track online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Listen for beforeinstallprompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if already in standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    if (isStandalone) {
      setIsInstallable(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
      setShowInstallBanner(false);
    }
    setDeferredPrompt(null);
  };

  return (
    <>
      {/* Offline Status Toast */}
      {isOffline && (
        <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 bg-amber-600 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-medium animate-bounce-subtle">
          <WifiOff size={16} className="shrink-0" />
          <span>โหมดออฟไลน์: ใช้งานและบันทึกออเดอร์ในเครื่องได้ตามปกติ</span>
        </div>
      )}

      {/* Service Worker Update Prompt */}
      {needRefresh && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-3 bg-slate-900 border border-blue-500/50 text-white px-4 py-3 rounded-2xl shadow-2xl">
          <div className="flex items-center gap-2 text-xs">
            <RefreshCw size={15} className="animate-spin text-blue-400" />
            <span>มีเวอร์ชันใหม่ของ PANWICH</span>
          </div>
          <button
            onClick={() => updateServiceWorker(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-sm"
          >
            อัปเดตเลย
          </button>
          <button
            onClick={() => setNeedRefresh(false)}
            className="text-slate-400 hover:text-white p-1"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Offline Ready Notification */}
      {offlineReady && !needRefresh && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2.5 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-medium animate-fade-in">
          <CheckCircle2 size={16} />
          <span>PANWICH พร้อมใช้งานแบบออฟไลน์แล้ว</span>
          <button onClick={() => setOfflineReady(false)} className="text-white/80 hover:text-white ml-2">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Install PWA Prompt Banner */}
      {isInstallable && showInstallBanner && !dismissed && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md bg-gradient-to-r from-blue-900 to-indigo-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-blue-400/30 flex items-center justify-between gap-3 backdrop-blur-md">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-white/10 p-1 flex items-center justify-center shrink-0 border border-white/20">
              <img src="/pwa-192x192.png" alt="Panwich Logo" className="w-8 h-8 rounded-lg object-contain" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-xs truncate">ติดตั้ง PANWICH ORDER</p>
              <p className="text-[11px] text-blue-200 truncate">เปิดได้เต็มจอ รวดเร็ว ไม่ต้องใช้อินเทอร์เน็ต</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleInstallClick}
              className="bg-white text-blue-950 hover:bg-blue-50 font-bold text-xs px-3 py-1.5 rounded-xl transition-all shadow flex items-center gap-1.5"
            >
              <Download size={13} />
              ติดตั้ง
            </button>
            <button
              onClick={() => {
                setShowInstallBanner(false);
                setDismissed(true);
              }}
              className="text-white/70 hover:text-white p-1 rounded-lg"
              title="ปิด"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
