import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Printer, 
  Share2, 
  FileDown, 
  FileText, 
  Smartphone, 
  ShieldAlert, 
  TrendingUp, 
  Tag,
  CheckCircle2
} from 'lucide-react';
import { ShoppingItem, BudgetConfig, PricingScenario } from '../types';
import { formatARS } from '../utils/formatters';
import { CATEGORIES } from '../data/supermarketData';
import { generateShoppingListPdf } from '../utils/pdfGenerator';
import { formatWhatsAppItemLine } from '../utils/productSimplifier';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  items: ShoppingItem[];
  totalPrice: number;
  spentInCart?: number;
  budget?: BudgetConfig;
  pricingScenario?: PricingScenario;
  onUpdatePricingScenario?: (scenario: PricingScenario) => void;
}

export const ShareListModal: React.FC<Props> = ({
  isOpen,
  onClose,
  items,
  totalPrice,
  spentInCart = 0,
  budget,
  pricingScenario = 'max',
  onUpdatePricingScenario,
}) => {
  const [copied, setCopied] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  // Default is false: simplified clean format without individual item prices, only final total
  const [includeItemPrices, setIncludeItemPrices] = useState(false);

  if (!isOpen) return null;

  // Generate plain text formatted list for WhatsApp
  const generateListText = () => {
    let text = `🛒 *MI LISTA DE SUPERMERCADO*\n`;
    text += `📅 Fecha: ${new Date().toLocaleDateString('es-AR')}\n`;
    if (pricingScenario === 'max') {
      text += `🛡️ *Panorama: Peor Escenario (Precios más altos de góndola)*\n`;
    } else if (pricingScenario === 'min') {
      text += `🏷️ *Panorama: Precios de Oferta y Descuentos*\n`;
    }
    text += `---------------------------------\n\n`;

    const categoryMap = new Map<string, ShoppingItem[]>();
    items.forEach((item) => {
      const list = categoryMap.get(item.category) || [];
      list.push(item);
      categoryMap.set(item.category, list);
    });

    CATEGORIES.forEach((cat) => {
      const catItems = categoryMap.get(cat.id);
      if (catItems && catItems.length > 0) {
        text += `${cat.icon} *${cat.name.toUpperCase()}*\n`;
        catItems.forEach((item) => {
          // Format line using formatWhatsAppItemLine:
          // clean name, no x1 if 1, and NO item price unless explicitly enabled
          const line = formatWhatsAppItemLine(
            item,
            includeItemPrices,
            item.unitPrice,
            formatARS(item.unitPrice * item.quantity)
          );
          text += `${line}\n`;
        });
        text += `\n`;
      }
    });

    text += `---------------------------------\n`;
    if (pricingScenario === 'max') {
      text += `💰 *PRECIO FINAL ESTIMADO: ${formatARS(totalPrice)}*\n`;
      text += `🛡️ _(Calculado con el peor escenario / precios más altos para garantizar que el dinero alcance en caja)_\n`;
    } else {
      text += `💰 *PRECIO FINAL ESTIMADO: ${formatARS(totalPrice)}*\n`;
    }

    if (spentInCart > 0) {
      text += `🛒 Ya comprado en carrito: ${formatARS(spentInCart)}\n`;
    }
    text += `\nCreado con SuperLista · Prov. de Buenos Aires\n`;
    return text;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateListText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleSendWhatsapp = () => {
    const text = encodeURIComponent(generateListText());
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadTxt = () => {
    const text = generateListText();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Lista-Supermercado-${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPdf = () => {
    setDownloadingPdf(true);
    try {
      generateShoppingListPdf({
        items,
        totalPrice,
        spentInCart,
        budget,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setDownloadingPdf(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
              <Share2 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Opciones de Lista y WhatsApp
              </h3>
              <p className="text-xs text-slate-500">
                {items.length} artículos · {pricingScenario === 'max' ? 'Peor escenario: ' : 'Total estimado: '}
                <strong className="text-emerald-700">{formatARS(totalPrice)}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Panorama de Precios (Peor escenario / Precios más altos) */}
          {onUpdatePricingScenario && (
            <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-amber-700" />
                  <span className="text-xs font-bold text-amber-950">
                    Panorama de Precios para el Total
                  </span>
                </div>
                {pricingScenario === 'max' && (
                  <span className="text-[10px] font-extrabold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                    Activo: Peor Escenario
                  </span>
                )}
              </div>
              <p className="text-[11px] text-amber-900/90 leading-tight">
                Podés seleccionar calcular con los valores más altos posibles (techo de góndola) para contemplar el peor escenario y que no te falte dinero en el supermercado.
              </p>
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => onUpdatePricingScenario('max')}
                  className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs font-extrabold transition border ${
                    pricingScenario === 'max'
                      ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-xs ring-1 ring-amber-500'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <ShieldAlert className="h-3.5 w-3.5 text-amber-900" />
                  <span>🛡️ Peor Escenario</span>
                </button>
                <button
                  type="button"
                  onClick={() => onUpdatePricingScenario('avg')}
                  className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs font-bold transition border ${
                    pricingScenario === 'avg'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span>Promedio</span>
                </button>
                <button
                  type="button"
                  onClick={() => onUpdatePricingScenario('min')}
                  className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs font-bold transition border ${
                    pricingScenario === 'min'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span>Ofertas</span>
                </button>
              </div>
            </div>
          )}

          {/* Format Settings for WhatsApp */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5 pr-2">
                <span className="text-xs font-bold text-slate-900 block">
                  Formato de texto para WhatsApp
                </span>
                <span className="text-[11px] text-slate-500 block">
                  {!includeItemPrices 
                    ? 'Nombres simplificados (ej: "Lentejas 400g") sin precios individuales, únicamente el PRECIO FINAL al pie.' 
                    : 'Mostrando precios individuales en cada renglón.'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIncludeItemPrices(!includeItemPrices)}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                  !includeItemPrices
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span>{!includeItemPrices ? '✓ Solo Precio Final' : 'Ver Precios x Ítem'}</span>
              </button>
            </div>
          </div>

          {/* Quick WhatsApp Action Button */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleSendWhatsapp}
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 active:scale-98 transition"
            >
              <Smartphone className="h-4 w-4" />
              <span>Enviar por WhatsApp</span>
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 active:scale-98 transition"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4 text-slate-600" />}
              <span>{copied ? '¡Copiado!' : 'Copiar Texto'}</span>
            </button>
          </div>

          {/* Preview textarea */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <span>Vista previa del mensaje:</span>
                <span className="rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-semibold px-1.5 py-0.2">
                  {!includeItemPrices ? 'Solo Precio Final' : 'Precios Detallados'}
                </span>
                {pricingScenario === 'max' && (
                  <span className="rounded-md bg-amber-100 text-amber-900 text-[10px] font-semibold px-1.5 py-0.2">
                    Peor Escenario
                  </span>
                )}
              </label>
              <span className="text-[10px] text-slate-400">
                Nombres limpios y simplificados
              </span>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 max-h-48 overflow-y-auto font-mono text-xs text-slate-800 whitespace-pre-wrap select-all">
              {generateListText()}
            </div>
          </div>

          {/* Featured PDF Download Card */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-2xs">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-emerald-950">
                    Descargar en Documento PDF Formateado
                  </h4>
                  <p className="text-[11px] text-emerald-800/90 mt-0.5">
                    Diseño listo para imprimir en A4 o guardar en el teléfono.
                  </p>
                </div>
              </div>

              <button
                onClick={handleDownloadPdf}
                disabled={downloadingPdf || items.length === 0}
                className="shrink-0 flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-emerald-700 active:scale-98 transition disabled:opacity-50"
              >
                <FileDown className="h-3.5 w-3.5" />
                <span>{downloadingPdf ? 'Generando...' : 'Descargar PDF'}</span>
              </button>
            </div>
          </div>

          {/* Secondary print / TXT buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleDownloadTxt}
              className="flex items-center justify-center gap-1.5 p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition"
            >
              <FileDown className="h-3.5 w-3.5 text-slate-500" />
              <span>Guardar Archivo .TXT</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-1.5 p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition"
            >
              <Printer className="h-3.5 w-3.5 text-slate-500" />
              <span>Imprimir</span>
            </button>
          </div>
        </div>

        <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-200 hover:bg-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
