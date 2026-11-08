import { Bell, Sun, Moon, Menu } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface HeaderProps {
  title: string;
  breadcrumb?: string[];
  dark?: boolean;
  onMenuClick: () => void;
  onThemeToggle?: () => void;
}

export default function Header({ title, breadcrumb, dark, onMenuClick, onThemeToggle }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'โปรโมชั่นพิเศษ PANWICH', desc: 'ซื้อชิ้นละ 25 บาท พิเศษ 3 ชิ้นเพียง 70 บาท (ประหยัดทันที 5 บาท/ชุด)' },
    { id: 2, title: 'ระบบแยกท็อปปิ้งรายชิ้น', desc: 'สามารถเลือกผักและท็อปปิ้ง (+5 บ.) แยกของแต่ละชิ้นได้อย่างอิสระ' },
  ]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (dark) {
    return (
      <header className="bg-[#0b1520] border-b border-slate-700/60 px-6 py-3.5 flex items-center justify-between shrink-0 gap-3">
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center text-xs font-bold text-white shrink-0">
            PW
          </div>
          <span className="font-bold text-slate-100 text-sm tracking-wide">PANWICH ORDER</span>
        </div>
        <div className="flex-1 min-w-0 px-4 flex items-baseline gap-2 truncate whitespace-nowrap">
          {breadcrumb && breadcrumb.length > 0 && (
            <span className="text-sm text-slate-500">
              {breadcrumb.join(' / ')} /
            </span>
          )}
          <h1 className="text-xl font-bold text-slate-200">{title}</h1>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2.5 cursor-pointer group">
            <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center text-xs font-bold text-white shrink-0">
              PW
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-xs font-semibold text-slate-200 leading-tight">PANWICH POS</p>
              <p className="text-[10px] text-slate-500 leading-tight">KMUTT • CCC Cashier</p>
            </div>
          </div>
          <button
            onClick={onThemeToggle}
            title="สลับโหมดสีสว่าง/มืด"
            className="w-8 h-8 flex items-center justify-center text-white hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Sun size={16} />
          </button>
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative w-8 h-8 flex items-center justify-center text-white hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Bell size={17} />
              {notifications.length > 0 && <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />}
            </button>

            <div
              className={`absolute right-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-lg z-50 overflow-hidden origin-top-right transition-all duration-200 ease-out ${
                showNotifications ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
              }`}
            >
              <div className="p-3 border-b border-slate-700 flex justify-between items-center">
                <span className="font-semibold text-slate-200 text-sm">การแจ้งเตือนระบบ</span>
                {notifications.length > 0 && (
                  <button onClick={() => setNotifications([])} className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                    ล้างทั้งหมด
                  </button>
                )}
              </div>
              <div className="p-3 text-sm text-slate-400 max-h-[300px] overflow-y-auto modern-scrollbar-dark">
                {notifications.length > 0 ? (
                  notifications.map(notif => (
                    <div key={notif.id} className="py-2 border-b border-slate-700/50 last:border-0">
                      <p className="text-slate-200 font-medium text-xs mb-1">{notif.title}</p>
                      <p className="text-xs">{notif.desc}</p>
                    </div>
                  ))
                ) : (
                  <div className="py-4 text-center text-slate-500 text-xs">ไม่มีการแจ้งเตือนใหม่</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between shrink-0 gap-3">
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center text-xs font-bold text-white shrink-0">
          PW
        </div>
        <span className="font-bold text-gray-900 text-sm tracking-wide">PANWICH ORDER</span>
      </div>
      <div className="flex-1 min-w-0 px-4 flex items-baseline gap-2 truncate whitespace-nowrap">
        {breadcrumb && breadcrumb.length > 0 && (
          <span className="text-sm text-gray-500">
            {breadcrumb.join(' / ')} /
          </span>
        )}
        <h1 className="text-xl font-bold text-gray-800">{title}</h1>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-2.5 cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center text-xs font-bold text-white shrink-0">
            PW
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-xs font-semibold text-gray-800 leading-tight">PANWICH POS</p>
            <p className="text-[10px] text-gray-400 leading-tight">KMUTT • CCC Cashier</p>
          </div>
        </div>
        <button
          onClick={onThemeToggle}
          title="สลับโหมดสีสว่าง/มืด"
          className="relative w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Moon size={17} />
        </button>
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Bell size={17} />
            {notifications.length > 0 && <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />}
          </button>

          <div
            className={`absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden origin-top-right transition-all duration-200 ease-out ${
              showNotifications ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
            }`}
          >
            <div className="p-3 border-b border-gray-100 flex justify-between items-center">
              <span className="font-semibold text-gray-800 text-sm">การแจ้งเตือนระบบ</span>
              {notifications.length > 0 && (
                <button onClick={() => setNotifications([])} className="text-xs text-blue-900 hover:text-blue-500 transition-colors">
                  ล้างทั้งหมด
                </button>
              )}
            </div>
            <div className="p-3 text-sm text-gray-500 max-h-[300px] overflow-y-auto modern-scrollbar">
              {notifications.length > 0 ? (
                notifications.map(notif => (
                  <div key={notif.id} className="py-2 border-b border-gray-100 last:border-0">
                    <p className="text-gray-800 font-medium text-xs mb-1">{notif.title}</p>
                    <p className="text-xs">{notif.desc}</p>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-gray-400 text-xs">ไม่มีการแจ้งเตือนใหม่</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

