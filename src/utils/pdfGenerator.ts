import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ShoppingItem, BudgetConfig } from '../types';
import { CATEGORIES } from '../data/supermarketData';
import { formatARS } from './formatters';

interface ExportPdfOptions {
  items: ShoppingItem[];
  budget?: BudgetConfig;
  totalPrice: number;
  spentInCart: number;
}

export function generateShoppingListPdf({
  items,
  budget,
  totalPrice,
  spentInCart,
}: ExportPdfOptions) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const now = new Date();
  const dateFormatted = now.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  // Header Background bar
  doc.setFillColor(5, 150, 105); // Emerald-600
  doc.rect(0, 0, 210, 28, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('SuperLista · Lista del Supermercado', 14, 12);

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Precios ref. PBA 2026 (Coto, Carrefour, Día%, Jumbo, ChangoMás, Vea)', 14, 19);

  // Date on right
  doc.setFontSize(9);
  doc.text(`Emisión: ${dateFormatted}`, 196, 19, { align: 'right' });

  // Summary box
  let currentY = 35;
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.roundedRect(14, currentY, 182, 16, 2, 2, 'FD');

  doc.setTextColor(51, 65, 85); // slate-700
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(`Total Estimado: ${formatARS(totalPrice)}`, 20, currentY + 10);

  doc.setFont('helvetica', 'normal');
  doc.text(`Artículos: ${items.length} (${items.filter(i => i.checked).length} en carrito)`, 90, currentY + 10);

  if (budget && budget.enabled && budget.totalBudget > 0) {
    const remaining = budget.totalBudget - spentInCart;
    const isOver = remaining < 0;
    doc.setTextColor(isOver ? 220 : 5, isOver ? 38 : 150, isOver ? 38 : 105);
    doc.setFont('helvetica', 'bold');
    doc.text(
      isOver ? `Excedido por: ${formatARS(Math.abs(remaining))}` : `Disponible: ${formatARS(remaining)}`,
      190,
      currentY + 10,
      { align: 'right' }
    );
  }

  currentY += 24;

  // Prepare table data grouped by category
  const categoryMap = new Map<string, ShoppingItem[]>();
  items.forEach((item) => {
    const list = categoryMap.get(item.category) || [];
    list.push(item);
    categoryMap.set(item.category, list);
  });

  const tableRows: any[] = [];

  CATEGORIES.forEach((cat) => {
    const catItems = categoryMap.get(cat.id);
    if (!catItems || catItems.length === 0) return;

    // Category Header row spanning all columns
    const catTotal = catItems.reduce((sum, i) => sum + (i.unitPrice * i.quantity), 0);
    tableRows.push([
      {
        content: `${cat.name.toUpperCase()} (Subtotal: ${formatARS(catTotal)})`,
        colSpan: 5,
        styles: {
          fillColor: [241, 245, 249],
          textColor: [30, 41, 59],
          fontStyle: 'bold',
          halign: 'left',
        },
      },
    ]);

    // Individual items
    catItems.forEach((item) => {
      const checkStatus = item.checked ? '[X]' : '[  ]';
      const notesText = item.notes ? `\nNota: ${item.notes}` : '';
      const customBadge = item.isCustom ? ' (Personalizado)' : '';
      const productName = `${item.name}${customBadge}${notesText}`;
      const qtyText = `${item.quantity} ${item.unit}`;
      const unitPriceText = formatARS(item.unitPrice);
      const subtotalText = formatARS(item.unitPrice * item.quantity);

      tableRows.push([
        checkStatus,
        qtyText,
        productName,
        unitPriceText,
        subtotalText,
      ]);
    });
  });

  autoTable(doc, {
    startY: currentY,
    head: [['Estado', 'Cantidad', 'Producto / Detalle', 'Precio Unit.', 'Subtotal']],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [5, 150, 105],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'left',
      fontSize: 9,
    },
    styles: {
      fontSize: 8.5,
      cellPadding: 2.5,
      textColor: [30, 41, 59],
      valign: 'middle',
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 16, fontStyle: 'bold' },
      1: { halign: 'center', cellWidth: 24, fontStyle: 'bold' },
      2: { halign: 'left', cellWidth: 'auto' },
      3: { halign: 'right', cellWidth: 28 },
      4: { halign: 'right', cellWidth: 30, fontStyle: 'bold' },
    },
    didDrawPage: (data) => {
      // Footer page numbering
      const pageNumber = (doc as any).internal.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184); // slate-400
      doc.text(
        `SuperLista · Página ${pageNumber} · Guardá o imprimí para llevar al supermercado`,
        105,
        290,
        { align: 'center' }
      );
    },
  });

  const dateFile = now.toISOString().slice(0, 10);
  doc.save(`SuperLista-Supermercado-${dateFile}.pdf`);
}
