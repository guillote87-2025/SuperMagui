import React, { useState } from 'react';
import { 
  Wallet, 
  AlertTriangle, 
  CheckCircle2, 
  Edit3, 
  X, 
  Plus, 
  TrendingUp,
  Percent,
  SlidersHorizontal,
  ShieldAlert,
  RotateCcw
} from 'lucide-react';
import { BudgetConfig, PricingScenario } from '../types';
import { formatARS } from '../utils/formatters';

interface Props {
  budget: BudgetConfig;
  spentInCart: number;
  totalPlanned: number;
  pricingScenario: PricingScenario;
  onUpdateBudget: (budget: BudgetConfig) => void;
  onUpdatePricingScenario: (scenario: PricingScenario) => void;
  onRecalculateListToScenario: (scenario: PricingScenario) => void;
}

export const BudgetTracker: React.FC<Props> = ({
  budget,
  spentInCart,
  totalPlanned,
  pricingScenario,
  onUpdateBudget,
  onUpdatePricingScenario,
  onRecalculateListToScenario,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputBudget, setInputBudget] = useState(budget.totalBudget > 0 ? budget.totalBudget.toString() : '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(inputBudget.replace(/\./g, '').replace(',', '.'));
    if (!isNaN(val) && val > 0) {
      onUpdateBudget({ totalBudget: val, enabled: true });
    } else {
      onUpdateBudget({ totalBudget: 0, enabled: false });
    }
    setIsEditing(false);
  };

  const handleDisable = () => {
    onUpdateBudget({ totalBudget: 0, enabled: false });
    setInputBudget('');
    setIsEditing(false);
  };

  const setPreset = (amount: number) => {
    setInputBudget(amount.toString());
    onUpdateBudget({ totalBudget: amount, enabled: true });
    setIsEditing(false);
  };

  // If budget is not enabled, show a clean, inviting trigger with Scenario info
  if (!budget.enabled || budget.totalBudget <= 0) {
    return (
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-slate-900">
                  Total Estimado de la Lista: <span className="text-emerald-700 text-sm font-extrabold">{formatARS(totalPlanned)}</span>
                </h4>
                {pricingScenario === 'max' && (
                  <span className="rounded-md bg-amber-100 text-amber-900 text-[10px] font-extrabold px-1.5 py-0.2 border border-amber-300">
                    🛡️ Peor Escenario (Máx)
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500">
                {pricingScenario === 'max'
                  ? 'Calculado con los valores más altos posibles (techo) para evitar sorpresas al pagar.'
                  : 'Calculado con los valores promedio de referencia de Buenos Aires.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isEditing ? (
              <form onSubmit={handleSave} className="flex items-center gap-1.5">
                <div className="relative">
                  <span className="absolute left-2.5 top-1.5 text-xs font-bold text-slate-400">$</span>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    placeholder="50000"
                    value={inputBudget}
                    onChange={(e) => setInputBudget(e.target.value)}
                    autoFocus
                    className="w-28 rounded-lg border border-emerald-500 pl-6 pr-2 py-1 text-xs font-bold text-slate-900"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-emerald-700"
                >
                  Fijar
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-xs text-slate-400 hover:text-slate-600 px-1"
                >
                  ✕
                </button>
              </form>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50/70 px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition shrink-0"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Fijar Límite de Presupuesto</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Active budget calculations
  const total = budget.totalBudget;
  const spentPercent = Math.min(100, Math.round((spentInCart / total) * 100));
  const plannedPercent = Math.min(100, Math.round((totalPlanned / total) * 100));
  const remainingBudget = total - spentInCart;
  const isOverBudget = remainingBudget < 0;
  const isNearLimit = !isOverBudget && spentPercent >= 80;

  let statusColor = 'bg-emerald-500';
  let badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-200';
  if (isOverBudget) {
    statusColor = 'bg-rose-500';
    badgeColor = 'bg-rose-100 text-rose-800 border-rose-200';
  } else if (isNearLimit) {
    statusColor = 'bg-amber-500';
    badgeColor = 'bg-amber-100 text-amber-800 border-amber-200';
  }

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3.5">
      {/* Top row: Budget stats & Edit toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            isOverBudget ? 'bg-rose-100 text-rose-700' : isNearLimit ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
          }`}>
            <Wallet className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Presupuesto fijado:</span>
              <span className="text-sm font-bold text-slate-900">
                {formatARS(total)}
              </span>
              <span className={`inline-flex items-center px-1.5 py-0.2 rounded-md text-[10px] font-bold border ${badgeColor}`}>
                {spentPercent}% gastado
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Total planificado en lista: <strong className="text-slate-900">{formatARS(totalPlanned)}</strong> ({plannedPercent}% del presupuesto)
            </p>
          </div>
        </div>

        {/* Edit or remove budget */}
        {isEditing ? (
          <form onSubmit={handleSave} className="flex items-center gap-1.5">
            <div className="relative">
              <span className="absolute left-2.5 top-1.5 text-xs font-bold text-slate-400">$</span>
              <input
                type="number"
                min="1000"
                step="1000"
                value={inputBudget}
                onChange={(e) => setInputBudget(e.target.value)}
                autoFocus
                className="w-24 rounded-lg border border-emerald-500 pl-6 pr-2 py-1 text-xs font-bold text-slate-900"
              />
            </div>
            <button
              type="submit"
              className="rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-emerald-700"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={handleDisable}
              className="text-xs text-rose-600 hover:text-rose-700 px-1"
              title="Quitar presupuesto"
            >
              Quitar
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-xs text-slate-400 hover:text-slate-600 px-1"
            >
              ✕
            </button>
          </form>
        ) : (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
              title="Cambiar monto"
            >
              <Edit3 className="h-3 w-3" />
              <span>Modificar</span>
            </button>
            <button
              onClick={handleDisable}
              className="rounded-lg border border-slate-200 bg-slate-50 p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
              title="Desactivar presupuesto"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700 flex items-center gap-1.5">
            <span>En Carrito:</span>
            <strong className="text-emerald-700">{formatARS(spentInCart)}</strong>
          </span>
          <span className={`font-semibold ${isOverBudget ? 'text-rose-600 font-bold' : 'text-slate-600'}`}>
            {isOverBudget ? (
              <span>Excedido por {formatARS(Math.abs(remainingBudget))}</span>
            ) : (
              <span>Disponible: {formatARS(remainingBudget)}</span>
            )}
          </span>
        </div>

        <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full transition-all duration-300 ${statusColor}`}
            style={{ width: `${spentPercent}%` }}
          />
        </div>
      </div>

      {/* Panorama / Scenario Explanatory Callout */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg mt-0.5 ${
            pricingScenario === 'max' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
          }`}>
            <ShieldAlert className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">
                Panorama de Precios Activo:
              </span>
              <span className={`text-[10px] font-extrabold px-2 py-0.2 rounded-md ${
                pricingScenario === 'max'
                  ? 'bg-amber-200 text-amber-950 border border-amber-300'
                  : pricingScenario === 'min'
                  ? 'bg-emerald-200 text-emerald-950 border border-emerald-300'
                  : 'bg-slate-200 text-slate-800'
              }`}>
                {pricingScenario === 'max' ? '🛡️ Peor Escenario (Precios Máximos)' : pricingScenario === 'min' ? '🏷️ Ofertas (Precios Mínimos)' : '⚖️ Promedio Estándar'}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mt-0.5">
              {pricingScenario === 'max'
                ? 'Estimando con los valores más altos de góndola (techo) para contemplar el peor escenario y evitar sorpresas al pagar.'
                : pricingScenario === 'min'
                ? 'Estimando con valores de oferta y descuentos mínimos.'
                : 'Estimando con el promedio general de referencia en Buenos Aires.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => onRecalculateListToScenario(pricingScenario)}
            className="flex items-center gap-1 rounded-lg bg-white border border-slate-300 hover:border-emerald-500 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 px-2.5 py-1.5 text-xs font-bold transition shadow-2xs"
            title="Ajusta los precios de todos los productos de tu lista al panorama seleccionado"
          >
            <RotateCcw className="h-3.5 w-3.5 text-emerald-600" />
            <span>Ajustar lista a este panorama</span>
          </button>
        </div>
      </div>
    </div>
  );
};
