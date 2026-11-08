import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  Calculator,
  ClipboardList,
  UtensilsCrossed,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Layers,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';

export type Page = 'order/calculator' | 'order/history' | 'master/menu';

interface SidebarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
  mobileMenuOpen: boolean;
  savedOrdersCount: number;
}

interface NavLeaf {
  kind: 'leaf';
  label: string;
  page: Page;
  icon: React.ReactNode;
  badge?: number;
}

interface NavGroup {
  label: string;
  icon: React.ReactNode;
  entries: NavLeaf[];
}

function CollapsedTooltip({ label, children }: { label: string; children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.top + rect.height / 2,
        left: rect.right + 8,
      });
      setVisible(true);
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible &&
        createPortal(
          <div
            className="pointer-events-none fixed z-[1000]"
            style={{ top: coords.top, left: coords.left, transform: 'translateY(-50%)' }}
          >
            <div className="relative bg-gray-800 dark:bg-slate-700 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
              {label}
              <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-800 dark:border-r-slate-700" />
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

export default function Sidebar({ activePage, onNavigate, mobileMenuOpen, savedOrdersCount }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    'POS & Order': true,
    'Master Data': true,
  });

  const toggle = (key: string) => setExpanded(prev => ({ ...prev, [key]: !prev[key] }));

  const groups: NavGroup[] = [
    {
      label: 'POS & Order',
      icon: <ShoppingBag size={16} />,
      entries: [
        {
          kind: 'leaf',
          label: 'สร้างออเดอร์ & คำนวณราคา',
          page: 'order/calculator',
          icon: <Calculator size={15} />,
        },
        {
          kind: 'leaf',
          label: 'ประวัติรายการออเดอร์',
          page: 'order/history',
          icon: <ClipboardList size={15} />,
          badge: savedOrdersCount,
        },
      ],
    },
    {
      label: 'Master Data',
      icon: <Layers size={16} />,
      entries: [
        {
          kind: 'leaf',
          label: 'ข้อมูลเมนู & โปรโมชั่น',
          page: 'master/menu',
          icon: <UtensilsCrossed size={15} />,
        },
      ],
    },
  ];

  const W = collapsed ? 'w-16' : 'w-64';

  return (
    <aside
      style={{ minWidth: collapsed ? '4rem' : '16rem' }}
      className={`${W} bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-700/60 min-h-screen flex flex-col select-none shrink-0 transition-all duration-300 z-50 fixed inset-y-0 left-0 lg:static lg:translate-x-0 ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Brand Header (SCG New JCMS style) */}
      <div className="border-b border-gray-200 dark:border-slate-700/60 flex items-center justify-center px-4 py-4">
        {collapsed ? (
          <div className="w-9 h-9 rounded-xl bg-blue-900 text-white flex items-center justify-center font-black text-sm shadow-sm">
            PW
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-blue-900 text-white flex items-center justify-center font-black text-base shadow-sm shrink-0">
                PW
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base tracking-tight text-gray-900 dark:text-white">
                    PANWICH
                  </span>
                  <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-blue-900 text-white">
                    ORDER
                  </span>
                </div>
                <p className="text-gray-400 dark:text-slate-400 text-[10px] leading-tight tracking-wide">
                  KMUTT • CCC Order Management
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(c => !c)}
        className="flex items-center gap-2 mx-2 mt-2 px-3 py-2 rounded-lg text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-xs overflow-hidden whitespace-nowrap"
      >
        <span className="shrink-0">{collapsed ? <PanelLeftOpen size={15} /> : <PanelLeftClose size={15} />}</span>
        <span className={`overflow-hidden transition-all duration-300 ${collapsed ? 'w-0 opacity-0' : 'opacity-100'}`}>
          ย่อแถบเมนู (Collapse)
        </span>
      </button>

      {/* Navigation */}
      <nav
        className={`flex-1 py-2 px-2 overflow-y-auto ${
          collapsed ? '[&::-webkit-scrollbar]:hidden' : 'modern-scrollbar-dark'
        }`}
      >
        {collapsed ? (
          groups.map(group => (
            <div key={group.label} className="mb-3">
              <CollapsedTooltip label={group.label}>
                <div className="flex items-center justify-center py-1 opacity-40 text-gray-400 cursor-default">
                  {group.icon}
                </div>
              </CollapsedTooltip>
              <div className="space-y-1">
                {group.entries.map(item => (
                  <CollapsedTooltip key={item.page} label={item.label}>
                    <button
                      onClick={() => onNavigate(item.page)}
                      className={`w-full flex items-center justify-center p-2.5 rounded-lg transition-colors relative ${
                        activePage === item.page
                          ? 'bg-blue-900 dark:bg-blue-900/20 text-white dark:text-blue-400'
                          : 'text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-800 dark:text-white'
                      }`}
                    >
                      {item.icon}
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500" />
                      )}
                    </button>
                  </CollapsedTooltip>
                ))}
              </div>
            </div>
          ))
        ) : (
          groups.map(group => (
            <div key={group.label} className="mb-2">
              <button
                onClick={() => toggle(group.label)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-slate-200 transition-colors whitespace-nowrap"
              >
                <div className="flex items-center gap-2">
                  {group.icon}
                  {group.label}
                </div>
                {expanded[group.label] ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
              </button>

              {expanded[group.label] && (
                <div className="ml-2 mt-0.5 space-y-1">
                  {group.entries.map(entry => (
                    <button
                      key={entry.page}
                      onClick={() => onNavigate(entry.page)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors whitespace-nowrap ${
                        activePage === entry.page
                          ? 'bg-blue-900 dark:bg-blue-900/20 text-white dark:text-blue-400 font-medium'
                          : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-800 dark:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        {entry.icon}
                        <span className="truncate">{entry.label}</span>
                      </div>
                      {entry.badge !== undefined && entry.badge > 0 && (
                        <span
                          className={`ml-2 px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                            activePage === entry.page
                              ? 'bg-white/20 text-white'
                              : 'bg-blue-50 text-blue-900 dark:bg-slate-800 dark:text-blue-400'
                          }`}
                        >
                          {entry.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </nav>

      {/* Promo Summary Card in Sidebar Footer */}
      {!collapsed && (
        <div className="p-3 m-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700/60">
          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900 dark:text-blue-400 mb-1">
            <Sparkles size={13} />
            <span>เงื่อนไขราคา PANWICH</span>
          </div>
          <ul className="text-[11px] text-gray-600 dark:text-slate-300 space-y-1">
            <li className="flex justify-between">
              <span>• ราคาปกติ:</span>
              <span className="font-semibold text-gray-900 dark:text-white">25 บาท / ชิ้น</span>
            </li>
            <li className="flex justify-between text-emerald-700 dark:text-emerald-400 font-medium">
              <span>• โปรโมชั่น 3 ชิ้น:</span>
              <span className="font-bold">70 บาท (ลด 5.-)</span>
            </li>
            <li className="flex justify-between">
              <span>• เพิ่มท็อปปิ้ง:</span>
              <span className="font-semibold text-gray-900 dark:text-white">+5 บาท / อย่าง</span>
            </li>
          </ul>
        </div>
      )}
    </aside>
  );
}

