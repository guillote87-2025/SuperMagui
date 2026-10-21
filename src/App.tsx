import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { ShoppingList } from './components/ShoppingList';
import { CatalogBrowser } from './components/CatalogBrowser';
import { SupermarketPricesView } from './components/SupermarketPricesView';
import { AddCustomItemModal } from './components/AddCustomItemModal';
import { WindowsInstallModal } from './components/WindowsInstallModal';
import { ShareListModal } from './components/ShareListModal';
import { BudgetTracker } from './components/BudgetTracker';
import { CollaborativeShareModal } from './components/CollaborativeShareModal';
import { ShoppingItem, CatalogProduct, CategoryId, UnitType, BudgetConfig, ItemModifier, SupermarketId, ActiveTabType, PricingScenario } from './types';
import { DEFAULT_CATALOG_PRODUCTS, SUPERMARKET_CHAINS, getProductPriceForSupermarket, getProductPriceForScenario } from './data/supermarketData';
import { usePWAInstall, useOnlineStatus } from './hooks/usePWAInstall';
import { useRealtimeList } from './hooks/useRealtimeList';
import { generateShoppingListPdf } from './utils/pdfGenerator';
import { Laptop } from 'lucide-react';

const STORAGE_LIST_KEY = 'superlista_items_v1';
const STORAGE_CUSTOM_CATALOG_KEY = 'superlista_custom_catalog_v1';
const STORAGE_BUDGET_KEY = 'superlista_budget_v1';

