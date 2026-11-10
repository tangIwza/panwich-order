import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
// @ts-ignore
import generatePayload from 'promptpay-qr';
import {
  Plus,
  Minus,
  Trash2,
  Copy,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Moon,
  Sun,
  Globe,
  HelpCircle,
  Receipt,
  Check,
  QrCode,
  Smartphone,
} from 'lucide-react';
import {
  TOPPING_OPTIONS,
  calculateOrderPrice,
} from '../data/menuData';
import type {
  MenuId,
  ToppingId,
  OrderItem,
  SavedOrder,
} from '../types';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';

interface OrderCalculatorProps {
  onSaveOrder: (order: SavedOrder) => void;
  nextOrderNumber: string;
}

export function MenuIcon({ menuId, size = 18 }: { menuId: MenuId; size?: number }) {
  switch (menuId) {
    case 'moon':
      return <Moon size={size} className="text-indigo-600 dark:text-indigo-400 shrink-0" />;
    case 'sun':
      return <Sun size={size} className="text-amber-500 dark:text-amber-400 shrink-0" />;
    case 'earth':
      return <Globe size={size} className="text-emerald-600 dark:text-emerald-400 shrink-0" />;
    case 'alien':
      return <HelpCircle size={size} className="text-purple-600 dark:text-purple-400 shrink-0" />;
  }
}

