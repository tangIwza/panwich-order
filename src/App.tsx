import { useState, useEffect } from 'react';
import OrderCalculator from './pages/OrderCalculator';
import OrderHistory from './pages/OrderHistory';
import MenuMaster from './pages/MenuMaster';
import type { SavedOrder } from './types';

export default function App() {
  const [page, setPage] = useState<'order/calculator' | 'order/history' | 'master/menu'>('order/calculator');
  const [isDark] = useState<boolean>(false);

  // Load saved orders from localStorage
  const [savedOrders, setSavedOrders] = useState<SavedOrder[]>(() => {
    try {
      const raw = localStorage.getItem('panwich_saved_orders_v1');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('panwich_saved_orders_v1', JSON.stringify(savedOrders));
    } catch {
      // ignore storage errors
    }
  }, [savedOrders]);

  const handleSaveOrder = (newOrder: SavedOrder) => {
    setSavedOrders(prev => [newOrder, ...prev]);
  };

  const handleDeleteOrder = (id: string) => {
    setSavedOrders(prev => prev.filter(o => o.id !== id));
  };

  const nextOrderNumber = String(savedOrders.length + 1).padStart(3, '0');

  return (
    <div className={`min-h-screen bg-slate-200 overflow-x-hidden ${isDark ? 'dark' : ''}`}>
      <main className={`min-h-screen ${isDark ? 'bg-[#0b1520] dark' : 'bg-slate-200'}`}>
        {page === 'order/calculator' && (
          <OrderCalculator
            onSaveOrder={handleSaveOrder}
            nextOrderNumber={nextOrderNumber}
          />
        )}
        {page === 'order/history' && (
          <OrderHistory
            orders={savedOrders}
            onDeleteOrder={handleDeleteOrder}
            onCreateNew={() => setPage('order/calculator')}
          />
        )}
        {page === 'master/menu' && <MenuMaster />}
      </main>
    </div>
  );
}

