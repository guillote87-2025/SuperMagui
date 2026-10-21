import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
  Check, 
  Edit2, 
  Sparkles, 
  ShoppingCart, 
  ArrowRight,
  LayoutGrid,
  List as ListIcon,
  User,
  Clock,
  FileText
} from 'lucide-react';
import { ShoppingItem, CategoryId, PricingScenario } from '../types';
import { formatARS } from '../utils/formatters';
import { CATEGORIES } from '../data/supermarketData';
import { BudgetCategoryChart } from './BudgetCategoryChart';
import { ShieldAlert } from 'lucide-react';

interface Props {
  items: ShoppingItem[];
  pricingScenario?: PricingScenario;
  onUpdatePricingScenario?: (scenario: PricingScenario) => void;
  onToggleItem: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onSetQuantity: (id: string, qty: number) => void;
  onUpdatePrice: (id: string, price: number) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onRemoveItem: (id: string) => void;
  onOpenAddCustom: (prefillName?: string) => void;
  onQuickAdd: (name: string) => void;
  onSwitchToCatalog: () => void;
  onExportPdf?: () => void;
  isShared?: boolean;
}

export const ShoppingList: React.FC<Props> = ({
  items,
  pricingScenario = 'max',
  onUpdatePricingScenario,
  onToggleItem,
  onUpdateQuantity,
  onSetQuantity,
  onUpdatePrice,
  onUpdateNotes,
  onRemoveItem,
  onOpenAddCustom,
  onQuickAdd,
  onSwitchToCatalog,
  onExportPdf,
  isShared,
}) => {
  const [quickInput, setQuickInput] = useState('');
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<string>('');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState<string>('');
  const [groupByCategory, setGroupByCategory] = useState(true);

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    onQuickAdd(quickInput.trim());
    setQuickInput('');
  };

  const startEditPrice = (item: ShoppingItem) => {
    setEditingPriceId(item.id);
    setTempPrice(item.unitPrice ? item.unitPrice.toString() : '');
  };

  const saveEditPrice = (id: string) => {
    const val = parseFloat(tempPrice);
    if (!isNaN(val) && val >= 0) {
      onUpdatePrice(id, val);
    }
    setEditingPriceId(null);
  };

  const startEditNotes = (item: ShoppingItem) => {
    setEditingNotesId(item.id);
    setTempNotes(item.notes || '');
  };

  const saveEditNotes = (id: string) => {
    onUpdateNotes(id, tempNotes.trim());
    setEditingNotesId(null);
  };

  // Calculations
  const totalItems = items.length;
  const purchasedItems = items.filter((i) => i.checked);
  const pendingItems = items.filter((i) => !i.checked);

  const totalBudget = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  const inCartBudget = purchasedItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

  const getCategoryInfo = (catId: CategoryId) => {
    return CATEGORIES.find((c) => c.id === catId) || CATEGORIES[CATEGORIES.length - 1];
  };

  // Group pending items by category
  const pendingByCategory = useMemo(() => {
    const map = new Map<CategoryId, ShoppingItem[]>();
    CATEGORIES.forEach((cat) => map.set(cat.id, []));

    pendingItems.forEach((item) => {
      const list = map.get(item.category) || [];
      list.push(item);
      map.set(item.category, list);
    });

    return map;
  }, [pendingItems]);

  const renderItemRow = (item: ShoppingItem) => {
    const cat = getCategoryInfo(item.category);
    return (
      <div 
        key={item.id}
        className="p-3.5 hover:bg-slate-50/60 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        {/* Left: Checkbox + Name + Details + Who made changes */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <button
            type="button"
            onClick={() => onToggleItem(item.id)}
            className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 border-slate-300 text-transparent hover:border-emerald-500 transition"
            aria-label="Marcar como comprado"
          >
            <Check className="h-3.5 w-3.5" />
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-sm font-semibold text-slate-900 leading-snug">
                {item.name}
              </span>
              {!groupByCategory && (
                <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium border ${cat.color}`}>
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </span>
              )}
              {item.isCustom && (
                <span className="rounded-md bg-purple-50 text-purple-700 px-1.5 py-0.5 text-[10px] font-medium border border-purple-200">
                  Personalizado
                </span>
              )}
            </div>

            {/* Indicator of who modified this item */}
            {item.lastModifiedBy && (
              <div className="flex items-center gap-1 mt-1 text-[11px] text-slate-500">
                <span 
                  className="h-1.5 w-1.5 rounded-full inline-block" 
                  style={{ backgroundColor: item.lastModifiedBy.userColor || '#059669' }} 
                />
                <span className="font-semibold text-slate-700">{item.lastModifiedBy.userName}</span>
                <span>{item.lastModifiedBy.action}</span>
              </div>
            )}

            {/* Notes / Edit notes */}
            {editingNotesId === item.id ? (
              <div className="flex items-center gap-1.5 mt-1.5">
                <input
                  type="text"
                  value={tempNotes}
                  onChange={(e) => setTempNotes(e.target.value)}
                  placeholder="Ej: marca preferida, etc."
                  className="rounded-lg border border-slate-300 px-2 py-1 text-xs text-slate-800"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEditNotes(item.id);
                    if (e.key === 'Escape') setEditingNotesId(null);
                  }}
                />
                <button
                  onClick={() => saveEditNotes(item.id)}
                  className="text-xs font-semibold text-emerald-600 px-2 py-1 hover:bg-emerald-50 rounded"
                >
                  Guardar
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 mt-0.5">
                {item.notes ? (
                  <p 
                    onClick={() => startEditNotes(item)}
                    className="text-xs text-slate-500 italic hover:text-slate-700 cursor-pointer"
                    title="Hacé clic para editar la nota"
                  >
                    Nota: {item.notes}
                  </p>
                ) : (
                  <button
                    onClick={() => startEditNotes(item)}
                    className="text-[11px] text-slate-400 hover:text-slate-600 flex items-center gap-0.5"
                  >
                    + nota
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Quantity Stepper + Price + Actions */}
        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pl-8 sm:pl-0">
          {/* Quantity Stepper */}
          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5">
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.id, -1)}
              className="flex h-6 w-6 items-center justify-center rounded-md text-slate-600 hover:bg-white hover:text-slate-900 transition"
            >
              -
            </button>
            <span className="w-12 text-center text-xs font-semibold text-slate-800">
              {item.quantity} {item.unit}
            </span>
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.id, 1)}
              className="flex h-6 w-6 items-center justify-center rounded-md text-slate-600 hover:bg-white hover:text-slate-900 transition"
            >
              +
            </button>
          </div>

          {/* Price with edit ability */}
          <div className="text-right min-w-[90px]">
            {editingPriceId === item.id ? (
              <div className="flex items-center justify-end gap-1">
                <span className="text-xs text-slate-400">$</span>
                <input
                  type="number"
                  min="0"
                  value={tempPrice}
                  onChange={(e) => setTempPrice(e.target.value)}
                  className="w-18 rounded border border-emerald-500 px-1 py-0.5 text-xs font-bold text-right text-slate-900"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEditPrice(item.id);
                    if (e.key === 'Escape') setEditingPriceId(null);
                  }}
                />
                <button
                  onClick={() => saveEditPrice(item.id)}
                  className="text-xs text-emerald-600 font-bold px-1 hover:bg-emerald-50 rounded"
                >
                  ✓
                </button>
              </div>
            ) : (
              <div 
                onClick={() => startEditPrice(item)}
                className="cursor-pointer group flex flex-col items-end"
                title="Hacé clic para cambiar el precio de este artículo"
              >
                <span className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 flex items-center gap-1">
                  {formatARS(item.unitPrice * item.quantity)}
                  <Edit2 className="h-2.5 w-2.5 text-slate-300 opacity-0 group-hover:opacity-100 transition" />
                </span>
                <span className="text-[10px] text-slate-400">
                  {formatARS(item.unitPrice)} /{item.unit}
                </span>
              </div>
            )}
          </div>

          {/* Remove button */}
          <button
            type="button"
            onClick={() => onRemoveItem(item.id)}
            className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition"
            title="Eliminar de la lista"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Active Pricing Scenario Banner: Peor Escenario (Precios Más Altos) */}
      <div className={`rounded-2xl p-3 sm:p-3.5 border transition ${
        pricingScenario === 'max'
          ? 'bg-amber-50/80 border-amber-300/80 text-amber-950'
          : 'bg-slate-100/80 border-slate-200 text-slate-800'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
              pricingScenario === 'max' ? 'bg-amber-400 text-slate-950 shadow-2xs' : 'bg-slate-700 text-white'
            }`}>
              <ShieldAlert className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">
                  {pricingScenario === 'max'
                    ? '🛡️ Panorama Activo: Peor Escenario (Precios Más Altos de Góndola)'
                    : pricingScenario === 'min'
                    ? '🏷️ Panorama Activo: Precios de Oferta y Descuentos'
                    : '📊 Panorama Activo: Precios Promedio'}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">
                {pricingScenario === 'max'
                  ? 'Calculando con los valores máximos de supermercado para estar sujeto al peor escenario posible y que tu presupuesto no quede corto.'
                  : 'Calculando con precios de referencia del mercado de la Provincia de Buenos Aires.'}
              </p>
            </div>
          </div>

          {onUpdatePricingScenario && (
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shrink-0 self-start sm:self-auto shadow-2xs">
              <button
                type="button"
                onClick={() => onUpdatePricingScenario('max')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition ${
                  pricingScenario === 'max'
                    ? 'bg-amber-400 text-slate-950 shadow-xs ring-1 ring-amber-400'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Valores más altos de góndola para cubrir el peor escenario"
              >
                <ShieldAlert className="h-3 w-3" />
                <span>🛡️ Peor Escenario (Máx)</span>
              </button>
              <button
                type="button"
                onClick={() => onUpdatePricingScenario('avg')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                  pricingScenario === 'avg'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Precios promedio de mercado"
              >
                Promedio
              </button>
              <button
                type="button"
                onClick={() => onUpdatePricingScenario('min')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                  pricingScenario === 'min'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Precios con descuentos y ofertas"
              >
                Ofertas
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Add Bar & Custom Item Trigger */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
        <form onSubmit={handleQuickSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Escribí un artículo (ej: Leche, Asado, Manzanas...) y presioná Enter"
              value={quickInput}
              onChange={(e) => setQuickInput(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 transition"
            />
          </div>
          <button
            type="submit"
            disabled={!quickInput.trim()}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Agregar</span>
          </button>
          <button
            type="button"
            onClick={() => onOpenAddCustom(quickInput)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            title="Agregar con precio y detalles personalizados"
          >
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span className="hidden md:inline">Personalizado</span>
          </button>
        </form>
      </div>

      {/* List controls: Group by Category toggle & Items count */}
      {totalItems > 0 && (
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Organización:</span>
            <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5">
              <button
                onClick={() => setGroupByCategory(true)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                  groupByCategory
                    ? 'bg-emerald-50 text-emerald-800 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="h-3 w-3" />
                <span>Por Categorías</span>
              </button>
              <button
                onClick={() => setGroupByCategory(false)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                  !groupByCategory
                    ? 'bg-emerald-50 text-emerald-800 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ListIcon className="h-3 w-3" />
                <span>Lista simple</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            {onExportPdf && (
              <button
                type="button"
                onClick={onExportPdf}
                className="flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 hover:border-emerald-400 transition"
                title="Descargar lista formateada en archivo PDF"
              >
                <FileText className="h-3.5 w-3.5 text-emerald-600" />
                <span>Exportar PDF</span>
              </button>
            )}
            <div className="hidden sm:block">
              <span>En carrito: </span>
              <strong className="text-emerald-700 font-bold">{formatARS(inCartBudget)}</strong>
              <span className="text-slate-400"> / {formatARS(totalBudget)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {totalItems === 0 && (
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-3">
            <ShoppingCart className="h-7 w-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            Tu lista de compras está vacía
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-5">
            Escribí arriba cualquier producto, o explorá nuestro catálogo con precios de referencia de la Provincia de Buenos Aires para 2026.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <button
              onClick={onSwitchToCatalog}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition"
            >
              <span>Ver lista de precios por supermercado</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => onOpenAddCustom()}
              className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <Plus className="h-3.5 w-3.5 text-emerald-600" />
              <span>Escribir artículo personalizado</span>
            </button>
          </div>
        </div>
      )}

      {/* Pending Items: Grouped by Category View */}
      {pendingItems.length > 0 && groupByCategory && (
        <div className="space-y-3">
          {CATEGORIES.map((cat) => {
            const catItems = pendingByCategory.get(cat.id) || [];
            if (catItems.length === 0) return null;
            const catSubtotal = catItems.reduce((sum, i) => sum + (i.unitPrice * i.quantity), 0);

            return (
              <div 
                key={cat.id} 
                className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden"
              >
                {/* Category Header */}
                <div className="bg-slate-50/90 px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{cat.icon}</span>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      {cat.name}
                    </h4>
                    <span className="rounded-full bg-slate-200/80 px-2 py-0.2 text-[10px] text-slate-700 font-bold">
                      {catItems.length}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-slate-600">
                    Subtotal: {formatARS(catSubtotal)}
                  </span>
                </div>

                {/* Items in this category */}
                <div className="divide-y divide-slate-100">
                  {catItems.map(renderItemRow)}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pending Items: Flat list view */}
      {pendingItems.length > 0 && !groupByCategory && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="bg-slate-50/80 px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <span>Por comprar</span>
              <span className="rounded-full bg-slate-200 px-2 py-0.2 text-[10px] text-slate-700 font-bold">
                {pendingItems.length}
              </span>
            </h4>
            <span className="text-[11px] text-slate-400">
              Marcá con el tilde al poner en el carrito
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {pendingItems.map(renderItemRow)}
          </div>
        </div>
      )}

      {/* Purchased / In Cart Items */}
      {purchasedItems.length > 0 && (
        <div className="bg-slate-50/80 rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="px-4 py-2.5 border-b border-slate-200/60 flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <span>Ya en el carrito</span>
              <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.2 text-[10px] font-bold">
                {purchasedItems.length}
              </span>
            </h4>
            <span className="text-xs font-semibold text-emerald-700">
              Subtotal en carrito: {formatARS(inCartBudget)}
            </span>
          </div>

          <div className="divide-y divide-slate-200/60">
            {purchasedItems.map((item) => (
              <div 
                key={item.id}
                className="p-3 bg-white/60 hover:bg-white transition flex items-center justify-between gap-3 opacity-75"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <button
                    type="button"
                    onClick={() => onToggleItem(item.id)}
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-emerald-600 text-white shadow-2xs hover:bg-emerald-700 transition"
                    aria-label="Desmarcar"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </button>

                  <div className="min-w-0">
                    <span className="text-sm line-through text-slate-500">
                      {item.name}
                    </span>
                    <span className="text-xs text-slate-400 ml-2">
                      ({item.quantity} {item.unit})
                    </span>

                    {item.lastModifiedBy && (
                      <span className="inline-flex items-center gap-1 ml-2 text-[10px] text-slate-400 italic">
                        • {item.lastModifiedBy.userName}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-500">
                    {formatARS(item.unitPrice * item.quantity)}
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    className="p-1 text-slate-300 hover:text-rose-500 transition"
                    title="Eliminar de la lista"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Visual Budget Analysis by Category using Recharts */}
      {items.length > 0 && (
        <div className="pt-2">
          <BudgetCategoryChart items={items} />
        </div>
      )}
    </div>
  );
};
