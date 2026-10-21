import React, { useState, useMemo } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { PieChart as PieChartIcon, TrendingUp, Info } from 'lucide-react';
import { ShoppingItem, CategoryId } from '../types';
import { CATEGORIES } from '../data/supermarketData';
import { formatARS } from '../utils/formatters';

interface Props {
  items: ShoppingItem[];
}

const CATEGORY_COLORS: Record<CategoryId, string> = {
  almacen: '#f59e0b',     // Amber
  lacteos: '#3b82f6',     // Blue
  carniceria: '#f43f5e',  // Rose
  verduleria: '#10b981',  // Emerald
  panaderia: '#f97316',   // Orange
  bebidas: '#14b8a6',     // Teal
  limpieza: '#0284c7',    // Sky
  perfumeria: '#a855f7',  // Purple
  congelados: '#06b6d4',  // Cyan
  mascotas: '#84cc16',    // Lime
  otros: '#64748b',       // Slate
};

export const BudgetCategoryChart: React.FC<Props> = ({ items }) => {
  // Mode: 'all' (all planned list items) vs 'cart' (only items checked into the shopping cart)
  const [filterMode, setFilterMode] = useState<'cart' | 'all'>('cart');

  const { chartData, totalAmount, activeCount } = useMemo(() => {
    const targetItems = filterMode === 'cart' 
      ? items.filter((i) => i.checked) 
      : items;

    const total = targetItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

    const categoryTotals = new Map<CategoryId, { amount: number; count: number }>();
    CATEGORIES.forEach((cat) => {
      categoryTotals.set(cat.id, { amount: 0, count: 0 });
    });

    targetItems.forEach((item) => {
      const current = categoryTotals.get(item.category) || { amount: 0, count: 0 };
      current.amount += item.unitPrice * item.quantity;
      current.count += item.quantity;
      categoryTotals.set(item.category, current);
    });

    const data = CATEGORIES.map((cat) => {
      const stat = categoryTotals.get(cat.id) || { amount: 0, count: 0 };
      const percentage = total > 0 ? (stat.amount / total) * 100 : 0;
      return {
        id: cat.id,
        name: cat.name,
        icon: cat.icon,
        value: stat.amount,
        count: stat.count,
        percentage: Math.round(percentage * 10) / 10,
        color: CATEGORY_COLORS[cat.id] || '#64748b',
      };
    })
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value);

    return {
      chartData: data,
      totalAmount: total,
      activeCount: targetItems.length,
    };
  }, [items, filterMode]);

  // If there are no items in list or no items with price, show friendly state
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
      {/* Title & Filter switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <PieChartIcon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Desglose de Gastos por Categoría
            </h3>
            <p className="text-xs text-slate-500">
              Distribución visual del presupuesto en tus compras
            </p>
          </div>
        </div>

        {/* Filter mode pill toggle */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setFilterMode('cart')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filterMode === 'cart'
                ? 'bg-white text-emerald-800 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Gastado en Carrito
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filterMode === 'all'
                ? 'bg-white text-emerald-800 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Total Planificado
          </button>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="py-8 text-center text-slate-500 text-xs">
          <Info className="h-6 w-6 text-slate-400 mx-auto mb-2" />
          {filterMode === 'cart' ? (
            <p>
              Todavía no marcaste artículos en el carrito con precio estimado.<br />
              Cambiá a <strong>"Total Planificado"</strong> o tildá artículos a medida que los sumes en el súper.
            </p>
          ) : (
            <p>No hay artículos con precio asignado en la lista para graficar.</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Pie Chart container */}
          <div className="md:col-span-5 flex flex-col items-center justify-center relative">
            <div className="w-full h-64 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    animationDuration={600}
                  >
                    {chartData.map((entry) => (
                      <Cell key={`cell-${entry.id}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="rounded-xl bg-slate-900/95 text-white px-3 py-2 text-xs shadow-xl backdrop-blur-xs border border-slate-700 space-y-0.5">
                            <p className="font-bold flex items-center gap-1.5 text-white">
                              <span>{data.icon}</span>
                              <span>{data.name}</span>
                            </p>
                            <p className="text-emerald-300 font-extrabold text-sm">
                              {formatARS(data.value)}
                            </p>
                            <p className="text-[11px] text-slate-300">
                              {data.percentage}% del presupuesto analizado
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Center stat inside donut hole */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                  {filterMode === 'cart' ? 'En Carrito' : 'Total'}
                </span>
                <span className="text-sm font-extrabold text-slate-800">
                  {formatARS(totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Breakdown items list */}
          <div className="md:col-span-7 space-y-2">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Categoría</span>
              <span>Gasto y Porcentaje</span>
            </div>

            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
              {chartData.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition text-xs"
                >
                  {/* Left: Icon & Name */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span 
                      className="h-3 w-3 rounded-full shrink-0" 
                      style={{ backgroundColor: item.color }} 
                    />
                    <span className="text-sm">{item.icon}</span>
                    <span className="font-semibold text-slate-800 truncate">
                      {item.name}
                    </span>
                  </div>

                  {/* Right: Amount & Percent */}
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-bold text-slate-900">
                      {formatARS(item.value)}
                    </span>
                    <span 
                      className="rounded-md px-1.5 py-0.5 text-[10px] font-bold text-white shrink-0"
                      style={{ backgroundColor: item.color }}
                    >
                      {item.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-slate-400 pt-1 text-right">
              {activeCount} {activeCount === 1 ? 'artículo considerado' : 'artículos considerados'} en este análisis
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