const INITIAL_DEMO_ITEMS: ShoppingItem[] = [
  {
    id: 'init-1',
    name: 'Leche Entera / Descremada Sachet 1 L',
    category: 'lacteos',
    unit: 'u',
    unitPrice: 1850,
    quantity: 2,
    checked: false,
    pricingScenario: 'max',
    addedAt: Date.now() - 3000,
  },
  {
    id: 'init-2',
    name: 'Pan Francés / Flauta Fresco 1 kg',
    category: 'panaderia',
    unit: 'kg',
    unitPrice: 3200,
    quantity: 1,
    checked: false,
    pricingScenario: 'max',
    addedAt: Date.now() - 2000,
  },
  {
    id: 'init-3',
    name: 'Huevos Blancos Docena (12 u)',
    category: 'lacteos',
    unit: 'u',
    unitPrice: 3900,
    quantity: 1,
    checked: true,
    pricingScenario: 'max',
    addedAt: Date.now() - 1000,
  },
  {
    id: 'init-4',
    name: 'Yerba Mate Tradicional con Palo 1 kg',
    category: 'bebidas',
    unit: 'kg',
    unitPrice: 5500,
    quantity: 1,
    checked: false,
    notes: 'Playadito o Taragüí',
    pricingScenario: 'max',
    addedAt: Date.now(),
  },
];

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<ActiveTabType>('list');

  // Modals
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customModalPrefill, setCustomModalPrefill] = useState('');
  const [isWindowsModalOpen, setIsWindowsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCollabModalOpen, setIsCollabModalOpen] = useState(false);

  // PWA & Connectivity
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const isOnline = useOnlineStatus();

  // Shopping List items
  const [items, setItems] = useState<ShoppingItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LIST_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_DEMO_ITEMS;
  });

  // Budget configuration
  const [budget, setBudget] = useState<BudgetConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_BUDGET_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return { totalBudget: 50000, enabled: true };
  });

  // Custom user catalog
  const [customProducts, setCustomProducts] = useState<CatalogProduct[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CUSTOM_CATALOG_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  // Pricing Scenario: 'max' (Peor Escenario / Techo), 'avg' (Promedio), 'min' (Ofertas)
  // Default to "max" as requested by the user
  const [pricingScenario, setPricingScenario] = useState<PricingScenario>(() => {
    try {
      const saved = localStorage.getItem('superlista_pricing_scenario_v1');
      if (saved === 'max' || saved === 'avg' || saved === 'min') return saved;
    } catch {}
    return 'max';
  });

  useEffect(() => {
    try {
      localStorage.setItem('superlista_pricing_scenario_v1', pricingScenario);
    } catch {}
  }, [pricingScenario]);

  // Keep a ref to latest state for WebSocket initial sync
  const stateRef = useRef({ items, budget });
  useEffect(() => {
    stateRef.current = { items, budget };
  }, [items, budget]);

  const getCurrentState = useCallback(() => {
    return stateRef.current;
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_LIST_KEY, JSON.stringify(items));
    } catch (err) {
      console.error('Failed to save shopping list:', err);
    }
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_BUDGET_KEY, JSON.stringify(budget));
    } catch (err) {
      console.error('Failed to save budget:', err);
    }
  }, [budget]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CUSTOM_CATALOG_KEY, JSON.stringify(customProducts));
    } catch (err) {
      console.error('Failed to save custom catalog:', err);
    }
  }, [customProducts]);

  // Real-time Collaboration Hook
  const {
    roomId,
    user,
    activeUsers,
    status: collabStatus,
    isShared,
    joinRoom,
    leaveRoom,
    updateUserProfile,
    broadcastAdd,
    broadcastUpdate,
    broadcastToggle,
    broadcastRemove,
    broadcastBudget,
    broadcastClear,
    broadcastClearPurchased,
  } = useRealtimeList({
    onRemoteItemAdd: (newItem) => {
      setItems((prev) => {
        if (prev.some((i) => i.id === newItem.id)) return prev;
        return [newItem, ...prev];
      });
    },
    onRemoteItemUpdate: (updatedItem) => {
      setItems((prev) =>
        prev.map((i) => (i.id === updatedItem.id ? updatedItem : i))
      );
    },
    onRemoteItemToggle: (id, checked, modifier) => {
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, checked, lastModifiedBy: modifier } : i))
      );
    },
    onRemoteItemRemove: (id) => {
      setItems((prev) => prev.filter((i) => i.id !== id));
    },
    onRemoteBudgetUpdate: (newBudget) => {
      setBudget(newBudget);
    },
    onRemoteListClear: () => {
      setItems([]);
    },
    onRemoteListClearPurchased: (remainingItems) => {
      setItems(remainingItems);
    },
    onRemoteInit: (remoteItems, remoteBudget) => {
      if (remoteItems && remoteItems.length > 0) {
        setItems(remoteItems);
      }
      if (remoteBudget && remoteBudget.enabled) {
        setBudget(remoteBudget);
      }
    },
    getCurrentState,
  });

  // Combined Catalog
  const fullCatalog = [...customProducts, ...DEFAULT_CATALOG_PRODUCTS];

  // Actions
  const handleToggleItem = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    const newChecked = !item.checked;
    const modifier: ItemModifier = {
      userName: user.name,
      userColor: user.color,
      action: newChecked ? 'marcó en carrito' : 'desmarcó',
      timestamp: Date.now(),
    };

    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, checked: newChecked, lastModifiedBy: modifier } : i))
    );

    if (isShared) {
      broadcastToggle(id, newChecked);
    }
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    let updatedItem: ShoppingItem | null = null;
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const newQty = Math.max(1, Math.round((item.quantity + delta) * 10) / 10);
        updatedItem = {
          ...item,
          quantity: newQty,
          lastModifiedBy: {
            userName: user.name,
            userColor: user.color,
            action: 'modificó cantidad',
            timestamp: Date.now(),
          },
        };
        return updatedItem;
      })
    );

    if (isShared && updatedItem) {
      broadcastUpdate(updatedItem);
    }
  };

  const handleSetQuantity = (id: string, qty: number) => {
    let updatedItem: ShoppingItem | null = null;
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        updatedItem = {
          ...item,
          quantity: Math.max(0.1, qty),
          lastModifiedBy: {
            userName: user.name,
            userColor: user.color,
            action: 'modificó cantidad',
            timestamp: Date.now(),
          },
        };
        return updatedItem;
      })
    );
    if (isShared && updatedItem) {
      broadcastUpdate(updatedItem);
    }
  };

  const handleUpdatePrice = (id: string, price: number) => {
    let updatedItem: ShoppingItem | null = null;
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        updatedItem = {
          ...item,
          unitPrice: price,
          lastModifiedBy: {
            userName: user.name,
            userColor: user.color,
            action: 'editó precio',
            timestamp: Date.now(),
          },
        };
        return updatedItem;
      })
    );
    if (isShared && updatedItem) {
      broadcastUpdate(updatedItem);
    }
  };

  const handleUpdateNotes = (id: string, notes: string) => {
    let updatedItem: ShoppingItem | null = null;
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        updatedItem = {
          ...item,
          notes,
          lastModifiedBy: {
            userName: user.name,
            userColor: user.color,
            action: 'editó nota',
            timestamp: Date.now(),
          },
        };
        return updatedItem;
      })
    );
    if (isShared && updatedItem) {
      broadcastUpdate(updatedItem);
    }
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (isShared) {
      broadcastRemove(id);
    }
  };

  const handleClearList = () => {
    if (window.confirm('¿Seguro que querés vaciar toda la lista de compras?')) {
      setItems([]);
      if (isShared) {
        broadcastClear();
      }
    }
  };

  const handleClearPurchased = () => {
    const remaining = items.filter((item) => !item.checked);
    setItems(remaining);
    if (isShared) {
      broadcastClearPurchased();
    }
  };

  const handleAddFromCatalog = (product: CatalogProduct) => {
    const existing = items.find((item) => item.name.toLowerCase() === product.name.toLowerCase());
    if (existing) {
      handleUpdateQuantity(existing.id, 1);
      return;
    }

    const priceToUse = product.price || getProductPriceForScenario(product, pricingScenario);

    const newItem: ShoppingItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: product.name,
      category: product.category,
      unit: product.unit,
      unitPrice: priceToUse,
      quantity: 1,
      checked: false,
      isCustom: product.isCustom,
      pricingScenario,
      addedAt: Date.now(),
      lastModifiedBy: {
        userName: user.name,
        userColor: user.color,
        action: 'agregó',
        timestamp: Date.now(),
      },
    };

    setItems((prev) => [newItem, ...prev]);
    if (isShared) {
      broadcastAdd(newItem);
    }
  };

  const handleRecalculateListToScenario = (scenario: PricingScenario) => {
    setItems((prev) =>
      prev.map((item) => {
        const prod = fullCatalog.find((p) => p.name.toLowerCase() === item.name.toLowerCase());
        if (!prod) return item;
        const newPrice = getProductPriceForScenario(prod, scenario);
        return {
          ...item,
          unitPrice: newPrice,
          pricingScenario: scenario,
        };
      })
    );
  };

  const handleUpdatePricingScenario = (scenario: PricingScenario) => {
    setPricingScenario(scenario);
    handleRecalculateListToScenario(scenario);
  };

  const handleAddFromCatalogWithPrice = (product: CatalogProduct, price: number, supermarketName: string) => {
    const existing = items.find((item) => item.name.toLowerCase() === product.name.toLowerCase());
    if (existing) {
      handleUpdateQuantity(existing.id, 1);
      return;
    }

    const newItem: ShoppingItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: product.name,
      category: product.category,
      unit: product.unit,
      unitPrice: price,
      quantity: 1,
      checked: false,
      isCustom: product.isCustom,
      notes: supermarketName ? `Ref: ${supermarketName}` : undefined,
      addedAt: Date.now(),
      lastModifiedBy: {
        userName: user.name,
        userColor: user.color,
        action: 'agregó',
        timestamp: Date.now(),
      },
    };

    setItems((prev) => [newItem, ...prev]);
    if (isShared) {
      broadcastAdd(newItem);
    }
  };

  const handleApplySupermarketToList = (supermarketId: SupermarketId) => {
    const chain = SUPERMARKET_CHAINS.find((c) => c.id === supermarketId);
    if (!chain) return;

    setItems((prev) => {
      const updated = prev.map((item) => {
        const catProd = fullCatalog.find((p) => p.name.toLowerCase() === item.name.toLowerCase());
        let newPrice = item.unitPrice;
        if (catProd) {
          newPrice = getProductPriceForSupermarket(catProd, supermarketId);
        } else {
          newPrice = Math.round((item.unitPrice * chain.priceModifier) / 10) * 10;
        }
        return {
          ...item,
          unitPrice: newPrice,
          notes: item.notes ? `${item.notes} | ${chain.shortName}` : `Precio ${chain.shortName}`,
        };
      });
      return updated;
    });
  };

  const handleAddCustomItem = (data: {
    name: string;
    unitPrice: number;
    category: CategoryId;
    unit: UnitType;
    quantity: number;
    notes?: string;
    saveToCatalog: boolean;
  }) => {
    const newItem: ShoppingItem = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: data.name,
      category: data.category,
      unit: data.unit,
      unitPrice: data.unitPrice,
      quantity: data.quantity,
      checked: false,
      notes: data.notes,
      isCustom: true,
      addedAt: Date.now(),
      lastModifiedBy: {
        userName: user.name,
        userColor: user.color,
        action: 'agregó',
        timestamp: Date.now(),
      },
    };

    setItems((prev) => [newItem, ...prev]);
    if (isShared) {
      broadcastAdd(newItem);
    }

    if (data.saveToCatalog) {
      const newCatalogProduct: CatalogProduct = {
        id: `cat-custom-${Date.now()}`,
        name: data.name,
        category: data.category,
        unit: data.unit,
        price: data.unitPrice,
        isCustom: true,
      };
      setCustomProducts((prev) => [newCatalogProduct, ...prev]);
    }
  };

  const handleQuickAdd = (inputName: string) => {
    const trimmed = inputName.trim();
    if (!trimmed) return;

    const found = fullCatalog.find(
      (p) => p.name.toLowerCase() === trimmed.toLowerCase() ||
             p.name.toLowerCase().startsWith(trimmed.toLowerCase())
    );

    if (found) {
      handleAddFromCatalog(found);
    } else {
      handleAddCustomItem({
        name: trimmed,
        unitPrice: 0,
        category: 'almacen',
        unit: 'u',
        quantity: 1,
        saveToCatalog: true,
      });
    }
  };

  const handleUpdateBudget = (newBudget: BudgetConfig) => {
    setBudget(newBudget);
    if (isShared) {
      broadcastBudget(newBudget);
    }
  };

  const openAddCustom = (prefillName: string = '') => {
    setCustomModalPrefill(prefillName);
    setIsCustomModalOpen(true);
  };

  // Calculations
  const totalPrice = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const spentInCart = items.filter((i) => i.checked).reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const purchasedCount = items.filter((item) => item.checked).length;

  const handleExportPdf = () => {
    generateShoppingListPdf({
      items,
      budget,
      totalPrice,
      spentInCart,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        totalItems={items.length}
        totalPrice={totalPrice}
        purchasedCount={purchasedCount}
        isInstallable={isInstallable}
        isInstalled={isInstalled}
        isOnline={isOnline}
        isShared={isShared}
        activeUsers={activeUsers}
        connectionStatus={collabStatus}
        pricingScenario={pricingScenario}
        onUpdatePricingScenario={handleUpdatePricingScenario}
        onOpenWindowsInstall={() => setIsWindowsModalOpen(true)}
        onOpenShare={() => setIsShareModalOpen(true)}
        onOpenCollab={() => setIsCollabModalOpen(true)}
        onExportPdf={handleExportPdf}
        onClearList={handleClearList}
        onClearPurchased={handleClearPurchased}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-5 space-y-4">
        {/* Budget Tracker (always available on Shopping List view) */}
        {activeTab === 'list' && (
          <BudgetTracker
            budget={budget}
            spentInCart={spentInCart}
            totalPlanned={totalPrice}
            pricingScenario={pricingScenario}
            onUpdateBudget={handleUpdateBudget}
            onUpdatePricingScenario={handleUpdatePricingScenario}
            onRecalculateListToScenario={handleRecalculateListToScenario}
          />
        )}

        {/* View Switch */}
        {activeTab === 'list' && (
          <ShoppingList
            items={items}
            pricingScenario={pricingScenario}
            onUpdatePricingScenario={handleUpdatePricingScenario}
            onToggleItem={handleToggleItem}
            onUpdateQuantity={handleUpdateQuantity}
            onSetQuantity={handleSetQuantity}
            onUpdatePrice={handleUpdatePrice}
            onUpdateNotes={handleUpdateNotes}
            onRemoveItem={handleRemoveItem}
            onOpenAddCustom={openAddCustom}
            onQuickAdd={handleQuickAdd}
            onSwitchToCatalog={() => setActiveTab('supermarkets')}
            onExportPdf={handleExportPdf}
            isShared={isShared}
          />
        )}

        {activeTab === 'supermarkets' && (
          <SupermarketPricesView
            catalog={fullCatalog}
            activeItems={items}
            onAddFromCatalogWithPrice={handleAddFromCatalogWithPrice}
            onApplySupermarketToList={handleApplySupermarketToList}
          />
        )}

        {activeTab === 'catalog' && (
          <CatalogBrowser
            catalog={fullCatalog}
            activeItems={items}
            pricingScenario={pricingScenario}
            onUpdatePricingScenario={handleUpdatePricingScenario}
            onAddFromCatalog={handleAddFromCatalog}
            onOpenAddCustom={openAddCustom}
          />
        )}
      </main>

      {/* Footer Info & Desktop App Download reminder */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 px-4 text-center">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="text-left">
            <p className="font-semibold text-slate-700">
              SuperLista · Provincia de Buenos Aires 2026
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Control de presupuesto en tiempo real, listas compartidas colaborativas y guardado automático.
            </p>
          </div>

          <button
            onClick={() => setIsWindowsModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 px-3 py-1.5 font-medium transition"
          >
            <Laptop className="h-3.5 w-3.5" />
            <span>Descargar en el escritorio de Windows</span>
          </button>
        </div>
      </footer>

      {/* Modals */}
      <AddCustomItemModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onAddCustomItem={handleAddCustomItem}
        initialName={customModalPrefill}
      />

      <CollaborativeShareModal
        isOpen={isCollabModalOpen}
        onClose={() => setIsCollabModalOpen(false)}
        roomId={roomId}
        currentUser={user}
        activeUsers={activeUsers}
        connectionStatus={collabStatus}
        onJoinRoom={joinRoom}
        onLeaveRoom={leaveRoom}
        onUpdateUser={updateUserProfile}
      />

      <WindowsInstallModal
        isOpen={isWindowsModalOpen}
        onClose={() => setIsWindowsModalOpen(false)}
        isInstallable={isInstallable}
        onInstall={install}
      />

      <ShareListModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        items={items}
        totalPrice={totalPrice}
        spentInCart={spentInCart}
        budget={budget}
        pricingScenario={pricingScenario}
        onUpdatePricingScenario={handleUpdatePricingScenario}
      />
    </div>
  );
}
