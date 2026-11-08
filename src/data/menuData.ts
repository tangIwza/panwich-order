import type { MenuOption, VeggieOption, ToppingOption, OrderItem, PriceCalculation, VeggieId } from '../types';

export const MENU_OPTIONS: MenuOption[] = [
  {
    id: 'moon',
    name: 'Moon',
    thaiSub: 'ไก่ป๊อบ + ฮันนี่มัสตาร์ด',
    badgeColor: 'bg-indigo-50 text-indigo-800 ring-indigo-600/20',
    basePrice: 25,
  },
  {
    id: 'sun',
    name: 'Sun',
    thaiSub: 'เนื้อบด + สไปซี่มาโย',
    badgeColor: 'bg-amber-50 text-amber-800 ring-amber-600/20',
    basePrice: 25,
  },
  {
    id: 'earth',
    name: 'Earth',
    thaiSub: 'ปลาดอรี่ + มาโยไข่กุ้ง',
    badgeColor: 'bg-emerald-50 text-emerald-800 ring-emerald-600/20',
    basePrice: 25,
  },
  {
    id: 'alien',
    name: 'Alien',
    thaiSub: 'เมนูลับ ?',
    badgeColor: 'bg-purple-50 text-purple-800 ring-purple-600/20',
    basePrice: 25,
  },
];

export const VEGGIE_OPTIONS: VeggieOption[] = [
  { id: 'all', name: 'ทุกอย่าง' },
  { id: 'lettuce', name: 'ผักกาด' },
  { id: 'tomato', name: 'มะเขือเทศ' },
  { id: 'onion', name: 'หัวหอม' },
  { id: 'none', name: 'ไม่ใส่ผัก' },
];

export const TOPPING_OPTIONS: ToppingOption[] = [
  { id: 'cheese', name: 'ชีส', price: 5 },
  { id: 'ebiko', name: 'ไข่กุ้ง', price: 5 },
  { id: 'quail_egg', name: 'ไข่นกกระทา', price: 5 },
];

export const SINGLE_PRICE = 25;
export const BUNDLE_SIZE = 3;
export const BUNDLE_PRICE = 70;
export const TOPPING_PRICE = 5;

/**
 * Smart toggle for vegetable checkboxes matching the PANWICH order slip
 */
export function toggleVeggieSelection(current: VeggieId[], target: VeggieId): VeggieId[] {
  if (target === 'none') {
    return current.includes('none') ? ['all'] : ['none'];
  }
  if (target === 'all') {
    return current.includes('all') ? ['none'] : ['all'];
  }

  // Specific veggie clicked ('lettuce' | 'tomato' | 'onion')
  let workingList: VeggieId[];

  if (current.includes('all')) {
    // If 'all' was active and user clicks one specific veggie, select just that veggie
    workingList = [target];
  } else {
    workingList = current.filter(v => v !== 'all' && v !== 'none');
    if (workingList.includes(target)) {
      workingList = workingList.filter(v => v !== target);
    } else {
      workingList = [...workingList, target];
    }
  }

  // If all 3 individual veggies are selected, collapse to ['all']
  if (
    workingList.includes('lettuce') &&
    workingList.includes('tomato') &&
    workingList.includes('onion')
  ) {
    return ['all'];
  }

  if (workingList.length === 0) {
    return ['none'];
  }

  return workingList;
}

/**
 * Calculate order pricing:
 * - 1 piece = 25 THB
 * - Every 3 pieces = 70 THB (saves 5 THB per set of 3)
 * - Toppings = 5 THB per topping per piece
 */
export function calculateOrderPrice(items: OrderItem[]): PriceCalculation {
  const totalPieces = items.length;
  const bundleSets = Math.floor(totalPieces / BUNDLE_SIZE);
  const remainingPieces = totalPieces % BUNDLE_SIZE;

  const regularBasePrice = totalPieces * SINGLE_PRICE;
  const discountedBasePrice = bundleSets * BUNDLE_PRICE + remainingPieces * SINGLE_PRICE;
  const discountSaved = regularBasePrice - discountedBasePrice;

  const totalToppingsCount = items.reduce((sum, item) => sum + item.toppings.length, 0);
  const totalToppingsPrice = totalToppingsCount * TOPPING_PRICE;
  const grandTotal = discountedBasePrice + totalToppingsPrice;

  return {
    totalPieces,
    bundleSets,
    remainingPieces,
    regularBasePrice,
    discountedBasePrice,
    discountSaved,
    totalToppingsCount,
    totalToppingsPrice,
    grandTotal,
  };
}