export default function OrderCalculator({ onSaveOrder, nextOrderNumber }: OrderCalculatorProps) {
  // Dynamic list of individual sandwich pieces
  const [items, setItems] = useState<OrderItem[]>([
    {
      id: 'item-1',
      menuId: 'moon',
      veggies: ['all'],
      toppings: [],
      itemNote: '',
    },
  ]);

  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [orderSavedToast, setOrderSavedToast] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const calculation = calculateOrderPrice(items);
  const PROMPTPAY_PHONE = '0631468293';
  const PROMPTPAY_DISPLAY = '06-3146-8293';

  // Generate PromptPay QR code whenever modal opens or grandTotal changes
  useEffect(() => {
    if (showSummaryModal && calculation.grandTotal > 0) {
      try {
        const payload = generatePayload(PROMPTPAY_PHONE, { amount: calculation.grandTotal });
        QRCode.toDataURL(payload, {
          width: 320,
          margin: 1.5,
          color: {
            dark: '#002b49', // PromptPay dark navy theme
            light: '#ffffff',
          },
        }).then(url => {
          setQrDataUrl(url);
        });
      } catch (err) {
        console.error('Error generating PromptPay QR:', err);
      }
    }
  }, [showSummaryModal, calculation.grandTotal]);

  // Add a new sandwich piece
  const handleAddBlankPiece = () => {
    const newItem: OrderItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      menuId: 'moon',
      veggies: ['all'],
      toppings: [],
      itemNote: '',
    };
    setItems(prev => [...prev, newItem]);
  };

  // Quick add 3 pieces (1 promo bundle set)
  const handleAddBundle = () => {
    const newItems: OrderItem[] = Array.from({ length: 3 }, (_, i) => ({
      id: `item-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
      menuId: 'moon',
      veggies: ['all'],
      toppings: [],
      itemNote: '',
    }));
    setItems(prev => {
      // If there is currently only 1 untouched initial piece (no toppings), replace it so total is exactly 3 pieces
      if (prev.length === 1 && prev[0].toppings.length === 0) {
        return newItems;
      }
      return [...prev, ...newItems];
    });
  };

  // Duplicate an existing piece
  const handleDuplicatePiece = (item: OrderItem) => {
    const copy: OrderItem = {
      ...item,
      id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      veggies: [...item.veggies],
      toppings: [...item.toppings],
    };
    setItems(prev => [...prev, copy]);
  };

  // Remove a piece
  const handleRemovePiece = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  // Add 1 topping (+5 THB each, allows multiple)
  const handleAddTopping = (id: string, toppingId: ToppingId) => {
    setItems(prev =>
      prev.map(item => {
        if (item.id !== id) return item;
        return {
          ...item,
          toppings: [...item.toppings, toppingId],
        };
      })
    );
  };

  // Remove 1 topping (decreases quantity by 1)
  const handleRemoveTopping = (id: string, toppingId: ToppingId) => {
    setItems(prev =>
      prev.map(item => {
        if (item.id !== id) return item;
        const index = item.toppings.indexOf(toppingId);
        if (index === -1) return item;
        const nextToppings = [...item.toppings];
        nextToppings.splice(index, 1);
        return {
          ...item,
          toppings: nextToppings,
        };
      })
    );
  };

  // Toggle topping from box click: if 0 -> set to 1, if >0 -> remove all
  const handleToggleToppingBox = (id: string, toppingId: ToppingId) => {
    setItems(prev =>
      prev.map(item => {
        if (item.id !== id) return item;
        const count = item.toppings.filter(t => t === toppingId).length;
        if (count === 0) {
          return {
            ...item,
            toppings: [...item.toppings, toppingId],
          };
        } else {
          return {
            ...item,
            toppings: item.toppings.filter(t => t !== toppingId),
          };
        }
      })
    );
  };

  // Reset order
  const handleResetOrder = () => {
    setItems([
      {
        id: `item-${Date.now()}`,
        menuId: 'moon',
        veggies: ['all'],
        toppings: [],
        itemNote: '',
      },
    ]);
  };

  // Confirm save
  const handleConfirmSaveOrder = () => {
    if (items.length === 0) return;
    const saved: SavedOrder = {
      id: `ORD-${Date.now()}`,
      createdAt: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      customer: {
        orderNo: nextOrderNumber,
        customerName: 'ลูกค้าหน้าร้าน',
        section: '',
        phone: '',
        note: '',
      },
      items: [...items],
      calculation,
      status: 'Completed',
    };
    onSaveOrder(saved);
    setShowSummaryModal(false);
    setOrderSavedToast(true);
    setTimeout(() => setOrderSavedToast(false), 3500);

    setItems([
      {
        id: `item-${Date.now()}`,
        menuId: 'moon',
        veggies: ['all'],
        toppings: [],
        itemNote: '',
      },
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-5 md:p-6 space-y-4 sm:space-y-6 pb-28 sm:pb-32">
      {/* Toast Notification */}
      {orderSavedToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-medium animate-bounce w-[90%] max-w-sm justify-center">
          <CheckCircle2 size={18} />
          <span>บันทึกออเดอร์เรียบร้อยแล้ว!</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
            PW
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-gray-900 tracking-tight">
                PANWICH ORDER
              </h1>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-900 border border-blue-200">
                25฿ / 3 ชิ้น 70฿
              </span>
            </div>
            <p className="text-xs text-gray-500">
              กดเพิ่มจำนวนชิ้นและเลือกท็อปปิ้ง (+5฿) แยกแต่ละชิ้นได้อิสระ
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={handleResetOrder}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-colors active:scale-95"
          >
            <RotateCcw size={14} />
            ล้างรายการ
          </button>
          <button
            type="button"
            onClick={handleAddBundle}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold rounded-xl transition-colors active:scale-95"
            title="เพิ่ม 3 ชิ้น (1 ชุดโปร 70฿)"
          >
            <Sparkles size={14} className="text-emerald-600" />
            +3 ชิ้น (โปร 70฿)
          </button>
          <button
            type="button"
            onClick={handleAddBlankPiece}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold rounded-xl shadow-sm transition-colors active:scale-95"
          >
            <Plus size={16} />
            +1 ชิ้น (25฿)
          </button>
        </div>
      </div>

      {/* SINGLE COLUMN: List of Sandwich Piece Cards (Optimized for Mobile, iPad, and Touch) */}
      <div className="space-y-3 sm:space-y-4">
        {items.map((item, idx) => {
          const bundleGroupIndex = Math.floor(idx / 3) + 1;
          const isPartOfCompleteBundle = Math.floor(idx / 3) < calculation.bundleSets;
          const itemToppingCost = item.toppings.length * 5;

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all hover:border-gray-200"
            >
              {/* Card Header: Piece # + Bundle Badge + Actions */}
              <div className="px-4 py-3 bg-gray-50/70 border-b border-gray-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg bg-blue-900 text-white font-extrabold text-xs shadow-xs">
                    ชิ้นที่ {idx + 1}
                  </span>
                  {isPartOfCompleteBundle ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                      <Sparkles size={11} /> ในชุดโปร #{bundleGroupIndex}
                    </span>
                  ) : (
                    <span className="text-[11px] text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded-md">
                      ชิ้นเดี่ยว (25฿)
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleDuplicatePiece(item)}
                    title="คัดลอกชิ้นนี้"
                    className="p-2 hover:bg-blue-50 text-gray-500 hover:text-blue-900 rounded-lg transition-colors active:scale-90"
                  >
                    <Copy size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemovePiece(item.id)}
                    title="ลบชิ้นนี้"
                    disabled={items.length <= 1}
                    className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-600 disabled:opacity-30 disabled:hover:bg-transparent rounded-lg transition-colors active:scale-90"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Card Body: Toppings Selection with Stepper (Allows Multiple) */}
              <div className="p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                      เลือกท็อปปิ้ง (+5 บาท/อย่าง)
                    </label>
                    <p className="text-[11px] text-gray-400">กดปุ่ม + เพื่อเพิ่มจำนวนได้หลายชิ้นตามต้องการ</p>
                  </div>
                  {item.toppings.length > 0 && (
                    <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                      +{itemToppingCost} บาท ({item.toppings.length} อย่าง)
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {TOPPING_OPTIONS.map(top => {
                    const count = item.toppings.filter(t => t === top.id).length;
                    return (
                      <div
                        key={top.id}
                        onClick={() => handleToggleToppingBox(item.id, top.id)}
                        className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-2.5 cursor-pointer select-none active:scale-[0.99] ${
                          count > 0
                            ? 'bg-amber-50/90 border-amber-400 ring-2 ring-amber-400/30 shadow-xs'
                            : 'bg-gray-50/70 border-gray-200 hover:border-gray-300 hover:bg-gray-100/60'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <div
                            className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                              count > 0
                                ? 'bg-amber-500 border-amber-500 text-white shadow-2xs'
                                : 'border-gray-300 bg-white'
                            }`}
                          >
                            {count > 0 && <Check size={11} strokeWidth={3} />}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-sm text-gray-800 whitespace-nowrap">
                              {top.name}
                            </p>
                            <p className="text-[11px] text-amber-700 font-semibold">
                              +5฿ {count > 1 && <span className="text-gray-500 font-normal">({count * 5}฿)</span>}
                            </p>
                          </div>
                        </div>

                        {/* Stepper Controls: Minus, Count, Plus */}
                        <div
                          onClick={e => e.stopPropagation()}
                          className="flex items-center gap-1.5 shrink-0 bg-white p-1 rounded-lg border border-gray-200 shadow-2xs"
                        >
                          <button
                            type="button"
                            disabled={count === 0}
                            onClick={e => {
                              e.stopPropagation();
                              handleRemoveTopping(item.id, top.id);
                            }}
                            className="w-8 h-8 rounded-md flex items-center justify-center font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-20 disabled:hover:bg-transparent active:scale-90 transition-all touch-manipulation"
                            title={`ลด ${top.name}`}
                          >
                            <Minus size={15} />
                          </button>

                          <span
                            className={`w-6 text-center text-sm font-black tabular-nums ${
                              count > 0 ? 'text-amber-900 font-black' : 'text-gray-300'
                            }`}
                          >
                            {count}
                          </span>

                          <button
                            type="button"
                            onClick={e => {
                              e.stopPropagation();
                              handleAddTopping(item.id, top.id);
                            }}
                            className="w-8 h-8 rounded-md bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white flex items-center justify-center font-bold shadow-xs active:scale-90 transition-all touch-manipulation"
                            title={`เพิ่ม ${top.name}`}
                          >
                            <Plus size={15} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Price Breakdown Summary Card */ }
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Receipt size={18} className="text-blue-900" />
                <h2 className="text-sm font-bold text-gray-900">
                  รายละเอียดการคิดราคา (PRICE BREAKDOWN)
                </h2>
              </div>
              <StatusBadge status={calculation.bundleSets > 0 ? 'Promo' : 'Regular'} />
            </div>

            {/* Calculation Lines */}
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between text-gray-600">
                <span>ราคาเมนูปกติ ({calculation.totalPieces} ชิ้น × 25฿):</span>
                <span className="font-medium">{calculation.regularBasePrice} บาท</span>
              </div>

              {calculation.bundleSets > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200/60">
                  <span className="flex items-center gap-1">
                    <Sparkles size={14} />
                    โปรโมชั่น 3 ชิ้น 70฿ ({calculation.bundleSets} ชุด = {calculation.bundleSets * 3} ชิ้น):
                  </span>
                  <span>ลดทันที -{calculation.discountSaved} บาท</span>
                </div>
              )}

              <div className="flex justify-between text-gray-800 font-bold">
                <span>
                  รวมค่าเมนูหลัก{' '}
                  {calculation.bundleSets > 0 &&
                    `(${calculation.bundleSets}×70฿${calculation.remainingPieces > 0 ? ` + ${calculation.remainingPieces}×25฿` : ''
                    })`}
                  :
                </span>
                <span>{calculation.discountedBasePrice} บาท</span>
              </div>

              <div className="flex justify-between text-amber-800 font-medium">
                <span>
                  รวมค่าท็อปปิ้งทั้งหมด ({calculation.totalToppingsCount} อย่าง × 5฿):
                </span>
                <span className="font-bold">+{calculation.totalToppingsPrice} บาท</span>
              </div>
            </div>

            {/* Total Banner */}
            <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider block">
                  สรุปยอดตามใบออเดอร์
                </span>
                <span className="text-sm sm:text-base font-extrabold text-gray-800">
                  รวม <span className="text-blue-900 underline">{calculation.totalPieces}</span> ชิ้น /{' '}
                  <span className="text-blue-900 underline">{calculation.grandTotal}</span> บาท
                </span>
              </div>
              <div className="text-right">
                <span className="text-2xl sm:text-3xl font-black text-blue-900">
                  ฿{calculation.grandTotal}
                </span>
              </div>
            </div>
          </div>

          {/* Floating Bottom Bar for Mobile & iPad with Instant CTA */ }
          <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-3 z-40 shadow-lg">
            <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
              <div>
                <span className="text-[11px] text-gray-500 block leading-tight">
                  รวม {calculation.totalPieces} ชิ้น {calculation.bundleSets > 0 && `(โปร ${calculation.bundleSets} ชุด)`}
                </span>
                <span className="text-xl sm:text-2xl font-black text-blue-900">
                  ฿{calculation.grandTotal}
                </span>
              </div>

              <button
                type="button"
                disabled={items.length === 0}
                onClick={() => setShowSummaryModal(true)}
                className="flex-1 sm:flex-initial py-3 px-5 sm:px-8 bg-blue-900 hover:bg-blue-950 active:scale-95 disabled:bg-gray-300 text-white font-bold text-sm sm:text-base rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <QrCode size={20} className="text-white" />
                <span>สร้าง QR Code พร้อมเพย์</span>
              </button>
            </div>
          </div>

          {/* Modal: สแกนจ่ายพร้อมเพย์ PromptPay QR & สรุปออเดอร์ */ }
          {
            showSummaryModal && (
              <Modal
                title="สแกนจ่ายผ่าน PromptPay QR Code"
                onClose={() => setShowSummaryModal(false)}
                size="md"
              >
                <div className="space-y-4">
                  {/* PromptPay Official Card */}
                  <div className="bg-white rounded-2xl border-2 border-blue-900/20 shadow-sm p-4 sm:p-5 flex flex-col items-center text-center">
                    {/* PromptPay Top Branding Header */}
                    <div className="w-full flex items-center justify-between pb-3 border-b border-gray-100">
                      <div className="flex items-center gap-2 text-left">
                        <div className="w-8 h-8 rounded-lg bg-[#002b49] text-white flex items-center justify-center font-bold text-xs">
                          PP
                        </div>
                        <div>
                          <span className="font-extrabold text-sm text-[#002b49] tracking-tight block">
                            พร้อมเพย์ (PromptPay)
                          </span>
                          <span className="text-[11px] text-gray-500">
                            เบอร์โทร: <strong className="text-gray-900 font-mono text-xs">{PROMPTPAY_DISPLAY}</strong>
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-gray-400 block uppercase">ยอดชำระ</span>
                        <span className="text-xl font-black text-blue-900">฿{calculation.grandTotal}</span>
                      </div>
                    </div>

                    {/* QR Code Canvas */}
                    <div className="my-4 p-3 bg-white rounded-2xl border-2 border-gray-100 shadow-inner flex flex-col items-center">
                      {qrDataUrl ? (
                        <img
                          src={qrDataUrl}
                          alt="PromptPay QR Code"
                          className="w-56 h-56 sm:w-64 sm:h-64 object-contain rounded-lg"
                        />
                      ) : (
                        <div className="w-56 h-56 flex items-center justify-center text-gray-400 text-xs">
                          กำลังสร้าง QR Code...
                        </div>
                      )}
                      <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-[#002b49]">
                        <Smartphone size={14} />
                        <span>สแกนจ่ายได้ทุกแอปธนาคาร</span>
                      </div>
                    </div>

                    {/* Price Details Badge */}
                    <div className="w-full py-2 px-3 rounded-xl bg-blue-50/70 border border-blue-200/60 flex items-center justify-between text-xs">
                      <span className="text-gray-600">
                        PANWICH ({calculation.totalPieces} ชิ้น {calculation.totalToppingsCount > 0 ? `+ ${calculation.totalToppingsCount} ท็อปปิ้ง` : ''})
                      </span>
                      <span className="font-extrabold text-blue-900 text-sm">
                        {calculation.grandTotal}.00 บาท
                      </span>
                    </div>
                  </div>

                  {/* Modal Action Buttons */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setShowSummaryModal(false)}
                      className="w-full py-2.5 text-xs sm:text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors active:scale-98"
                    >
                      ปิดหน้าต่าง
                    </button>
                  </div>
                </div>
              </Modal>
            )
          }
    </div>
      );
}
