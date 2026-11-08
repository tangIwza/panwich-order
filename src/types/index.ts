export type MenuId = 'moon' | 'sun' | 'earth' | 'alien';

export type VeggieId = 'all' | 'lettuce' | 'tomato' | 'onion' | 'none';

export type ToppingId = 'cheese' | 'ebiko' | 'quail_egg';

export interface MenuOption {
  id: MenuId;
  name: string;
  thaiSub: string;
  badgeColor: string;
  basePrice: number;
}

export interface VeggieOption {
  id: VeggieId;
  name: string;
}

export interface ToppingOption {
  id: ToppingId;
  name: string;
  price: number;
}

export interface OrderItem {
  id: string;
  menuId: MenuId;
  veggies: VeggieId[];
  toppings: ToppingId[];
  itemNote?: string;
}

export interface OrderCustomerInfo {
  orderNo: string;
  customerName: string;
  section: string;
  phone: string;
  note: string;
}

export interface PriceCalculation {
  totalPieces: number;
  bundleSets: number;        // Number of 3-piece sets (70 THB each)
  remainingPieces: number;   // Remainder pieces (25 THB each)
  regularBasePrice: number;  // totalPieces * 25
  discountedBasePrice: number; // bundleSets * 70 + remainingPieces * 25
  discountSaved: number;     // bundleSets * 5
  totalToppingsCount: number;
  totalToppingsPrice: number; // totalToppingsCount * 5
  grandTotal: number;        // discountedBasePrice + totalToppingsPrice
}

export interface SavedOrder {
  id: string;
  createdAt: string;
  customer: OrderCustomerInfo;
  items: OrderItem[];
  calculation: PriceCalculation;
  status: 'Completed' | 'In Progress' | 'Pending' | 'Cancelled';
}

