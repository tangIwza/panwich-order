import { useState } from 'react';
import { Search, Eye, Trash2, ClipboardList, PlusCircle } from 'lucide-react';
import type { SavedOrder } from '../types';
import { MENU_OPTIONS, VEGGIE_OPTIONS, TOPPING_OPTIONS } from '../data/menuData';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';

interface OrderHistoryProps {
  orders: SavedOrder[];
  onDeleteOrder: (id: string) => void;
  onCreateNew: () => void;
}

export default function OrderHistory({ orders, onDeleteOrder, onCreateNew }: OrderHistoryProps) {
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<SavedOrder | null>(null);

  const filtered = orders.filter(o =>
    `${o.customer.orderNo} ${o.customer.customerName} ${o.customer.section} ${o.customer.phone}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalRevenue = orders.reduce((sum, o) => sum + o.calculation.grandTotal, 0);
  const totalSandwiches = orders.reduce((sum, o) => sum + o.calculation.totalPieces, 0);

  return (
    <div className="p-6 space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
            ออเดอร์ทั้งหมด (TOTAL ORDERS)
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">{orders.length}</span>
            <span className="text-xs text-gray-400">บิล</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
            จำนวนที่ขายแล้ว (TOTAL PIECES SOLD)
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-700">{totalSandwiches}</span>
            <span className="text-xs text-gray-400">ชิ้น</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
            ยอดขายสะสม (TOTAL REVENUE)
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-blue-900">฿{totalRevenue.toLocaleString()}</span>
            <span className="text-xs text-gray-400">บาท</span>
          </div>
        </div>
      </div>

      {/* SCG JCMS Table Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex flex-wrap items-center justify-between px-5 py-4 border-b border-gray-100 gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="ค้นหาเลขที่, ชื่อลูกค้า, ภาค..."
              className="pl-8 pr-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 w-64"
            />
          </div>
          <button
            onClick={onCreateNew}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-900 hover:bg-blue-950 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <PlusCircle size={15} />
            สร้างออเดอร์ใหม่
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100">
                <th className="px-5 py-3 text-left font-medium">No.</th>
                <th className="px-5 py-3 text-left font-medium">เวลา</th>
                <th className="px-5 py-3 text-left font-medium">ชื่อลูกค้า / ภาค</th>
                <th className="px-5 py-3 text-left font-medium">รายการเมนู (แยกชิ้น)</th>
                <th className="px-5 py-3 text-center font-medium">จำนวน</th>
                <th className="px-5 py-3 text-right font-medium">ราคารวม</th>
                <th className="px-5 py-3 text-center font-medium">สถานะ</th>
                <th className="px-5 py-3 text-center font-medium">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(order => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3 font-bold text-blue-900">
                    #{order.customer.orderNo}
                  </td>
                  <td className="px-5 py-3 text-gray-500 text-xs">{order.createdAt}</td>
                  <td className="px-5 py-3">
                    <div className="font-medium text-gray-800">{order.customer.customerName}</div>
                    <div className="text-xs text-gray-400">
                      {order.customer.section || '-'} {order.customer.phone && `• ${order.customer.phone}`}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-1 max-w-md">
                      {order.items.map((item, idx) => {
                        const m = MENU_OPTIONS.find(x => x.id === item.menuId);
                        return (
                          <span
                            key={item.id}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-xs"
                          >
                            <strong>#{idx + 1} {m?.name}</strong>
                            {item.toppings.length > 0 && (
                              <span className="text-amber-700 font-semibold">
                                (+{item.toppings.length} ท็อปปิ้ง)
                              </span>
                            )}
                          </span>
                        );
                      })}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-center font-semibold text-gray-800">
                    {order.calculation.totalPieces} ชิ้น
                  </td>
                  <td className="px-5 py-3 text-right font-bold text-blue-900">
                    {order.calculation.grandTotal} บาท
                  </td>
                  <td className="px-5 py-3 text-center">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        title="ดูรายละเอียด"
                        className="p-1.5 hover:bg-blue-50 text-gray-400 hover:text-blue-900 rounded-lg transition-colors"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        onClick={() => onDeleteOrder(order.id)}
                        title="ลบออเดอร์"
                        className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-gray-400 text-sm">
                    <div className="flex flex-col items-center gap-2">
                      <ClipboardList size={26} className="stroke-1" />
                      <span>ยังไม่มีประวัติออเดอร์ที่บันทึกไว้</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 border-t border-gray-50 text-xs text-gray-400">
          แสดง {filtered.length} จากทั้งหมด {orders.length} รายการ
        </div>
      </div>

      {/* View Order Detail Modal */}
      {selectedOrder && (
        <Modal
          title={`รายละเอียดออเดอร์ No. ${selectedOrder.customer.orderNo} (${selectedOrder.customer.customerName})`}
          onClose={() => setSelectedOrder(null)}
          size="lg"
        >
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase">
                    <th className="px-3 py-2 text-left">ชิ้นที่</th>
                    <th className="px-3 py-2 text-left">เมนู</th>
                    <th className="px-3 py-2 text-left">ผัก</th>
                    <th className="px-3 py-2 text-left">ท็อปปิ้ง (+5฿)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {selectedOrder.items.map((item, i) => {
                    const m = MENU_OPTIONS.find(x => x.id === item.menuId);
                    const vegText = item.veggies.includes('all')
                      ? 'ทุกอย่าง'
                      : item.veggies.includes('none')
                      ? 'ไม่ใส่ผัก'
                      : item.veggies
                          .map(vid => VEGGIE_OPTIONS.find(v => v.id === vid)?.name)
                          .join(', ');
                    const toppingCounts: Record<string, number> = {};
                    item.toppings.forEach(tid => {
                      toppingCounts[tid] = (toppingCounts[tid] || 0) + 1;
                    });
                    const topText =
                      Object.keys(toppingCounts).length > 0
                        ? Object.entries(toppingCounts)
                            .map(([tid, count]) => {
                              const name = TOPPING_OPTIONS.find(t => t.id === tid)?.name || tid;
                              return count > 1 ? `${name} x${count}` : name;
                            })
                            .join(', ')
                        : '-';
                    return (
                      <tr key={item.id}>
                        <td className="px-3 py-2 font-bold text-blue-900">ชิ้นที่ {i + 1}</td>
                        <td className="px-3 py-2 font-semibold">{m?.name} ({m?.thaiSub})</td>
                        <td className="px-3 py-2">{vegText}</td>
                        <td className="px-3 py-2 text-amber-800 font-medium">{topText}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 flex items-center justify-between">
              <span className="text-sm font-bold text-gray-800">
                รวม {selectedOrder.calculation.totalPieces} ชิ้น (ท็อปปิ้ง{' '}
                {selectedOrder.calculation.totalToppingsCount} อย่าง)
              </span>
              <span className="text-xl font-black text-blue-900">
                {selectedOrder.calculation.grandTotal} บาท
              </span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

