import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Check, 
  Info, 
  Sparkles, 
  Tag, 
  ChevronRight, 
  TrendingUp, 
  MapPin, 
  ShieldAlert 
} from 'lucide-react';
import { CatalogProduct, CategoryId, ShoppingItem, PricingScenario } from '../types';
import { CATEGORIES, PRICE_UPDATE_INFO, getProductPriceForScenario } from '../data/supermarketData';
import { formatARS } from '../utils/formatters';

interface Props {
  catalog: CatalogProduct[];
  activeItems: ShoppingItem[];
  pricingScenario?: PricingScenario;
  onUpdatePricingScenario?: (scenario: PricingScenario) => void;
  onAddFromCatalog: (product: CatalogProduct) => void;
  onOpenAddCustom: (prefillName?: string) => void;
}

export const CatalogBrowser: React.FC<Props> = ({
  catalog,
  activeItems,
  pricingScenario = 'max',
  onUpdatePricingScenario,
  onAddFromCatalog,
  onOpenAddCustom,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all' | 'custom'>('all');

  // Set of IDs currently in active shopping list
  const activeProductNames = useMemo(() => {
    return new Set(activeItems.map((item) => item.name.toLowerCase()));
  }, [activeItems]);

  const filteredProducts = useMemo(() => {
    return catalog.filter((product) => {
      // Category filter
      if (selectedCategory === 'custom') {
        if (!product.isCustom) return false;
      } else if (selectedCategory !== 'all') {
        if (product.category !== selectedCategory) return false;
      }

      // Search filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesBrand = product.brandExample?.toLowerCase().includes(query) ?? false;
        return matchesName || matchesBrand;
      }

      return true;
    });
  }, [catalog, selectedCategory, searchTerm]);

  return (
    <div className="space-y-4">
      {/* Information Banner on Buenos Aires 2026 Prices & Active Scenario */}
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white shrink-0 mt-0.5">
              <MapPin className="h-4 w-4" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-1.5">
                  <span>Catálogo de Precios de Referencia</span>
                  <span className="rounded-md bg-emerald-200/90 px-2 py-0.5 text-[10px] font-extrabold text-emerald-900">
                    {PRICE_UPDATE_INFO.date}
                  </span>
                </h3>
                <span className="rounded-md bg-white/90 border border-emerald-200 px-2 py-0.2 text-[10px] font-semibold text-emerald-800">
                  {PRICE_UPDATE_INFO.region}
                </span>
              </div>
              <p className="text-xs text-emerald-800/90 mt-1">
                {pricingScenario === 'max'
                  ? 'Mostrando el PEOR ESCENARIO (Precios Máximos / Techo de góndola) para que presupuestes con el costo más alto posible y compres con total tranquilidad.'
                  : 'Valores promedio de referencia en pesos argentinos (ARS) para más de 130 alimentos y artículos habituales.'}
              </p>
            </div>
          </div>

          {/* Scenario selector inside Catalog */}
          {onUpdatePricingScenario && (
            <div className="flex items-center gap-1 bg-white/90 p-1 rounded-xl border border-emerald-200/80 shadow-2xs shrink-0 self-start">
              <button
                onClick={() => onUpdatePricingScenario('max')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition ${
                  pricingScenario === 'max'
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldAlert className="h-3 w-3" />
                <span>🛡️ Peor Escenario</span>
              </button>
              <button
                onClick={() => onUpdatePricingScenario('avg')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                  pricingScenario === 'avg'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Promedio</span>
              </button>
              <button
                onClick={() => onUpdatePricingScenario('min')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                  pricingScenario === 'min'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Ofertas</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar alimento, marca o producto (ej: leche, carne, fideos, yerba...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-slate-50/50 pl-10 pr-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 transition"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 p-0.5"
            >
              Borrar
            </button>
          )}
        </div>

        {/* Category Pills with flex-wrap so all categories are visible and clickable */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Categorías de productos:
            </span>
            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
                className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
              >
                Mostrar todas ({catalog.length})
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todos ({catalog.length})
            </button>

            {CATEGORIES.map((cat) => {
              const count = catalog.filter((p) => p.category === cat.id).length;
              if (count === 0) return null;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(isSelected ? 'all' : cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                  <span className={`text-[10px] ${isSelected ? 'text-emerald-100 font-bold' : 'text-slate-400'}`}>
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredProducts.map((product) => {
          const isAdded = activeProductNames.has(product.name.toLowerCase());
          const cat = CATEGORIES.find((c) => c.id === product.category) || CATEGORIES[0];
          // Use price corresponding to active scenario (max/avg/min)
          const displayPrice = getProductPriceForScenario(product, pricingScenario);

          return (
            <div
              key={product.id}
              className={`rounded-2xl border p-4 bg-white transition shadow-2xs hover:shadow-xs flex flex-col justify-between ${
                isAdded ? 'border-emerald-300 bg-emerald-50/20' : 'border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium border ${cat.color}`}>
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </span>
                  {pricingScenario === 'max' ? (
                    <span className="rounded-md bg-amber-50 text-amber-900 px-1.5 py-0.5 text-[10px] font-extrabold border border-amber-300 flex items-center gap-1">
                      <ShieldAlert className="h-3 w-3 text-amber-600" />
                      <span>Techo Máx</span>
                    </span>
                  ) : product.isCustom ? (
                    <span className="rounded-md bg-purple-50 text-purple-700 px-1.5 py-0.5 text-[10px] font-medium border border-purple-200">
                      Personalizado
                    </span>
                  ) : null}
                </div>

                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                  {product.name}
                </h4>

                {product.brandExample && (
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Ref: {product.brandExample}
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-base font-extrabold text-slate-900">
                      {formatARS(displayPrice)}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      /{product.unit}
                    </span>
                  </div>

                  {product.priceMin && product.priceMax ? (
                    <p className="text-[10px] text-slate-500">
                      Rango: {formatARS(product.priceMin)} - {formatARS(product.priceMax)}
                    </p>
                  ) : null}
                </div>

                <button
                  onClick={() => onAddFromCatalog({ ...product, price: displayPrice })}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-2xs active:scale-95 transition ${
                    isAdded
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>En lista</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-3.5 w-3.5" />
                      <span>Agregar</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
