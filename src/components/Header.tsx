import React from 'react';
import { 
  ShoppingCart, 
  Download, 
  Share2, 
  WifiOff, 
  Laptop, 
  Users,
  FileText,
  Calendar,
  Store,
  Layers,
  Sparkles,
  ShieldAlert,
  TrendingUp,
  Tag
} from 'lucide-react';
import { formatARS } from '../utils/formatters';
import { UserProfile, ConnectionStatus, ActiveTabType, PricingScenario } from '../types';
import { PRICE_UPDATE_INFO } from '../data/supermarketData';

interface Props {
  totalItems: number;
  totalPrice: number;
  purchasedCount: number;
  isInstallable: boolean;
  isInstalled: boolean;
  isOnline: boolean;
  isShared: boolean;
  activeUsers: UserProfile[];
  connectionStatus: ConnectionStatus;
  pricingScenario: PricingScenario;
  onUpdatePricingScenario: (scenario: PricingScenario) => void;
  onOpenWindowsInstall: () => void;
  onOpenShare: () => void;
  onOpenCollab: () => void;
  onExportPdf: () => void;
  onClearList: () => void;
  onClearPurchased: () => void;
  activeTab: ActiveTabType;
  setActiveTab: (tab: ActiveTabType) => void;
}

export const Header: React.FC<Props> = ({
  totalItems,
  totalPrice,
  purchasedCount,
  isInstallable,
  isInstalled,
  isOnline,
  isShared,
  activeUsers,
  connectionStatus,
  pricingScenario,
  onUpdatePricingScenario,
  onOpenWindowsInstall,
  onOpenShare,
  onOpenCollab,
  onExportPdf,
  onClearList,
  onClearPurchased,
  activeTab,
  setActiveTab,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Offline banner if disconnected from network */}
      {!isOnline && (
        <div className="bg-amber-500 text-white px-4 py-1.5 text-xs font-medium flex items-center justify-center gap-1.5">
          <WifiOff className="h-3.5 w-3.5 shrink-0" />
          <span>Sin conexión a internet. La aplicación sigue funcionando y guardando tus datos en esta PC.</span>
        </div>
      )}

      {/* Prominent Price List Update Date Bar & Scenario Switcher */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white px-3 sm:px-4 py-1 text-xs border-b border-emerald-600/50">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Left: Date & Region */}
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 font-bold text-emerald-100">
              <Calendar className="h-3.5 w-3.5 text-emerald-300" />
              <span>Lista de precios:</span>
            </span>
            <span className="rounded-md bg-white/20 px-2 py-0.2 font-black text-white text-[11px] shadow-2xs">
              {PRICE_UPDATE_INFO.date}
            </span>
            <span className="hidden md:inline text-emerald-200/90 text-[11px]">
              • {PRICE_UPDATE_INFO.region}
            </span>
          </div>

          {/* Right: Pricing Scenario Selector (Peor Escenario vs Promedio vs Mínimo) */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-emerald-200 font-bold uppercase tracking-wider hidden sm:inline">
              Panorama:
            </span>
            <div className="flex items-center bg-black/30 p-0.5 rounded-lg border border-white/20">
              <button
                onClick={() => onUpdatePricingScenario('max')}
                className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold transition ${
                  pricingScenario === 'max'
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'text-emerald-100 hover:text-white'
                }`}
                title="Calcula con los precios más altos (techo de góndola) para contemplar el peor escenario posible y evitar sorpresas"
              >
                <ShieldAlert className="h-3 w-3 text-amber-900" />
                <span>🛡️ Peor Escenario (Máx)</span>
              </button>

              <button
                onClick={() => onUpdatePricingScenario('avg')}
                className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold transition ${
                  pricingScenario === 'avg'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-emerald-100 hover:text-white'
                }`}
                title="Calcula con los precios promedio estándar"
              >
                <span>Promedio</span>
              </button>

              <button
                onClick={() => onUpdatePricingScenario('min')}
                className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold transition ${
                  pricingScenario === 'min'
                    ? 'bg-emerald-300 text-emerald-950 shadow-xs'
                    : 'text-emerald-100 hover:text-white'
                }`}
                title="Calcula con precios de oferta y descuento"
              >
                <span>Ofertas</span>
              </button>
            </div>

            <button
              onClick={() => setActiveTab('supermarkets')}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-white/15 hover:bg-white/25 px-2.5 py-0.5 rounded-full transition ml-1"
            >
              <Store className="h-3 w-3" />
              <span className="hidden sm:inline">Precios x súper</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
              <ShoppingCart className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-slate-900 leading-none">
                  SuperLista
                </h1>
                <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                  Bs. As. 2026
                </span>
                {pricingScenario === 'max' && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-extrabold text-amber-900 border border-amber-300">
                    <ShieldAlert className="h-3 w-3 text-amber-600" />
                    <span>Peor Escenario (Máx)</span>
                  </span>
                )}
                {isShared && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-800 border border-teal-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                    <span>En vivo ({activeUsers.length})</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Precios de referencia y lista colaborativa para supermercados
              </p>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Live Multi-user sharing trigger button */}
            <button
              onClick={onOpenCollab}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                isShared
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                  : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
              }`}
              title="Compartir y editar en tiempo real con otros usuarios"
            >
              <Users className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">
                {isShared ? `Compartida (${activeUsers.length})` : 'Compartir en vivo'}
              </span>
            </button>

            {/* Download / Install on Windows button */}
            <button
              onClick={onOpenWindowsInstall}
              className="hidden sm:flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-slate-400 transition"
              title="Descargar aplicación o instalar en el escritorio de Windows"
            >
              <Laptop className="h-3.5 w-3.5 text-emerald-600" />
              <span>Descargar App PC</span>
            </button>

            {/* Direct PDF export button */}
            {totalItems > 0 && (
              <button
                onClick={onExportPdf}
                className="flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 hover:border-emerald-400 transition"
                title="Descargar lista formateada en archivo PDF"
              >
                <FileText className="h-3.5 w-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Exportar PDF</span>
              </button>
            )}

            {/* Export text / WhatsApp options */}
            {totalItems > 0 && (
              <button
                onClick={onOpenShare}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 transition"
                title="Ver texto para WhatsApp u opciones de exportación"
              >
                <Share2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Opciones / WhatsApp</span>
              </button>
            )}

            {/* Total Budget Pill in header */}
            <div className="hidden lg:flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-1.5">
              <span className="text-xs text-slate-500">
                {pricingScenario === 'max' ? 'Techo Máx:' : 'Estimado:'}
              </span>
              <span className="text-sm font-black text-emerald-700">
                {formatARS(totalPrice)}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs: Mi Lista vs Precios por Supermercado vs Catálogo General */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-2 pb-2">
          <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl overflow-x-auto scrollbar-none">
            {/* Tab 1: Mi Lista */}
            <button
              onClick={() => setActiveTab('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                activeTab === 'list'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Mi Lista</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[11px] font-bold ${
                activeTab === 'list' 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-slate-200 text-slate-600'
              }`}>
                {totalItems}
              </span>
            </button>

            {/* Tab 2: Precios por Supermercado */}
            <button
              onClick={() => setActiveTab('supermarkets')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                activeTab === 'supermarkets'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Store className="h-3.5 w-3.5 text-emerald-600" />
              <span>Precios por Supermercado</span>
              <span className="rounded-full bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.2">
                6 Súper
              </span>
            </button>

            {/* Tab 3: Catálogo General */}
            <button
              onClick={() => setActiveTab('catalog')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                activeTab === 'catalog'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="h-3.5 w-3.5 text-slate-500" />
              <span>Catálogo Completo</span>
              <span className="text-[10px] text-slate-400">
                (130+)
              </span>
            </button>
          </div>

          {/* Quick List Cleanup options (when in list view and has items) */}
          {activeTab === 'list' && totalItems > 0 && (
            <div className="flex items-center gap-1">
              {purchasedCount > 0 && (
                <button
                  onClick={onClearPurchased}
                  className="text-[11px] text-slate-500 hover:text-emerald-700 px-2 py-1 rounded-md hover:bg-slate-100 transition"
                  title="Eliminar solo los artículos marcados como comprados"
                >
                  Borrar comprados ({purchasedCount})
                </button>
              )}
              <button
                onClick={onClearList}
                className="text-[11px] text-slate-400 hover:text-rose-600 px-2 py-1 rounded-md hover:bg-rose-50 transition"
                title="Vaciar toda la lista"
              >
                Vaciar lista
              </button>
            </div>
          )}

          {/* Mobile Install icon if not installed */}
          {!isInstalled && (
            <button
              onClick={onOpenWindowsInstall}
              className="sm:hidden flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg"
            >
              <Download className="h-3 w-3" />
              <span>Instalar</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
