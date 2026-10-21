import { UnitType } from '../types';

export function formatARS(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '$ 0';
  }
  // Standard Argentine currency format: $ 1.450 or $ 12.500
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(amount).replace('ARS', '$').trim();
}

export function formatUnitLabel(unit: UnitType, quantity: number = 1): string {
  switch (unit) {
    case 'kg':
      return quantity === 1 ? 'kg' : 'kg';
    case 'g':
      return 'g';
    case 'L':
      return quantity === 1 ? 'L' : 'L';
    case 'ml':
      return 'ml';
    case 'paquete':
      return quantity === 1 ? 'paq.' : 'paqs.';
    case 'u':
    default:
      return quantity === 1 ? 'unidad' : 'unidades';
  }
}
