import React, { useState } from 'react';
import { X, Plus, Sparkles, Tag, DollarSign, Hash } from 'lucide-react';
import { CategoryId, UnitType } from '../types';
import { CATEGORIES } from '../data/supermarketData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAddCustomItem: (item: {
    name: string;
    unitPrice: number;
    category: CategoryId;
    unit: UnitType;
    quantity: number;
    notes?: string;
    saveToCatalog: boolean;
  }) => void;
  initialName?: string;
}

export const AddCustomItemModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onAddCustomItem,
  initialName = '',
}) => {
  const [name, setName] = useState(initialName);
  const [unitPrice, setUnitPrice] = useState<string>('');
  const [category, setCategory] = useState<CategoryId>('almacen');
  const [unit, setUnit] = useState<UnitType>('u');
  const [quantity, setQuantity] = useState<number>(1);
  const [notes, setNotes] = useState<string>('');
  const [saveToCatalog, setSaveToCatalog] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedPrice = unitPrice ? parseFloat(unitPrice.replace(/\./g, '').replace(',', '.')) : 0;

    onAddCustomItem({
      name: name.trim(),
      unitPrice: isNaN(parsedPrice) ? 0 : parsedPrice,
      category,
      unit,
      quantity: quantity > 0 ? quantity : 1,
      notes: notes.trim() || undefined,
      saveToCatalog,
    });

    setName('');
    setUnitPrice('');
    setNotes('');
    setQuantity(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
              <Plus className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Nuevo artículo personalizado
              </h3>
              <p className="text-xs text-slate-500">Agregalo a tu lista de compras</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Item Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nombre del artículo <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="Ej: Tapa de empanadas, Queso untable light, Jabón..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 transition"
            />
          </div>

          {/* Price & Quantity in row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Precio estimado ($ ARS)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">
                  $
                </span>
                <input
                  type="number"
                  min="0"
                  step="50"
                  placeholder="0 (opcional)"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 pl-7 pr-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Cantidad y unidad
              </label>
              <div className="flex gap-1.5">
                <input
                  type="number"
                  min="0.25"
                  step="any"
                  value={quantity}
                  onChange={(e) => setQuantity(parseFloat(e.target.value) || 1)}
                  className="w-16 rounded-xl border border-slate-300 px-2.5 py-2 text-sm text-center text-slate-800 focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 transition"
                />
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as UnitType)}
                  className="flex-1 rounded-xl border border-slate-300 px-2 py-2 text-xs text-slate-700 bg-white focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 transition"
                >
                  <option value="u">unidad/es</option>
                  <option value="kg">kg (kilos)</option>
                  <option value="g">gramos</option>
                  <option value="paquete">paquete/s</option>
                  <option value="L">litros</option>
                  <option value="ml">ml</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Categoría
            </label>
            <div className="grid grid-cols-3 gap-1.5 max-h-36 overflow-y-auto p-1 border border-slate-200 rounded-xl bg-slate-50/50">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium text-left transition ${
                    category === cat.id
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-sm shrink-0">{cat.icon}</span>
                  <span className="truncate">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Optional notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nota o marca preferida (opcional)
            </label>
            <input
              type="text"
              placeholder="Ej: Marca La Serenísima, comprar si está de oferta..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 transition"
            />
          </div>

          {/* Save to Catalog toggle */}
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 select-none pt-1">
            <input
              type="checkbox"
              checked={saveToCatalog}
              onChange={(e) => setSaveToCatalog(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span>Recordar este artículo en mi catálogo para compras futuras</span>
          </label>

          {/* Actions */}
          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Agregar a la lista
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
