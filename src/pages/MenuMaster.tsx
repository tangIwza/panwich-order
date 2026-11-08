import { MENU_OPTIONS, VEGGIE_OPTIONS, TOPPING_OPTIONS } from '../data/menuData';
import { MenuIcon } from './OrderCalculator';
import StatusBadge from '../components/StatusBadge';

export default function MenuMaster() {
  return (
    <div className="p-6 space-y-6">
      {/* Main Sandwiches Master Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-gray-800">
              รายการเมนูหลัก (PANWICH MAIN MENU MASTER)
            </h2>
            <p className="text-xs text-gray-400">
              ราคาปกติชิ้นละ 25 บาท • โปรโมชั่นพิเศษทุกๆ 3 ชิ้น ราคา 70 บาท (คละเมนูได้)
            </p>
          </div>
          <StatusBadge status="Active" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100">
                <th className="px-5 py-3 text-left font-medium">#</th>
                <th className="px-5 py-3 text-left font-medium">ชื่อเมนู (Menu Name)</th>
                <th className="px-5 py-3 text-left font-medium">รายละเอียดไส้และซอส</th>
                <th className="px-5 py-3 text-left font-medium">ราคาต่อชิ้น</th>
                <th className="px-5 py-3 text-left font-medium">โปรโมชั่น 3 ชิ้น</th>
                <th className="px-5 py-3 text-left font-medium">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MENU_OPTIONS.map((menu, i) => (
                <tr key={menu.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5 text-gray-400">{i + 1}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2 font-bold text-blue-900">
                      <MenuIcon menuId={menu.id} size={16} />
                      <span>{menu.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-700">{menu.thaiSub}</td>
                  <td className="px-5 py-3.5 font-semibold text-gray-900">
                    {menu.basePrice} บาท / ชิ้น
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                      ร่วมรายการ 3 ชิ้น 70 บาท
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status="Active" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Veggies & Toppings Master Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Veggies */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-800">
              ตัวเลือกผัก (VEGETABLE OPTIONS)
            </h3>
            <p className="text-xs text-gray-400">สามารถติ๊กเลือกแยกตามแต่ละชิ้นได้ฟรี</p>
          </div>
          <div className="p-5 grid grid-cols-2 gap-3">
            {VEGGIE_OPTIONS.map(veg => (
              <div
                key={veg.id}
                className="p-3 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-between"
              >
                <span className="text-sm font-medium text-gray-800">{veg.name}</span>
                <span className="text-xs text-emerald-700 font-semibold">ฟรี (+0฿)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Toppings */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-800">
              ท็อปปิ้งเพิ่มเติม (EXTRA TOPPINGS)
            </h3>
            <p className="text-xs text-gray-400">
              คิดราคาเพิ่มอย่างละ 5 บาท โดยแยกตามแต่ละชิ้น
            </p>
          </div>
          <div className="p-5 space-y-2.5">
            {TOPPING_OPTIONS.map(top => (
              <div
                key={top.id}
                className="p-3 rounded-lg bg-amber-50/50 border border-amber-200/70 flex items-center justify-between"
              >
                <span className="text-sm font-semibold text-gray-800">{top.name}</span>
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold bg-amber-100 text-amber-800">
                  +{top.price} บาท / อย่าง / ชิ้น
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

