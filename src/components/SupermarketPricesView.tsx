import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Search, 
  Plus, 
  Check, 
  Calendar, 
  TrendingDown, 
  TrendingUp, 
  Sparkles, 
  Info, 
  Tag, 
  CheckCircle2, 
  ArrowRight,
  ShoppingCart,
  Store,
  Layers,
  Award
} from 'lucide-react';
import { CatalogProduct, CategoryId, ShoppingItem, SupermarketId, SupermarketChain } from '../types';
import { 
  PRICE_UPDATE_INFO, 
  SUPERMARKET_CHAINS, 
  CATEGORIES, 
  getProductPriceForSupermarket 
} from '../data/supermarketData';
import { formatARS } from '../utils/formatters';

interface Props {
  catalog: CatalogProduct[];
  activeItems: ShoppingItem[];
  onAddFromCatalogWithPrice: (product: CatalogProduct, price: number, supermarketName: string) => void;
  onApplySupermarketToList: (supermarketId: SupermarketId) => void;
}

export const SupermarketPricesView: React.FC<Props> = ({
  catalog,
  activeItems,
  onAddFromCatalogWithPrice,
  onApplySupermarketToList,
}) => {
  const [selectedSupermarketId, setSelectedSupermarketId] = useState<SupermarketId | 'compare'>('coto');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  const selectedChain = useMemo(() => {
    if (selectedSupermarketId === 'compare') return null;
    return SUPERMARKET_CHAINS.find((c) => c.id === selectedSupermarketId) || SUPERMARKET_CHAINS[0];
  }, [selectedSupermarketId]);

  // Set of names in user's active shopping list
  const activeItemsMap = useMemo(() => {
    const map = new Map<string, number>();
    activeItems.forEach((item) => {
      map.set(item.name.toLowerCase(), (map.get(item.name.toLowerCase()) || 0) + item.quantity);
    });
    return map;
  }, [activeItems]);

  // Filter products by category and search
  const filteredProducts = useMemo(() => {
    return catalog.filter((product) => {
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchName = product.name.toLowerCase().includes(query);
        const matchBrand = product.brandExample?.toLowerCase().includes(query) ?? false;
        return matchName || matchBrand;
      }
      return true;
    });
  }, [catalog, selectedCategory, searchTerm]);

  // Simulation of current shopping list cost across all supermarkets
  const listCostSimulation = useMemo(() => {
    if (activeItems.length === 0) return null;

    const costs = SUPERMARKET_CHAINS.map((chain) => {
      let total = 0;
      activeItems.forEach((item) => {
        // Try to match catalog product for category multiplier
        const catalogProd = catalog.find((p) => p.name.toLowerCase() === item.name.toLowerCase());
        let unitPriceInChain = item.unitPrice;
        if (catalogProd) {
          unitPriceInChain = getProductPriceForSupermarket(catalogProd, chain.id);
        } else {
          // If custom item, use chain general modifier
          unitPriceInChain = Math.round((item.unitPrice * chain.priceModifier) / 10) * 10;
        }
        total += unitPriceInChain * item.quantity;
      });

      return {
        chain,
        total,
      };
    });

    costs.sort((a, b) => a.total - b.total);
    const cheapest = costs[0];
    const mostExpensive = costs[costs.length - 1];
    const savings = mostExpensive.total - cheapest.total;

    return {
      costs,
      cheapest,
      mostExpensive,
      savings,
    };
  }, [activeItems, catalog]);

  const handleAddProduct = (product: CatalogProduct, price: number, supermarketName: string) => {
    onAddFromCatalogWithPrice(product, price, supermarketName);
    setJustAddedId(`${product.id}-${selectedSupermarketId}`);
    setTimeout(() => {
      setJustAddedId(null);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header Information & Update Date Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 p-5 text-white shadow-lg border border-emerald-800/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 ring-1 ring-inset ring-emerald-400/30">
                <Calendar className="h-3.5 w-3.5" />
                Actualizado al: {PRICE_UPDATE_INFO.date}
              </span>
              <span className="rounded-full bg-slate-800/80 px-2.5 py-0.5 text-[11px] font-semibold text-slate-300 border border-slate-700">
                {PRICE_UPDATE_INFO.region}
              </span>
            </div>
            <h2 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
              <Store className="h-5 w-5 text-emerald-400" />
              <span>Lista de Precios por Supermercado</span>
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Compará los precios reales de góndola en las principales cadenas de la Provincia de Buenos Aires (<strong>Coto, Carrefour, Día%, Jumbo, ChangoMás y Vea</strong>). Podés sumar productos directamente con el precio de la sucursal elegida.
            </p>
          </div>

          <div className="flex md:flex-col items-center md:items-end justify-between gap-2 border-t md:border-t-0 border-slate-800 pt-3 md:pt-0 shrink-0">
            <div className="text-left md:text-right">
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
                Cobertura Bonaerense
              </span>
              <span className="text-xs font-semibold text-slate-200">
                6 Cadenas Líderes • 130+ Alimentos
              </span>
            </div>
            <span className="text-[11px] text-slate-400 italic">
              {PRICE_UPDATE_INFO.week}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Simulation Card: How much your current list costs in each supermarket */}
      {listCostSimulation && (
        <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-emerald-600" />
                <span>Simulación de tu lista actual ({activeItems.length} artículos)</span>
                <span className="rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5">
                  Comparador Inteligente
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Costo total estimado según las listas de precios vigentes en cada cadena:
              </p>
            </div>
            {listCostSimulation.savings > 0 && (
              <div className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-1.5 border border-emerald-200 text-xs font-bold text-emerald-800">
                <Award className="h-4 w-4 text-emerald-600" />
                <span>Podés ahorrar hasta {formatARS(listCostSimulation.savings)} comprando en {listCostSimulation.cheapest.chain.shortName}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {listCostSimulation.costs.map((item, index) => {
              const isCheapest = index === 0;
              const isSelected = selectedSupermarketId === item.chain.id;
              return (
                <div
                  key={item.chain.id}
                  onClick={() => setSelectedSupermarketId(item.chain.id)}
                  className={`cursor-pointer rounded-xl p-3 border text-left transition-all relative ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-500'
                      : isCheapest
                      ? 'border-emerald-300 bg-emerald-50/30 hover:border-emerald-400'
                      : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-100/50'
                  }`}
                >
                  {isCheapest && (
                    <span className="absolute -top-2.5 right-2 rounded-full bg-emerald-600 text-white text-[9px] font-extrabold px-1.5 py-0.2 shadow-xs">
                      Más Barato
                    </span>
                  )}
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{item.chain.logoEmoji}</span>
                    <span className="text-xs font-bold text-slate-800 truncate">
                      {item.chain.shortName}
                    </span>
                  </div>
                  <div className="mt-1.5">
                    <span className="text-sm font-black text-slate-900 block leading-tight">
                      {formatARS(item.total)}
                    </span>
                    <span className={`text-[10px] font-medium block mt-0.5 ${
                      isCheapest ? 'text-emerald-700 font-bold' : 'text-slate-500'
                    }`}>
                      {isCheapest ? 'Opción económica' : `+${formatARS(item.total - listCostSimulation.cheapest.total)}`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {selectedChain && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <span className="text-xs text-slate-600">
                ¿Querés ajustar todos los precios de tu lista actual a los valores de <strong>{selectedChain.name}</strong>?
              </span>
              <button
                onClick={() => onApplySupermarketToList(selectedChain.id)}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-800 px-3.5 py-2 text-xs font-bold text-white hover:bg-slate-900 transition shadow-xs"
              >
                <span>Aplicar precios de {selectedChain.shortName} a Mi Lista</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* 3. Supermarket Selection Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Seleccioná un supermercado para ver su lista de precios:
          </h3>
          <span className="text-xs text-slate-500">
            {filteredProducts.length} productos disponibles
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {SUPERMARKET_CHAINS.map((chain) => {
            const isSelected = selectedSupermarketId === chain.id;
            return (
              <button
                key={chain.id}
                onClick={() => setSelectedSupermarketId(chain.id)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition whitespace-nowrap border shrink-0 ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-600 text-white shadow-sm'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span>{chain.logoEmoji}</span>
                <span>{chain.shortName}</span>
                <span className={`rounded-md px-1.5 py-0.2 text-[10px] font-semibold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {chain.badge}
                </span>
              </button>
            );
          })}

          <button
            onClick={() => setSelectedSupermarketId('compare')}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition whitespace-nowrap border shrink-0 ${
              selectedSupermarketId === 'compare'
                ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Comparador Todos los Súper</span>
          </button>
        </div>
      </div>

      {/* Selected Supermarket Banner / Tips */}
      {selectedChain && (
        <div className={`rounded-2xl border p-4 ${selectedChain.bgColor} ${selectedChain.borderColor}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedChain.logoEmoji}</span>
                <h4 className="text-base font-extrabold text-slate-900">
                  {selectedChain.name}
                </h4>
                <span className="rounded-md bg-white/80 px-2 py-0.5 text-[11px] font-bold text-slate-700 border border-slate-200 shadow-2xs">
                  {selectedChain.badge}
                </span>
              </div>
              <p className="text-xs text-slate-600">
                {selectedChain.tagline}
              </p>
            </div>

            <div className="rounded-xl bg-white/90 p-3 border border-slate-200/80 text-xs text-slate-700 space-y-1 sm:max-w-md shadow-2xs">
              <div className="flex items-start gap-1.5 font-bold text-slate-900">
                <Sparkles className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span>Tip de Ahorro: {selectedChain.discountDayTip}</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                {selectedChain.promosTip}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. Filters & Search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por alimento o marca (ej: leche, yerba, asado, fideos, skip, coca...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 transition"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-3 text-xs text-slate-400 hover:text-slate-600"
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

          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todas ({catalog.length})
            </button>
            {CATEGORIES.map((cat) => {
              const count = catalog.filter((p) => p.category === cat.id).length;
              if (count === 0) return null;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(isSelected ? 'all' : cat.id)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition ${
                    isSelected
                      ? 'bg-emerald-600 text-white'
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

      {/* 5. Products Display */}
      {selectedSupermarketId !== 'compare' ? (
        /* Single Supermarket List View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredProducts.map((product) => {
            const chainPrice = getProductPriceForSupermarket(product, selectedSupermarketId);
            const diff = chainPrice - product.price;
            const categoryObj = CATEGORIES.find((c) => c.id === product.category);
            const inListQty = activeItemsMap.get(product.name.toLowerCase()) || 0;
            const isJustAdded = justAddedId === `${product.id}-${selectedSupermarketId}`;

            return (
              <div
                key={product.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs hover:shadow-sm hover:border-slate-300 transition"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                      <span>{categoryObj?.icon}</span>
                      <span>{categoryObj?.name}</span>
                    </span>

                    {/* Comparison badge vs market average */}
                    {diff < -50 ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                        <TrendingDown className="h-3 w-3 text-emerald-600" />
                        <span>-{formatARS(Math.abs(diff))} más barato</span>
                      </span>
                    ) : diff > 50 ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-800 border border-rose-200">
                        <TrendingUp className="h-3 w-3 text-rose-600" />
                        <span>+{formatARS(diff)}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600">
                        Precio promedio
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm mt-2 leading-snug">
                    {product.name}
                  </h4>

                  {product.brandExample && (
                    <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                      <Tag className="h-3 w-3 text-slate-400 shrink-0" />
                      <span className="truncate">{product.brandExample}</span>
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">
                      Precio en {selectedChain?.shortName}:
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-black text-slate-900">
                        {formatARS(chainPrice)}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        / {product.unit}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddProduct(product, chainPrice, selectedChain?.shortName || '')}
                    className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition shadow-xs ${
                      isJustAdded
                        ? 'bg-emerald-600 text-white'
                        : inListQty > 0
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95'
                    }`}
                  >
                    {isJustAdded ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        <span>¡Sumado!</span>
                      </>
                    ) : inListQty > 0 ? (
                      <>
                        <Plus className="h-3.5 w-3.5" />
                        <span>Agregar ({inListQty})</span>
                      </>
                    ) : (
                      <>
                        <Plus className="h-3.5 w-3.5" />
                        <span>+ Agregar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Multi-supermarket Side-by-Side Comparison Table */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-bold text-slate-800 min-w-[200px]">Producto / Categoría</th>
                  <th className="py-3 px-3 font-bold text-center">Promedio PBA</th>
                  {SUPERMARKET_CHAINS.map((chain) => (
                    <th key={chain.id} className="py-3 px-3 font-bold text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-sm">{chain.logoEmoji}</span>
                        <span className="font-extrabold text-slate-800">{chain.shortName}</span>
                      </div>
                    </th>
                  ))}
                  <th className="py-3 px-4 font-bold text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((product) => {
                  const prices = SUPERMARKET_CHAINS.map((c) => ({
                    chain: c,
                    price: getProductPriceForSupermarket(product, c.id),
                  }));
                  const minPrice = Math.min(...prices.map((p) => p.price));
                  const inListQty = activeItemsMap.get(product.name.toLowerCase()) || 0;

                  return (
                    <tr key={product.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-900 text-xs">
                          {product.name}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {product.brandExample} • <span className="font-medium text-slate-600">{product.unit}</span>
                        </p>
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-slate-600 bg-slate-50/50">
                        {formatARS(product.price)}
                      </td>
                      {prices.map(({ chain, price }) => {
                        const isBestPrice = price === minPrice;
                        return (
                          <td
                            key={chain.id}
                            className={`py-3 px-3 text-center font-bold ${
                              isBestPrice
                                ? 'bg-emerald-50/70 text-emerald-900'
                                : 'text-slate-700'
                            }`}
                          >
                            <span className={isBestPrice ? 'font-extrabold' : ''}>
                              {formatARS(price)}
                            </span>
                            {isBestPrice && (
                              <span className="block text-[9px] font-extrabold text-emerald-700">
                                Mejor
                              </span>
                            )}
                          </td>
                        );
                      })}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleAddProduct(product, minPrice, 'Mejor Precio')}
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1.5 font-bold text-[11px] transition shadow-xs"
                          title="Agregar con el mejor precio disponible"
                        >
                          <Plus className="h-3 w-3" />
                          <span>{inListQty > 0 ? `+ (${inListQty})` : '+ Agregar'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Footer reference notice */}
      <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 text-xs text-slate-500 flex items-start gap-2.5">
        <Info className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Aviso metodológico:</strong> {PRICE_UPDATE_INFO.disclaimer}
        </p>
      </div>
    </div>
  );
};
