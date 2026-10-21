import { Category, CatalogProduct, SupermarketChain, SupermarketId, PricingScenario } from '../types';

export const PRICE_UPDATE_INFO = {
  date: '20 de Octubre de 2026',
  dateShort: '20/10/2026',
  week: 'Semana del 19 al 25 de Octubre de 2026',
  region: 'Provincia de Buenos Aires (AMBA e Interior)',
  coverage: 'Relevamiento de precios en góndolas y tiendas online: Coto, Carrefour, Día%, Jumbo, ChangoMás y Vea',
  source: 'Relevamiento semanal de canasta bonaerense • Precios al consumidor en ARS',
  disclaimer: 'Precios promedio de referencia en pesos argentinos (ARS). Los valores pueden presentar variaciones menores según la sucursal de la provincia y promociones bancarias vigentes (Cuenta DNI de Banco Provincia, Modo, Comunidad Coto, Mi Carrefour, Club Día).'
};

export const CATEGORIES: Category[] = [
  { id: 'almacen', name: 'Almacén', icon: '🥫', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  { id: 'lacteos', name: 'Lácteos y Frescos', icon: '🧀', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { id: 'carniceria', name: 'Carnicería y Granja', icon: '🥩', color: 'bg-rose-100 text-rose-800 border-rose-200' },
  { id: 'verduleria', name: 'Frutas y Verduras', icon: '🍎', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  { id: 'panaderia', name: 'Panadería y Pastas', icon: '🥖', color: 'bg-orange-100 text-orange-800 border-orange-200' },
  { id: 'bebidas', name: 'Bebidas e Infusiones', icon: '🧉', color: 'bg-teal-100 text-teal-800 border-teal-200' },
  { id: 'limpieza', name: 'Limpieza del Hogar', icon: '🧼', color: 'bg-sky-100 text-sky-800 border-sky-200' },
  { id: 'perfumeria', name: 'Cuidado Personal', icon: '🧴', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  { id: 'congelados', name: 'Congelados y Prácticos', icon: '❄️', color: 'bg-cyan-100 text-cyan-800 border-cyan-200' },
  { id: 'mascotas', name: 'Mascotas', icon: '🐾', color: 'bg-lime-100 text-lime-800 border-lime-200' },
  { id: 'otros', name: 'Varios y Otros', icon: '🛒', color: 'bg-gray-100 text-gray-800 border-gray-200' },
];

export const SUPERMARKET_CHAINS: SupermarketChain[] = [
  {
    id: 'coto',
    name: 'Coto C.I.C.S.A.',
    shortName: 'Coto',
    tagline: 'Yo te conozco • Líder en carnes y almacén bonaerense',
    badge: 'Excelente en Carnes',
    logoEmoji: '🔴',
    color: 'from-red-600 to-rose-700',
    textColor: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    promosTip: '15% de descuento los martes y jueves con Comunidad Coto. Ofertas agresivas en carnicería propia de exportación.',
    discountDayTip: 'Martes y Jueves (Comunidad) • Fin de semana en carnicería',
    priceModifier: 0.99,
    categoryModifiers: {
      carniceria: 0.93,
      almacen: 0.98,
      panaderia: 0.95,
      lacteos: 1.00,
      bebidas: 0.99,
    },
  },
  {
    id: 'carrefour',
    name: 'Carrefour Argentina',
    shortName: 'Carrefour',
    tagline: 'Hiper, Market y Express en toda la Provincia de Buenos Aires',
    badge: 'Gran Variedad y Marca Propia',
    logoEmoji: '🔵',
    color: 'from-blue-600 to-indigo-700',
    textColor: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    promosTip: 'Programa Mi Carrefour con descuentos del 10% al 15% en marcas propias. Compromiso "Precios Corajudos" en canasta básica.',
    discountDayTip: 'Miércoles y fines de semana • Beneficios Mi Carrefour todos los días',
    priceModifier: 1.01,
    categoryModifiers: {
      almacen: 0.97,
      limpieza: 0.98,
      lacteos: 1.01,
      carniceria: 1.03,
      congelados: 0.99,
    },
  },
  {
    id: 'dia',
    name: 'Supermercados Día%',
    shortName: 'Día%',
    tagline: 'Especialista en Ahorro y Cercanía en cada barrio',
    badge: 'Líder en Ahorro Diario',
    logoEmoji: '🟡',
    color: 'from-amber-500 to-red-600',
    textColor: 'text-red-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    promosTip: 'Cupones personalizados en la App Club Día. Promociones 2x1 y 3x2 en galletitas, fideos y lácteos de marca propia.',
    discountDayTip: 'Lunes a Viernes con cupones de la App • Días Cuenta DNI',
    priceModifier: 0.95,
    categoryModifiers: {
      almacen: 0.91,
      lacteos: 0.93,
      limpieza: 0.92,
      perfumeria: 0.94,
      carniceria: 1.05,
      verduleria: 0.96,
    },
  },
  {
    id: 'jumbo',
    name: 'Jumbo (Cencosud)',
    shortName: 'Jumbo',
    tagline: 'Calidad premium, marcas importadas y frescura seleccionada',
    badge: 'Alta Calidad y Selección',
    logoEmoji: '🟢',
    color: 'from-emerald-600 to-green-700',
    textColor: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    promosTip: 'Beneficios Jumbo Prime con envíos gratis y descuentos exclusivos. La mejor selección en fiambrería, quesos finos y panadería artesanal.',
    discountDayTip: 'Lunes a Miércoles en categorías seleccionadas • Banco Galicia / Santander',
    priceModifier: 1.09,
    categoryModifiers: {
      perfumeria: 1.06,
      bebidas: 1.08,
      lacteos: 1.07,
      verduleria: 1.12,
      carniceria: 1.08,
      congelados: 1.07,
    },
  },
  {
    id: 'changomas',
    name: 'ChangoMás (GDN Argentina)',
    shortName: 'ChangoMás',
    tagline: 'Precios accesibles en conurbano e interior bonaerense',
    badge: 'Precios Populares',
    logoEmoji: '🟠',
    color: 'from-orange-500 to-amber-600',
    textColor: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    promosTip: 'Línea de productos económicos Great Value. Descuentos por volumen en packs familiares y días de Ahorro Chango.',
    discountDayTip: 'Viernes a Domingo en almacén familiar • Promociones Cuenta DNI',
    priceModifier: 0.97,
    categoryModifiers: {
      almacen: 0.94,
      limpieza: 0.95,
      mascotas: 0.93,
      bebidas: 0.96,
      lacteos: 0.98,
      carniceria: 0.99,
    },
  },
  {
    id: 'vea',
    name: 'Supermercados Vea',
    shortName: 'Vea',
    tagline: 'Tu súper de barrio con frescura y precios convenientes',
    badge: 'Frescura de Barrio',
    logoEmoji: '🟣',
    color: 'from-purple-600 to-indigo-700',
    textColor: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    promosTip: 'Descuentos semanales en carnicería y verdulería de estación. Beneficios Vea Ahorro y promociones con tarjetas de bancos bonaerenses.',
    discountDayTip: 'Martes en verdulería • Jueves en carnes • Tarjeta Cencosud',
    priceModifier: 0.98,
    categoryModifiers: {
      verduleria: 0.94,
      carniceria: 0.97,
      panaderia: 0.96,
      almacen: 0.99,
      lacteos: 0.99,
    },
  },
];

/**
 * Calcula de forma determinista el precio de un producto para una cadena específica.
 * Si el producto tiene un precio explícito definido en supermarketPrices, lo usa.
 * Si no, aplica el multiplicador ponderado por categoría de la cadena y redondea a múltiplos de $10 / $50.
 */
export function getProductPriceForSupermarket(product: CatalogProduct, supermarketId: SupermarketId): number {
  if (product.supermarketPrices && product.supermarketPrices[supermarketId]) {
    return product.supermarketPrices[supermarketId]!;
  }

  const chain = SUPERMARKET_CHAINS.find((c) => c.id === supermarketId);
  if (!chain) return product.price;

  const categoryMod = chain.categoryModifiers[product.category] ?? 1.0;
  const combinedFactor = chain.priceModifier * categoryMod;

  // Variación pseudo-aleatoria pero 100% determinista basada en el ID del producto
  let hash = 0;
  for (let i = 0; i < product.id.length; i++) {
    hash = (hash << 5) - hash + product.id.charCodeAt(i);
    hash |= 0;
  }
  const variance = 1 + ((Math.abs(hash) % 11) - 5) * 0.008; // entre -4% y +4%

  const rawPrice = product.price * combinedFactor * variance;
  // Redondeo elegante argentino a decenas (ej: 1450, 2300, 3190)
  if (rawPrice > 1000) {
    return Math.round(rawPrice / 50) * 50;
  }
  return Math.round(rawPrice / 10) * 10;
}

/**
 * Obtiene el precio de un producto según el panorama seleccionado:
 * - 'max': Panorama desalentador / Peor escenario (precios más altos de góndola / techo)
 * - 'avg': Precio promedio estándar de referencia en PBA
 * - 'min': Panorama económico / Ofertas y descuentos mínimos
 */
export function getProductPriceForScenario(product: CatalogProduct, scenario: PricingScenario): number {
  if (scenario === 'max') {
    let highest = product.priceMax || 0;
    if (product.supermarketPrices) {
      const spPrices = Object.values(product.supermarketPrices).filter((p): p is number => typeof p === 'number' && p > 0);
      if (spPrices.length > 0) {
        highest = Math.max(highest, ...spPrices);
      }
    }
    const defaultUpperCeiling = Math.round((product.price * 1.25) / 50) * 50;
    return Math.max(highest, defaultUpperCeiling);
  }
  if (scenario === 'min') {
    let lowest = product.priceMin || 0;
    if (product.supermarketPrices) {
      const spPrices = Object.values(product.supermarketPrices).filter((p): p is number => typeof p === 'number' && p > 0);
      if (spPrices.length > 0) {
        lowest = Math.min(...spPrices);
      }
    }
    const discountFloor = Math.round((product.price * 0.85) / 50) * 50;
    return lowest > 0 ? Math.min(lowest, discountFloor) : discountFloor;
  }
  return product.price;
}

/**
 * Lista amplia y generosa de más de 130 productos de supermercado habituales
 * en la Provincia de Buenos Aires, con marcas icónicas y precios promedio de referencia para Octubre 2026.
 */
export const DEFAULT_CATALOG_PRODUCTS: CatalogProduct[] = [
  // ==========================================
  // --- 1. ALMACÉN Y COMESTIBLES (30 productos) ---
  // ==========================================
  {
    id: 'alm-01',
    name: 'Aceite de Girasol 900 ml',
    category: 'almacen',
    unit: 'u',
    price: 2350,
    priceMin: 1990,
    priceMax: 2750,
    brandExample: 'Natura, Cañuelas, Cocinero',
    supermarketPrices: { dia: 2050, changomas: 2150, coto: 2290, vea: 2320, carrefour: 2350, jumbo: 2650 }
  },
  {
    id: 'alm-02',
    name: 'Aceite de Girasol 1.5 L',
    category: 'almacen',
    unit: 'u',
    price: 3650,
    priceMin: 3100,
    priceMax: 4250,
    brandExample: 'Natura, Cocinero, Lira',
    supermarketPrices: { dia: 3200, changomas: 3350, coto: 3550, carrefour: 3600, vea: 3650, jumbo: 4100 }
  },
  {
    id: 'alm-03',
    name: 'Aceite de Oliva Extra Virgen 500 ml',
    category: 'almacen',
    unit: 'u',
    price: 7900,
    priceMin: 6800,
    priceMax: 9800,
    brandExample: 'Natura Clásico, Cocinero, Zuelo, Oliovita',
    supermarketPrices: { changomas: 7100, coto: 7500, carrefour: 7800, dia: 7400, vea: 7700, jumbo: 8900 }
  },
  {
    id: 'alm-04',
    name: 'Arroz Largo Fino No Se Pasa 1 kg',
    category: 'almacen',
    unit: 'kg',
    price: 1950,
    priceMin: 1590,
    priceMax: 2450,
    brandExample: 'Gallo Oro, Lucchetti, Dos Hermanos',
    supermarketPrices: { dia: 1690, changomas: 1750, coto: 1890, vea: 1920, carrefour: 1950, jumbo: 2350 }
  },
  {
    id: 'alm-05',
    name: 'Arroz Doble Carolina 1 kg',
    category: 'almacen',
    unit: 'kg',
    price: 2450,
    priceMin: 2050,
    priceMax: 2950,
    brandExample: 'Gallo, Máximo, Lucchetti',
    supermarketPrices: { dia: 2150, changomas: 2250, coto: 2390, carrefour: 2450, vea: 2490, jumbo: 2850 }
  },
  {
    id: 'alm-06',
    name: 'Fideos Secos Guiseros / Tirabuzón 500 g',
    category: 'almacen',
    unit: 'paquete',
    price: 1350,
    priceMin: 1050,
    priceMax: 1750,
    brandExample: 'Matarazzo, Lucchetti, Marolio',
    supermarketPrices: { dia: 1100, coto: 1250, changomas: 1250, carrefour: 1300, vea: 1350, jumbo: 1650 }
  },
  {
    id: 'alm-07',
    name: 'Fideos Tallarines / Spaghetti 500 g',
    category: 'almacen',
    unit: 'paquete',
    price: 1350,
    priceMin: 1050,
    priceMax: 1750,
    brandExample: 'Matarazzo, Lucchetti, Terrabusi',
    supermarketPrices: { dia: 1100, coto: 1250, changomas: 1250, carrefour: 1300, vea: 1350, jumbo: 1650 }
  },
  {
    id: 'alm-08',
    name: 'Fideos Mostacholes / Penne Rigate 500 g',
    category: 'almacen',
    unit: 'paquete',
    price: 1350,
    priceMin: 1050,
    priceMax: 1750,
    brandExample: 'Matarazzo, Lucchetti, Knorr',
    supermarketPrices: { dia: 1100, coto: 1250, changomas: 1250, carrefour: 1300, vea: 1350, jumbo: 1650 }
  },
  {
    id: 'alm-09',
    name: 'Harina de Trigo 000 1 kg',
    category: 'almacen',
    unit: 'kg',
    price: 980,
    priceMin: 790,
    priceMax: 1250,
    brandExample: 'Cañuelas, Morixe, Favorita',
    supermarketPrices: { dia: 820, changomas: 890, coto: 920, carrefour: 950, vea: 970, jumbo: 1180 }
  },
  {
    id: 'alm-10',
    name: 'Harina de Trigo 0000 1 kg',
    category: 'almacen',
    unit: 'kg',
    price: 1250,
    priceMin: 990,
    priceMax: 1550,
    brandExample: 'Pureza, Cañuelas, Morixe',
    supermarketPrices: { dia: 1050, changomas: 1120, coto: 1190, carrefour: 1220, vea: 1250, jumbo: 1450 }
  },
  {
    id: 'alm-11',
    name: 'Harina de Trigo Leudante 1 kg',
    category: 'almacen',
    unit: 'kg',
    price: 1380,
    priceMin: 1100,
    priceMax: 1750,
    brandExample: 'Blancaflor, Pureza con Levadura',
    supermarketPrices: { dia: 1190, changomas: 1250, coto: 1320, carrefour: 1350, vea: 1380, jumbo: 1600 }
  },
  {
    id: 'alm-12',
    name: 'Polenta de Cocción Rápida 1 Minuto 500 g',
    category: 'almacen',
    unit: 'paquete',
    price: 1150,
    priceMin: 890,
    priceMax: 1450,
    brandExample: 'Presto Pronta, Morixe, Marolio',
    supermarketPrices: { dia: 950, coto: 1050, changomas: 1050, carrefour: 1100, vea: 1150, jumbo: 1350 }
  },
  {
    id: 'alm-13',
    name: 'Azúcar Común Tipo A 1 kg',
    category: 'almacen',
    unit: 'kg',
    price: 1050,
    priceMin: 850,
    priceMax: 1350,
    brandExample: 'Ledesma, Chango, Arcor',
    supermarketPrices: { dia: 890, changomas: 950, coto: 990, carrefour: 1020, vea: 1050, jumbo: 1250 }
  },
  {
    id: 'alm-14',
    name: 'Sal Fina de Mesa Estuche 500 g',
    category: 'almacen',
    unit: 'paquete',
    price: 850,
    priceMin: 650,
    priceMax: 1150,
    brandExample: 'Celusal, Dos Anclas, Timbo',
    supermarketPrices: { dia: 690, changomas: 750, coto: 790, carrefour: 820, vea: 850, jumbo: 1020 }
  },
  {
    id: 'alm-15',
    name: 'Sal Gruesa / Entrefina para Asado 1 kg',
    category: 'almacen',
    unit: 'kg',
    price: 950,
    priceMin: 750,
    priceMax: 1250,
    brandExample: 'Celusal Parrillera, Dos Anclas',
    supermarketPrices: { dia: 790, changomas: 850, coto: 890, vea: 920, carrefour: 950, jumbo: 1150 }
  },
  {
    id: 'alm-16',
    name: 'Puré de Tomate Tetra Brik 520 g',
    category: 'almacen',
    unit: 'u',
    price: 780,
    priceMin: 590,
    priceMax: 1050,
    brandExample: 'Noel, La Campagnola, Marolio, Arcor',
    supermarketPrices: { dia: 620, changomas: 680, coto: 720, carrefour: 750, vea: 770, jumbo: 950 }
  },
  {
    id: 'alm-17',
    name: 'Tomate Triturado Botella 970 g',
    category: 'almacen',
    unit: 'u',
    price: 1950,
    priceMin: 1550,
    priceMax: 2450,
    brandExample: 'Marolio, La Huerta, Arcor, Mora',
    supermarketPrices: { dia: 1650, changomas: 1750, coto: 1850, carrefour: 1920, vea: 1950, jumbo: 2300 }
  },
  {
    id: 'alm-18',
    name: 'Atún en Lomo al Natural / Aceite Lata 170 g',
    category: 'almacen',
    unit: 'u',
    price: 2600,
    priceMin: 1990,
    priceMax: 3300,
    brandExample: 'La Campagnola, Gomes da Costa, Robinson Crusoe',
    supermarketPrices: { dia: 2150, coto: 2400, changomas: 2450, carrefour: 2550, vea: 2600, jumbo: 3100 }
  },
  {
    id: 'alm-19',
    name: 'Mayonesa Clásica Doypack 475 g',
    category: 'almacen',
    unit: 'u',
    price: 1950,
    priceMin: 1550,
    priceMax: 2500,
    brandExample: 'Hellmann’s, Natura, Ri-k',
    supermarketPrices: { dia: 1690, coto: 1850, changomas: 1850, carrefour: 1920, vea: 1950, jumbo: 2350 }
  },
  {
    id: 'alm-20',
    name: 'Mostaza Tradicional Pote / Doypack 250 g',
    category: 'almacen',
    unit: 'u',
    price: 1250,
    priceMin: 950,
    priceMax: 1650,
    brandExample: 'Savora Clásica, Natura, Danica',
    supermarketPrices: { dia: 1050, coto: 1150, changomas: 1190, carrefour: 1220, vea: 1250, jumbo: 1500 }
  },
  {
    id: 'alm-21',
    name: 'Kétchup Doypack 250 g',
    category: 'almacen',
    unit: 'u',
    price: 1350,
    priceMin: 1050,
    priceMax: 1750,
    brandExample: 'Hellmann’s, Heinz, Natura',
    supermarketPrices: { dia: 1150, coto: 1250, changomas: 1250, carrefour: 1300, vea: 1350, jumbo: 1600 }
  },
  {
    id: 'alm-22',
    name: 'Galletitas de Agua Criollitas Tripack 300 g',
    category: 'almacen',
    unit: 'paquete',
    price: 1650,
    priceMin: 1290,
    priceMax: 2100,
    brandExample: 'Criollitas, Express, Mediatarde',
    supermarketPrices: { dia: 1350, coto: 1520, changomas: 1550, carrefour: 1600, vea: 1650, jumbo: 1950 }
  },
  {
    id: 'alm-23',
    name: 'Galletitas Chocolinas Paquete 250 g',
    category: 'almacen',
    unit: 'paquete',
    price: 1950,
    priceMin: 1590,
    priceMax: 2450,
    brandExample: 'Chocolinas (Bagley)',
    supermarketPrices: { dia: 1690, coto: 1820, changomas: 1850, carrefour: 1900, vea: 1950, jumbo: 2300 }
  },
  {
    id: 'alm-24',
    name: 'Galletitas Rellenas de Chocolate / Oreo 118 g',
    category: 'almacen',
    unit: 'paquete',
    price: 1200,
    priceMin: 950,
    priceMax: 1550,
    brandExample: 'Oreo, Rumba, Melba, Amor',
    supermarketPrices: { dia: 990, coto: 1120, changomas: 1150, carrefour: 1180, vea: 1200, jumbo: 1450 }
  },
  {
    id: 'alm-25',
    name: 'Bizcochitos de Grasa Salados / Dulces 200 g',
    category: 'almacen',
    unit: 'paquete',
    price: 950,
    priceMin: 750,
    priceMax: 1250,
    brandExample: 'Don Satur, 9 de Oro, Jorgito',
    supermarketPrices: { dia: 790, coto: 880, changomas: 890, carrefour: 920, vea: 950, jumbo: 1150 }
  },
  {
    id: 'alm-26',
    name: 'Mermelada Frasco 454 g (Frutilla / Durazno)',
    category: 'almacen',
    unit: 'u',
    price: 2850,
    priceMin: 2250,
    priceMax: 3600,
    brandExample: 'La Campagnola, BC Dulcor, Arcor',
    supermarketPrices: { dia: 2450, coto: 2690, changomas: 2750, carrefour: 2800, vea: 2850, jumbo: 3350 }
  },
  {
    id: 'alm-27',
    name: 'Dulce de Batata / Membrillo Pan 500 g',
    category: 'almacen',
    unit: 'paquete',
    price: 1650,
    priceMin: 1290,
    priceMax: 2150,
    brandExample: 'Los Nietitos, Arcor, Emeth, Dulcor',
    supermarketPrices: { dia: 1390, coto: 1550, changomas: 1550, carrefour: 1620, vea: 1650, jumbo: 1950 }
  },
  {
    id: 'alm-28',
    name: 'Lentejas Secas Seleccionadas 400 g',
    category: 'almacen',
    unit: 'paquete',
    price: 1550,
    priceMin: 1190,
    priceMax: 1980,
    brandExample: 'Lucchetti, Dos Hermanos, Inalpa',
    supermarketPrices: { dia: 1290, coto: 1450, changomas: 1480, carrefour: 1520, vea: 1550, jumbo: 1850 }
  },
  {
    id: 'alm-29',
    name: 'Caldos de Verdura / Gallina / Carne Caja x12 u',
    category: 'almacen',
    unit: 'paquete',
    price: 1450,
    priceMin: 1150,
    priceMax: 1850,
    brandExample: 'Knorr, Maggi',
    supermarketPrices: { dia: 1250, coto: 1350, changomas: 1380, carrefour: 1420, vea: 1450, jumbo: 1720 }
  },
  {
    id: 'alm-30',
    name: 'Vinagre de Alcohol / Manzana Botella 1 L',
    category: 'almacen',
    unit: 'u',
    price: 1250,
    priceMin: 950,
    priceMax: 1650,
    brandExample: 'Menoyo, Dos Anclas, Alcázar',
    supermarketPrices: { dia: 1050, coto: 1150, changomas: 1180, carrefour: 1220, vea: 1250, jumbo: 1500 }
  },

  // ==========================================
  // --- 2. LÁCTEOS Y QUESOS FRESCOS (18 productos) ---
  // ==========================================
  {
    id: 'lac-01',
    name: 'Leche Entera / Descremada Sachet 1 L',
    category: 'lacteos',
    unit: 'u',
    price: 1450,
    priceMin: 1150,
    priceMax: 1750,
    brandExample: 'La Serenísima, Ilolay, Milkaut',
    supermarketPrices: { dia: 1250, changomas: 1350, coto: 1420, carrefour: 1450, vea: 1450, jumbo: 1650 }
  },
  {
    id: 'lac-02',
    name: 'Leche Larga Vida UAT Tetra Brik 1 L',
    category: 'lacteos',
    unit: 'u',
    price: 1680,
    priceMin: 1350,
    priceMax: 2100,
    brandExample: 'La Serenísima Clásica, Tregar, Las Tres Niñas',
    supermarketPrices: { dia: 1450, changomas: 1550, coto: 1620, carrefour: 1650, vea: 1680, jumbo: 1950 }
  },
  {
    id: 'lac-03',
    name: 'Manteca Calidad Extra Pan 200 g',
    category: 'lacteos',
    unit: 'u',
    price: 2950,
    priceMin: 2350,
    priceMax: 3600,
    brandExample: 'La Serenísima, Sancor, Ilolay, Tregar',
    supermarketPrices: { dia: 2550, changomas: 2750, coto: 2850, carrefour: 2900, vea: 2950, jumbo: 3450 }
  },
  {
    id: 'lac-04',
    name: 'Dulce de Leche Clásico / Colonial Pote 400 g',
    category: 'lacteos',
    unit: 'u',
    price: 2450,
    priceMin: 1890,
    priceMax: 3100,
    brandExample: 'La Serenísima Colonial, San Ignacio, Milkaut',
    supermarketPrices: { dia: 2100, changomas: 2250, coto: 2350, carrefour: 2400, vea: 2450, jumbo: 2900 }
  },
  {
    id: 'lac-05',
    name: 'Queso Cremoso / Cremón Fraccionado 1 kg',
    category: 'lacteos',
    unit: 'kg',
    price: 8400,
    priceMin: 6900,
    priceMax: 10200,
    brandExample: 'La Serenísima Cremón, La Paulina, Punta del Agua',
    supermarketPrices: { coto: 7800, dia: 7600, changomas: 7900, vea: 8200, carrefour: 8400, jumbo: 9800 }
  },
  {
    id: 'lac-06',
    name: 'Queso Port Salut Tradicional / Light 1 kg',
    category: 'lacteos',
    unit: 'kg',
    price: 9900,
    priceMin: 8200,
    priceMax: 12200,
    brandExample: 'La Serenísima, La Paulina, Tregar',
    supermarketPrices: { coto: 9200, changomas: 9400, dia: 9100, carrefour: 9800, vea: 9900, jumbo: 11600 }
  },
  {
    id: 'lac-07',
    name: 'Queso Rallado Reggianito Sobre 100 g',
    category: 'lacteos',
    unit: 'paquete',
    price: 2350,
    priceMin: 1850,
    priceMax: 2950,
    brandExample: 'La Serenísima, Sancor, La Paulina',
    supermarketPrices: { dia: 1990, coto: 2200, changomas: 2250, carrefour: 2300, vea: 2350, jumbo: 2750 }
  },
  {
    id: 'lac-08',
    name: 'Queso Muzzarella en Barra para Pizza 1 kg',
    category: 'lacteos',
    unit: 'kg',
    price: 8600,
    priceMin: 6900,
    priceMax: 10500,
    brandExample: 'Barraza, Vidalac, Noal, La Paulina',
    supermarketPrices: { coto: 7950, dia: 7800, changomas: 8100, vea: 8400, carrefour: 8600, jumbo: 9900 }
  },
  {
    id: 'lac-09',
    name: 'Queso Tybo / Dambo en Fetas Pote 200 g',
    category: 'lacteos',
    unit: 'paquete',
    price: 2750,
    priceMin: 2190,
    priceMax: 3450,
    brandExample: 'La Paulina, Tregar, Milkaut',
    supermarketPrices: { dia: 2390, coto: 2600, changomas: 2650, carrefour: 2700, vea: 2750, jumbo: 3200 }
  },
  {
    id: 'lac-10',
    name: 'Queso Crema Casancrem / Finlandia Pote 290 g',
    category: 'lacteos',
    unit: 'u',
    price: 2950,
    priceMin: 2350,
    priceMax: 3650,
    brandExample: 'Casancrem Clásico/Light, Finlandia, Milkaut',
    supermarketPrices: { dia: 2550, coto: 2790, changomas: 2850, carrefour: 2900, vea: 2950, jumbo: 3450 }
  },
  {
    id: 'lac-11',
    name: 'Yogur Bebible Sachet 1 L (Frutilla / Vainilla)',
    category: 'lacteos',
    unit: 'u',
    price: 1950,
    priceMin: 1550,
    priceMax: 2450,
    brandExample: 'Yogurísimo, Ilolay, Milkaut, Tregar',
    supermarketPrices: { dia: 1690, changomas: 1800, coto: 1890, carrefour: 1920, vea: 1950, jumbo: 2300 }
  },
  {
    id: 'lac-12',
    name: 'Yogur Firme / Batido Pack x2 Potes (120 g c/u)',
    category: 'lacteos',
    unit: 'paquete',
    price: 1450,
    priceMin: 1150,
    priceMax: 1850,
    brandExample: 'Yogurísimo, Ilolay, Ser',
    supermarketPrices: { dia: 1250, coto: 1380, changomas: 1390, carrefour: 1420, vea: 1450, jumbo: 1750 }
  },
  {
    id: 'lac-13',
    name: 'Crema de Leche Pote 200 ml',
    category: 'lacteos',
    unit: 'u',
    price: 2150,
    priceMin: 1690,
    priceMax: 2700,
    brandExample: 'La Serenísima, Tregar, Milkaut',
    supermarketPrices: { dia: 1850, coto: 2020, changomas: 2050, carrefour: 2100, vea: 2150, jumbo: 2550 }
  },
  {
    id: 'lac-14',
    name: 'Postre Infantil Chocolate / Dulce de Leche Pack x2',
    category: 'lacteos',
    unit: 'paquete',
    price: 1650,
    priceMin: 1290,
    priceMax: 2100,
    brandExample: 'Serenito, Danette, Shimy',
    supermarketPrices: { dia: 1400, coto: 1550, changomas: 1580, carrefour: 1620, vea: 1650, jumbo: 1950 }
  },
  {
    id: 'lac-15',
    name: 'Ricotta Magra Pote / Pan 500 g',
    category: 'lacteos',
    unit: 'u',
    price: 2750,
    priceMin: 2190,
    priceMax: 3400,
    brandExample: 'Tregar, Barraza, La Serenísima',
    supermarketPrices: { dia: 2390, coto: 2590, changomas: 2650, carrefour: 2700, vea: 2750, jumbo: 3250 }
  },
  {
    id: 'lac-16',
    name: 'Huevos Blancos Seleccionados Docena (12 u)',
    category: 'lacteos',
    unit: 'u',
    price: 3200,
    priceMin: 2600,
    priceMax: 3950,
    brandExample: 'Huevos de Granja Buenos Aires, Coto',
    supermarketPrices: { coto: 2900, dia: 2850, changomas: 2990, carrefour: 3150, vea: 3200, jumbo: 3750 }
  },
  {
    id: 'lac-17',
    name: 'Huevos Blancos Maple x30 Unidades',
    category: 'lacteos',
    unit: 'paquete',
    price: 7200,
    priceMin: 5900,
    priceMax: 8800,
    brandExample: 'Maple Avícola Bonaerense',
    supermarketPrices: { dia: 6400, coto: 6700, changomas: 6800, vea: 7100, carrefour: 7200, jumbo: 8400 }
  },
  {
    id: 'lac-18',
    name: 'Levadura Fresca en Cubito Pack 50 g x2',
    category: 'lacteos',
    unit: 'paquete',
    price: 750,
    priceMin: 550,
    priceMax: 990,
    brandExample: 'Calsa',
    supermarketPrices: { dia: 620, coto: 690, changomas: 710, carrefour: 740, vea: 750, jumbo: 890 }
  },

  // ==========================================
  // --- 3. CARNICERÍA, GRANJA Y PESCADERÍA (18 productos) ---
  // ==========================================
  {
    id: 'car-01',
    name: 'Asado de Tira Novillito 1 kg',
    category: 'carniceria',
    unit: 'kg',
    price: 9400,
    priceMin: 7800,
    priceMax: 11900,
    brandExample: 'Carne vacuna seleccionada bonaerense',
    supermarketPrices: { coto: 8400, changomas: 8900, vea: 9100, carrefour: 9400, dia: 9800, jumbo: 11200 }
  },
  {
    id: 'car-02',
    name: 'Vacío de Novillito 1 kg',
    category: 'carniceria',
    unit: 'kg',
    price: 10600,
    priceMin: 8900,
    priceMax: 13500,
    brandExample: 'Corte parrillero tierno',
    supermarketPrices: { coto: 9600, changomas: 10100, vea: 10300, carrefour: 10600, dia: 10900, jumbo: 12800 }
  },
  {
    id: 'car-03',
    name: 'Bife de Chorizo de Novillo 1 kg',
    category: 'carniceria',
    unit: 'kg',
    price: 11800,
    priceMin: 9800,
    priceMax: 14800,
    brandExample: 'Corte magro especial',
    supermarketPrices: { coto: 10800, changomas: 11200, carrefour: 11700, vea: 11800, dia: 12200, jumbo: 13900 }
  },
  {
    id: 'car-04',
    name: 'Nalga Feteada para Milanesas 1 kg',
    category: 'carniceria',
    unit: 'kg',
    price: 10400,
    priceMin: 8700,
    priceMax: 12900,
    brandExample: 'Nalga tierna sin grasa',
    supermarketPrices: { coto: 9400, changomas: 9900, vea: 10100, carrefour: 10400, dia: 10700, jumbo: 12200 }
  },
  {
    id: 'car-05',
    name: 'Bola de Lomo para Milanesas 1 kg',
    category: 'carniceria',
    unit: 'kg',
    price: 9800,
    priceMin: 8200,
    priceMax: 12200,
    brandExample: 'Corte tradicional de milanesa',
    supermarketPrices: { coto: 8900, changomas: 9300, vea: 9500, carrefour: 9800, dia: 10100, jumbo: 11500 }
  },
  {
    id: 'car-06',
    name: 'Peceto Entero / Feteado 1 kg',
    category: 'carniceria',
    unit: 'kg',
    price: 12400,
    priceMin: 10500,
    priceMax: 15500,
    brandExample: 'Para vitel toné o milanesas finas',
    supermarketPrices: { coto: 11200, changomas: 11800, carrefour: 12300, vea: 12400, dia: 12800, jumbo: 14500 }
  },
  {
    id: 'car-07',
    name: 'Carne Picada Especial Magra 1 kg',
    category: 'carniceria',
    unit: 'kg',
    price: 7600,
    priceMin: 6200,
    priceMax: 9500,
    brandExample: 'Picada de novillo de primera',
    supermarketPrices: { coto: 6800, changomas: 7200, vea: 7400, carrefour: 7600, dia: 7900, jumbo: 8900 }
  },
  {
    id: 'car-08',
    name: 'Carne Picada Intermedia / Común 1 kg',
    category: 'carniceria',
    unit: 'kg',
    price: 5800,
    priceMin: 4700,
    priceMax: 7200,
    brandExample: 'Para empanadas o salsas',
    supermarketPrices: { coto: 5200, changomas: 5500, dia: 5600, vea: 5700, carrefour: 5800, jumbo: 6800 }
  },
  {
    id: 'car-09',
    name: 'Pollo Entero Fresco Eviscerado 1 kg',
    category: 'carniceria',
    unit: 'kg',
    price: 3100,
    priceMin: 2450,
    priceMax: 3900,
    brandExample: 'Granja Tres Arroyos, Soychú, Cresta Roja',
    supermarketPrices: { coto: 2650, changomas: 2850, dia: 2950, vea: 3000, carrefour: 3100, jumbo: 3600 }
  },
  {
    id: 'car-10',
    name: 'Pechuga de Pollo Fileteada sin Piel 1 kg',
    category: 'carniceria',
    unit: 'kg',
    price: 7900,
    priceMin: 6500,
    priceMax: 9800,
    brandExample: 'Supremas frescas de granja',
    supermarketPrices: { coto: 7100, changomas: 7500, vea: 7700, carrefour: 7900, dia: 8100, jumbo: 9200 }
  },
  {
    id: 'car-11',
    name: 'Pata y Muslo de Pollo 1 kg',
    category: 'carniceria',
    unit: 'kg',
    price: 3600,
    priceMin: 2900,
    priceMax: 4500,
    brandExample: 'Pollo seleccionado fresco',
    supermarketPrices: { coto: 3150, changomas: 3350, dia: 3450, vea: 3500, carrefour: 3600, jumbo: 4200 }
  },
  {
    id: 'car-12',
    name: 'Milanesas de Carne Rebozadas Preparadas 1 kg',
    category: 'carniceria',
    unit: 'kg',
    price: 9200,
    priceMin: 7600,
    priceMax: 11400,
    brandExample: 'Elaboradas en rotisería / carnicería del súper',
    supermarketPrices: { coto: 8200, changomas: 8700, vea: 8900, carrefour: 9200, dia: 9500, jumbo: 10800 }
  },
  {
    id: 'car-13',
    name: 'Milanesas de Pollo Rebozadas 1 kg',
    category: 'carniceria',
    unit: 'kg',
    price: 7400,
    priceMin: 6100,
    priceMax: 9200,
    brandExample: 'Supremas empanadas listas para cocinar',
    supermarketPrices: { coto: 6600, changomas: 7000, vea: 7200, carrefour: 7400, dia: 7700, jumbo: 8600 }
  },
  {
    id: 'car-14',
    name: 'Costillitas / Pechito de Cerdo 1 kg',
    category: 'carniceria',
    unit: 'kg',
    price: 6800,
    priceMin: 5500,
    priceMax: 8400,
    brandExample: 'Cerdo fresco argentino',
    supermarketPrices: { coto: 6100, changomas: 6450, vea: 6600, carrefour: 6800, dia: 7100, jumbo: 7900 }
  },
  {
    id: 'car-15',
    name: 'Bondiola de Cerdo Fresca 1 kg',
    category: 'carniceria',
    unit: 'kg',
    price: 8800,
    priceMin: 7200,
    priceMax: 10900,
    brandExample: 'Pieza entera o feteada para horno o disco',
    supermarketPrices: { coto: 7900, changomas: 8350, vea: 8500, carrefour: 8800, dia: 9100, jumbo: 10200 }
  },
  {
    id: 'car-16',
    name: 'Chorizo Puro Cerdo / Parrillero Bombón 1 kg',
    category: 'carniceria',
    unit: 'kg',
    price: 6400,
    priceMin: 5100,
    priceMax: 7900,
    brandExample: 'Coto Parrillero, Campo Austral, Paladini',
    supermarketPrices: { coto: 5600, changomas: 6050, vea: 6200, carrefour: 6400, dia: 6600, jumbo: 7500 }
  },
  {
    id: 'car-17',
    name: 'Morcilla Criolla Bombón 1 kg',
    category: 'carniceria',
    unit: 'kg',
    price: 4800,
    priceMin: 3800,
    priceMax: 5900,
    brandExample: 'Paladini, Coto, Cabaña Las Lilas',
    supermarketPrices: { coto: 4200, changomas: 4500, vea: 4650, carrefour: 4800, dia: 5000, jumbo: 5600 }
  },
  {
    id: 'car-18',
    name: 'Filet de Merluza Fresco Despinado 1 kg',
    category: 'carniceria',
    unit: 'kg',
    price: 8900,
    priceMin: 7200,
    priceMax: 11200,
    brandExample: 'Pescado del Mar Argentino (Mar del Plata)',
    supermarketPrices: { coto: 7900, vea: 8400, changomas: 8500, carrefour: 8800, dia: 9200, jumbo: 10500 }
  },

  // ==========================================
  // --- 4. FRUTAS Y VERDURAS (16 productos) ---
  // ==========================================
  {
    id: 'ver-01',
    name: 'Papa Negra / Común 1 kg',
    category: 'verduleria',
    unit: 'kg',
    price: 1100,
    priceMin: 850,
    priceMax: 1450,
    brandExample: 'Balcarce / Tandil seleccionada',
    supermarketPrices: { dia: 920, changomas: 980, coto: 1020, vea: 1050, carrefour: 1100, jumbo: 1350 }
  },
  {
    id: 'ver-02',
    name: 'Papa Blanca / Lavada Cepillada 1 kg',
    category: 'verduleria',
    unit: 'kg',
    price: 1550,
    priceMin: 1200,
    priceMax: 1950,
    brandExample: 'Seleccionada de exportación',
    supermarketPrices: { dia: 1350, changomas: 1420, coto: 1450, vea: 1480, carrefour: 1550, jumbo: 1850 }
  },
  {
    id: 'ver-03',
    name: 'Cebolla Comercial 1 kg',
    category: 'verduleria',
    unit: 'kg',
    price: 950,
    priceMin: 750,
    priceMax: 1300,
    brandExample: 'Cebolla amarilla de estación',
    supermarketPrices: { dia: 790, changomas: 850, coto: 890, vea: 910, carrefour: 950, jumbo: 1200 }
  },
  {
    id: 'ver-04',
    name: 'Tomate Redondo Comercial 1 kg',
    category: 'verduleria',
    unit: 'kg',
    price: 2400,
    priceMin: 1850,
    priceMax: 3200,
    brandExample: 'Tomate para ensalada fresco',
    supermarketPrices: { dia: 2050, changomas: 2150, coto: 2250, vea: 2300, carrefour: 2400, jumbo: 2950 }
  },
  {
    id: 'ver-05',
    name: 'Tomate Perita Maduro 1 kg',
    category: 'verduleria',
    unit: 'kg',
    price: 2200,
    priceMin: 1700,
    priceMax: 2900,
    brandExample: 'Ideal salsas y ensaladas',
    supermarketPrices: { dia: 1890, changomas: 1990, coto: 2050, vea: 2100, carrefour: 2200, jumbo: 2750 }
  },
  {
    id: 'ver-06',
    name: 'Lechuga Criolla / Mantecosa 1 kg',
    category: 'verduleria',
    unit: 'kg',
    price: 2600,
    priceMin: 1950,
    priceMax: 3500,
    brandExample: 'Cinturón hortícola de La Plata',
    supermarketPrices: { dia: 2250, changomas: 2350, coto: 2450, vea: 2500, carrefour: 2600, jumbo: 3250 }
  },
  {
    id: 'ver-07',
    name: 'Zanahoria Común 1 kg',
    category: 'verduleria',
    unit: 'kg',
    price: 1350,
    priceMin: 1050,
    priceMax: 1750,
    brandExample: 'Zanahoria fresca seleccionada',
    supermarketPrices: { dia: 1150, changomas: 1220, coto: 1250, vea: 1280, carrefour: 1350, jumbo: 1650 }
  },
  {
    id: 'ver-08',
    name: 'Morrón Rojo 1 kg',
    category: 'verduleria',
    unit: 'kg',
    price: 3900,
    priceMin: 2950,
    priceMax: 5200,
    brandExample: 'Morrón carnoso de estación',
    supermarketPrices: { dia: 3350, changomas: 3550, coto: 3650, vea: 3750, carrefour: 3900, jumbo: 4800 }
  },
  {
    id: 'ver-09',
    name: 'Zapallito Redondo Verde 1 kg',
    category: 'verduleria',
    unit: 'kg',
    price: 1950,
    priceMin: 1450,
    priceMax: 2600,
    brandExample: 'Zapallito de huerta bonaerense',
    supermarketPrices: { dia: 1690, changomas: 1750, coto: 1820, vea: 1880, carrefour: 1950, jumbo: 2400 }
  },
  {
    id: 'ver-10',
    name: 'Calabaza / Zapallo Anco 1 kg',
    category: 'verduleria',
    unit: 'kg',
    price: 1250,
    priceMin: 950,
    priceMax: 1650,
    brandExample: 'Calabaza dulce especial para puré o sopa',
    supermarketPrices: { dia: 1050, changomas: 1120, coto: 1150, vea: 1190, carrefour: 1250, jumbo: 1550 }
  },
  {
    id: 'ver-11',
    name: 'Palta Hass Calidad Superior x Unidad',
    category: 'verduleria',
    unit: 'u',
    price: 1850,
    priceMin: 1390,
    priceMax: 2500,
    brandExample: 'Palta cremosa para tostadas o ensaladas',
    supermarketPrices: { dia: 1590, changomas: 1650, coto: 1720, vea: 1750, carrefour: 1850, jumbo: 2300 }
  },
  {
    id: 'ver-12',
    name: 'Banana Ecuador 1 kg',
    category: 'verduleria',
    unit: 'kg',
    price: 2550,
    priceMin: 2050,
    priceMax: 3300,
    brandExample: 'Dole, Chiquita, Del Monte',
    supermarketPrices: { dia: 2200, changomas: 2320, coto: 2420, vea: 2450, carrefour: 2550, jumbo: 3100 }
  },
  {
    id: 'ver-13',
    name: 'Manzana Red Delicious 1 kg',
    category: 'verduleria',
    unit: 'kg',
    price: 2450,
    priceMin: 1890,
    priceMax: 3200,
    brandExample: 'Valle de Río Negro / Neuquén',
    supermarketPrices: { dia: 2100, changomas: 2220, coto: 2320, vea: 2350, carrefour: 2450, jumbo: 2980 }
  },
  {
    id: 'ver-14',
    name: 'Naranja para Jugo 1 kg',
    category: 'verduleria',
    unit: 'kg',
    price: 1550,
    priceMin: 1190,
    priceMax: 2100,
    brandExample: 'San Pedro / Entre Ríos dulce',
    supermarketPrices: { dia: 1320, changomas: 1390, coto: 1450, vea: 1480, carrefour: 1550, jumbo: 1950 }
  },
  {
    id: 'ver-15',
    name: 'Mandarina Criolla / Murcott 1 kg',
    category: 'verduleria',
    unit: 'kg',
    price: 1650,
    priceMin: 1290,
    priceMax: 2200,
    brandExample: 'Mandarina dulce sin semillas',
    supermarketPrices: { dia: 1390, changomas: 1490, coto: 1550, vea: 1580, carrefour: 1650, jumbo: 2050 }
  },
  {
    id: 'ver-16',
    name: 'Limón Amarillo Comercial 1 kg',
    category: 'verduleria',
    unit: 'kg',
    price: 1450,
    priceMin: 1100,
    priceMax: 1950,
    brandExample: 'Limón de Tucumán seleccionado',
    supermarketPrices: { dia: 1220, changomas: 1310, coto: 1350, vea: 1380, carrefour: 1450, jumbo: 1800 }
  },

  // ==========================================
  // --- 5. PANADERÍA, FACTURAS Y PASTAS (14 productos) ---
  // ==========================================
  {
    id: 'pan-01',
    name: 'Pan Francés / Flauta Fresco del Día 1 kg',
    category: 'panaderia',
    unit: 'kg',
    price: 2750,
    priceMin: 2200,
    priceMax: 3500,
    brandExample: 'Elaboración en panadería propia de la sucursal',
    supermarketPrices: { coto: 2450, dia: 2500, changomas: 2550, vea: 2650, carrefour: 2750, jumbo: 3300 }
  },
  {
    id: 'pan-02',
    name: 'Pan Mignon / Felipe Fresco 1 kg',
    category: 'panaderia',
    unit: 'kg',
    price: 2850,
    priceMin: 2300,
    priceMax: 3600,
    brandExample: 'Panadería artesanal del súper',
    supermarketPrices: { coto: 2550, dia: 2600, changomas: 2650, vea: 2750, carrefour: 2850, jumbo: 3400 }
  },
  {
    id: 'pan-03',
    name: 'Pan de Molde Lactal Blanco Paquete 550 g',
    category: 'panaderia',
    unit: 'paquete',
    price: 2950,
    priceMin: 2350,
    priceMax: 3750,
    brandExample: 'Fargo Clásico, Bimbo Blanco, Artesano',
    supermarketPrices: { dia: 2550, changomas: 2750, coto: 2820, carrefour: 2900, vea: 2950, jumbo: 3500 }
  },
  {
    id: 'pan-04',
    name: 'Pan de Salvado / Integral con Semillas 550 g',
    category: 'panaderia',
    unit: 'paquete',
    price: 3350,
    priceMin: 2690,
    priceMax: 4200,
    brandExample: 'Fargo Salvado Doble, Bimbo Artesano Integral',
    supermarketPrices: { dia: 2890, changomas: 3100, coto: 3200, carrefour: 3300, vea: 3350, jumbo: 3950 }
  },
  {
    id: 'pan-05',
    name: 'Pan para Hamburguesas Pack x4 u',
    category: 'panaderia',
    unit: 'paquete',
    price: 1850,
    priceMin: 1450,
    priceMax: 2400,
    brandExample: 'Fargo Sésamo, Bimbo Brioche, La Salteña',
    supermarketPrices: { dia: 1590, changomas: 1700, coto: 1750, carrefour: 1800, vea: 1850, jumbo: 2200 }
  },
  {
    id: 'pan-06',
    name: 'Pan para Panchos / Viena Pack x6 u',
    category: 'panaderia',
    unit: 'paquete',
    price: 1750,
    priceMin: 1390,
    priceMax: 2300,
    brandExample: 'Fargo, Bimbo, King',
    supermarketPrices: { dia: 1490, changomas: 1600, coto: 1650, carrefour: 1700, vea: 1750, jumbo: 2100 }
  },
  {
    id: 'pan-07',
    name: 'Facturas Surtidas de Manteca / Grasa Docena (12 u)',
    category: 'panaderia',
    unit: 'u',
    price: 6800,
    priceMin: 5400,
    priceMax: 8600,
    brandExample: 'Medialunas, vigilantes, cañoncitos con ddl',
    supermarketPrices: { coto: 5900, dia: 6200, changomas: 6300, vea: 6500, carrefour: 6800, jumbo: 8200 }
  },
  {
    id: 'pan-08',
    name: 'Medialunas de Manteca Pack x6 u',
    category: 'panaderia',
    unit: 'paquete',
    price: 3600,
    priceMin: 2900,
    priceMax: 4600,
    brandExample: 'Horneadas frescas del día',
    supermarketPrices: { coto: 3150, changomas: 3350, dia: 3400, vea: 3500, carrefour: 3600, jumbo: 4300 }
  },
  {
    id: 'pan-09',
    name: 'Chipá de Queso Tradicional Bolsa 250 g',
    category: 'panaderia',
    unit: 'paquete',
    price: 3200,
    priceMin: 2500,
    priceMax: 4100,
    brandExample: 'Elaboración artesanal o Mamá Chipá',
    supermarketPrices: { coto: 2850, changomas: 2980, dia: 3000, vea: 3100, carrefour: 3200, jumbo: 3850 }
  },
  {
    id: 'pan-10',
    name: 'Tapas de Empanadas Hojaldre / Criollas Pack x12 u',
    category: 'panaderia',
    unit: 'paquete',
    price: 1550,
    priceMin: 1190,
    priceMax: 1980,
    brandExample: 'La Salteña, Mendía, Villa D’Agri',
    supermarketPrices: { dia: 1290, changomas: 1390, coto: 1450, carrefour: 1500, vea: 1550, jumbo: 1850 }
  },
  {
    id: 'pan-11',
    name: 'Tapas para Pascualina Hojaldre Pack x2 u',
    category: 'panaderia',
    unit: 'paquete',
    price: 1850,
    priceMin: 1450,
    priceMax: 2400,
    brandExample: 'La Salteña Hojaldrada, Mendía',
    supermarketPrices: { dia: 1550, changomas: 1680, coto: 1720, carrefour: 1800, vea: 1850, jumbo: 2200 }
  },
  {
    id: 'pan-12',
    name: 'Ravioles Frescos de Ricotta y Espinaca Caja 450 g',
    category: 'panaderia',
    unit: 'paquete',
    price: 2750,
    priceMin: 2150,
    priceMax: 3500,
    brandExample: 'La Salteña 4 Porciones, Mendía',
    supermarketPrices: { dia: 2350, coto: 2550, changomas: 2590, carrefour: 2700, vea: 2750, jumbo: 3250 }
  },
  {
    id: 'pan-13',
    name: 'Ñoquis de Papa Frescos Bandeja 500 g',
    category: 'panaderia',
    unit: 'paquete',
    price: 2450,
    priceMin: 1950,
    priceMax: 3150,
    brandExample: 'La Salteña, Don Yeyo, Mendía',
    supermarketPrices: { dia: 2050, coto: 2250, changomas: 2300, carrefour: 2400, vea: 2450, jumbo: 2900 }
  },
  {
    id: 'pan-14',
    name: 'Fideos Cintas Frescas al Huevo 500 g',
    category: 'panaderia',
    unit: 'paquete',
    price: 2350,
    priceMin: 1850,
    priceMax: 2980,
    brandExample: 'La Salteña, Mendía',
    supermarketPrices: { dia: 1990, coto: 2190, changomas: 2220, carrefour: 2300, vea: 2350, jumbo: 2800 }
  },

  // ==========================================
  // --- 6. BEBIDAS E INFUSIONES (20 productos) ---
  // ==========================================
  {
    id: 'beb-01',
    name: 'Yerba Mate Tradicional con Palo 1 kg',
    category: 'bebidas',
    unit: 'kg',
    price: 4500,
    priceMin: 3600,
    priceMax: 5600,
    brandExample: 'Playadito, Taragüí, Mañanita, Rosamonte, Amanda',
    supermarketPrices: { dia: 3990, changomas: 4200, coto: 4350, carrefour: 4450, vea: 4500, jumbo: 5200 }
  },
  {
    id: 'beb-02',
    name: 'Yerba Mate Tradicional con Palo 500 g',
    category: 'bebidas',
    unit: 'paquete',
    price: 2450,
    priceMin: 1950,
    priceMax: 3100,
    brandExample: 'Playadito Suave, Taragüí, Mañanita',
    supermarketPrices: { dia: 2150, changomas: 2290, coto: 2350, carrefour: 2400, vea: 2450, jumbo: 2850 }
  },
  {
    id: 'beb-03',
    name: 'Yerba Mate Compuesta con Hierbas Serranas 500 g',
    category: 'bebidas',
    unit: 'paquete',
    price: 2650,
    priceMin: 2100,
    priceMax: 3350,
    brandExample: 'CBSé Hierbas Serranas, Verdeflor, Cachamate',
    supermarketPrices: { dia: 2290, changomas: 2450, coto: 2550, carrefour: 2600, vea: 2650, jumbo: 3100 }
  },
  {
    id: 'beb-04',
    name: 'Café Tostado y Molido Torrado / Filtro 250 g',
    category: 'bebidas',
    unit: 'paquete',
    price: 3850,
    priceMin: 2990,
    priceMax: 4900,
    brandExample: 'La Virginia Clásico, Cabrales Violeta, Bonafide',
    supermarketPrices: { dia: 3350, coto: 3650, changomas: 3690, carrefour: 3800, vea: 3850, jumbo: 4500 }
  },
  {
    id: 'beb-05',
    name: 'Café Instantáneo Frasco Vidrio 170 g',
    category: 'bebidas',
    unit: 'u',
    price: 5200,
    priceMin: 4200,
    priceMax: 6500,
    brandExample: 'Nescafé Dolca Suave, La Virginia Clásico',
    supermarketPrices: { dia: 4550, coto: 4950, changomas: 5050, carrefour: 5150, vea: 5200, jumbo: 6100 }
  },
  {
    id: 'beb-06',
    name: 'Té Negro en Saquitos Caja x50 u',
    category: 'bebidas',
    unit: 'paquete',
    price: 1850,
    priceMin: 1450,
    priceMax: 2400,
    brandExample: 'Taragüí Clásico, Green Hills, La Virginia',
    supermarketPrices: { dia: 1550, changomas: 1680, coto: 1750, carrefour: 1800, vea: 1850, jumbo: 2200 }
  },
  {
    id: 'beb-07',
    name: 'Mate Cocido en Saquitos Caja x50 u',
    category: 'bebidas',
    unit: 'paquete',
    price: 1950,
    priceMin: 1550,
    priceMax: 2550,
    brandExample: 'Taragüí, Unión, Cruz de Malta',
    supermarketPrices: { dia: 1650, changomas: 1790, coto: 1850, carrefour: 1900, vea: 1950, jumbo: 2350 }
  },
  {
    id: 'beb-08',
    name: 'Cacao en Polvo Chocolatada Doypack 360 g',
    category: 'bebidas',
    unit: 'u',
    price: 2450,
    priceMin: 1950,
    priceMax: 3200,
    brandExample: 'Nesquik, Chocolino, Arcoa',
    supermarketPrices: { dia: 2100, coto: 2320, changomas: 2350, carrefour: 2400, vea: 2450, jumbo: 2900 }
  },
  {
    id: 'beb-09',
    name: 'Agua Mineral Natural sin Gas 2 L',
    category: 'bebidas',
    unit: 'u',
    price: 1350,
    priceMin: 1050,
    priceMax: 1750,
    brandExample: 'Villavicencio, Eco de los Andes, Glaciar, Sierra de los Padres',
    supermarketPrices: { dia: 1100, changomas: 1220, coto: 1280, carrefour: 1300, vea: 1350, jumbo: 1650 }
  },
  {
    id: 'beb-10',
    name: 'Agua Mineral con Gas 1.5 L',
    category: 'bebidas',
    unit: 'u',
    price: 1250,
    priceMin: 950,
    priceMax: 1650,
    brandExample: 'Villavicencio con Gas, Eco de los Andes con Gas',
    supermarketPrices: { dia: 1020, changomas: 1150, coto: 1190, carrefour: 1220, vea: 1250, jumbo: 1550 }
  },
  {
    id: 'beb-11',
    name: 'Soda en Sifón Descartable con Válvula 1.5 L',
    category: 'bebidas',
    unit: 'u',
    price: 1450,
    priceMin: 1100,
    priceMax: 1900,
    brandExample: 'Cimes, Ivess, Villa del Sur',
    supermarketPrices: { dia: 1200, coto: 1350, changomas: 1350, carrefour: 1400, vea: 1450, jumbo: 1750 }
  },
  {
    id: 'beb-12',
    name: 'Gaseosa Cola Sabor Original Botella 2.25 L',
    category: 'bebidas',
    unit: 'u',
    price: 3450,
    priceMin: 2800,
    priceMax: 4200,
    brandExample: 'Coca-Cola Sabor Original',
    supermarketPrices: { dia: 2990, coto: 3250, changomas: 3290, carrefour: 3350, vea: 3450, jumbo: 3950 }
  },
  {
    id: 'beb-13',
    name: 'Gaseosa Cola Sin Azúcar Botella 2.25 L',
    category: 'bebidas',
    unit: 'u',
    price: 3450,
    priceMin: 2800,
    priceMax: 4200,
    brandExample: 'Coca-Cola Sin Azúcar / Zero',
    supermarketPrices: { dia: 2990, coto: 3250, changomas: 3290, carrefour: 3350, vea: 3450, jumbo: 3950 }
  },
  {
    id: 'beb-14',
    name: 'Gaseosa Lima-Limón Botella 2.25 L',
    category: 'bebidas',
    unit: 'u',
    price: 3250,
    priceMin: 2600,
    priceMax: 3950,
    brandExample: 'Sprite, 7Up, Paso de los Toros',
    supermarketPrices: { dia: 2800, coto: 3050, changomas: 3100, carrefour: 3150, vea: 3250, jumbo: 3750 }
  },
  {
    id: 'beb-15',
    name: 'Jugo en Polvo Sobrecito rinde 1 L',
    category: 'bebidas',
    unit: 'u',
    price: 320,
    priceMin: 250,
    priceMax: 450,
    brandExample: 'Tang, Clight, Arcor, Rinde Dos',
    supermarketPrices: { dia: 270, changomas: 290, coto: 300, carrefour: 310, vea: 320, jumbo: 390 }
  },
  {
    id: 'beb-16',
    name: 'Cerveza Rubia Clásica en Lata 473 ml',
    category: 'bebidas',
    unit: 'u',
    price: 1850,
    priceMin: 1450,
    priceMax: 2400,
    brandExample: 'Quilmes Clásica, Brahma, Schneider',
    supermarketPrices: { dia: 1550, changomas: 1680, coto: 1720, carrefour: 1800, vea: 1850, jumbo: 2150 }
  },
  {
    id: 'beb-17',
    name: 'Cerveza Premium Rubia Lata 473 ml',
    category: 'bebidas',
    unit: 'u',
    price: 2450,
    priceMin: 1950,
    priceMax: 3100,
    brandExample: 'Heineken, Stella Artois, Corona, Andes Origen',
    supermarketPrices: { dia: 2100, coto: 2320, changomas: 2350, carrefour: 2400, vea: 2450, jumbo: 2850 }
  },
  {
    id: 'beb-18',
    name: 'Vino Tinto Malbec Joven Botella 750 ml',
    category: 'bebidas',
    unit: 'u',
    price: 4600,
    priceMin: 3600,
    priceMax: 5900,
    brandExample: 'Norton Clásico, San Telmo, Las Moras, Estiba I',
    supermarketPrices: { coto: 4150, dia: 3990, changomas: 4250, vea: 4450, carrefour: 4600, jumbo: 5400 }
  },
  {
    id: 'beb-19',
    name: 'Aperitivo Fernet Tradicional Botella 750 ml',
    category: 'bebidas',
    unit: 'u',
    price: 12800,
    priceMin: 10500,
    priceMax: 15900,
    brandExample: 'Fernet Branca',
    supermarketPrices: { coto: 11600, changomas: 12100, dia: 11900, carrefour: 12500, vea: 12800, jumbo: 14900 }
  },
  {
    id: 'beb-20',
    name: 'Amargo Terma Serrano / Citrus Botella 1.35 L',
    category: 'bebidas',
    unit: 'u',
    price: 2350,
    priceMin: 1850,
    priceMax: 2950,
    brandExample: 'Terma Serrano, Terma Limonada',
    supermarketPrices: { dia: 2050, coto: 2200, changomas: 2250, carrefour: 2300, vea: 2350, jumbo: 2750 }
  },

  // ==========================================
  // --- 7. LIMPIEZA DEL HOGAR (14 productos) ---
  // ==========================================
  {
    id: 'lim-01',
    name: 'Jabón Líquido para Ropa Botella 3 L',
    category: 'limpieza',
    unit: 'u',
    price: 7900,
    priceMin: 6200,
    priceMax: 10200,
    brandExample: 'Skip, Ala Camellito, Ariel, Drive',
    supermarketPrices: { dia: 6950, coto: 7450, changomas: 7500, carrefour: 7800, vea: 7900, jumbo: 9400 }
  },
  {
    id: 'lim-02',
    name: 'Jabón Líquido para Ropa Doypack Económico 800 ml',
    category: 'limpieza',
    unit: 'u',
    price: 2550,
    priceMin: 1990,
    priceMax: 3300,
    brandExample: 'Ala Matic, Zorro, Ace',
    supermarketPrices: { dia: 2190, coto: 2390, changomas: 2420, carrefour: 2500, vea: 2550, jumbo: 3050 }
  },
  {
    id: 'lim-03',
    name: 'Suavizante para Ropa Concentrado Doypack 900 ml',
    category: 'limpieza',
    unit: 'u',
    price: 2750,
    priceMin: 2150,
    priceMax: 3500,
    brandExample: 'Vivere, Comfort, Suave',
    supermarketPrices: { dia: 2350, coto: 2550, changomas: 2600, carrefour: 2700, vea: 2750, jumbo: 3250 }
  },
  {
    id: 'lim-04',
    name: 'Lavandina Clásica Desinfectante Botella 1 L',
    category: 'limpieza',
    unit: 'u',
    price: 1350,
    priceMin: 1050,
    priceMax: 1750,
    brandExample: 'Ayudín Clásica, Clorox, Querubín',
    supermarketPrices: { dia: 1100, changomas: 1220, coto: 1250, carrefour: 1300, vea: 1350, jumbo: 1650 }
  },
  {
    id: 'lim-05',
    name: 'Lavandina Concentrada / en Gel Botella 2 L',
    category: 'limpieza',
    unit: 'u',
    price: 2350,
    priceMin: 1850,
    priceMax: 2990,
    brandExample: 'Ayudín Máxima Pureza, Clorox Gel',
    supermarketPrices: { dia: 1990, coto: 2190, changomas: 2220, carrefour: 2300, vea: 2350, jumbo: 2800 }
  },
  {
    id: 'lim-06',
    name: 'Detergente Concentrado para Vajilla Botella 500 ml',
    category: 'limpieza',
    unit: 'u',
    price: 2250,
    priceMin: 1750,
    priceMax: 2850,
    brandExample: 'Magistral Ultra, Cif Bioactive, Ala',
    supermarketPrices: { dia: 1950, coto: 2100, changomas: 2150, carrefour: 2200, vea: 2250, jumbo: 2650 }
  },
  {
    id: 'lim-07',
    name: 'Detergente Económico para Vajilla 750 ml',
    category: 'limpieza',
    unit: 'u',
    price: 1650,
    priceMin: 1290,
    priceMax: 2150,
    brandExample: 'Ala Limón, Zorro, Querubín',
    supermarketPrices: { dia: 1390, changomas: 1520, coto: 1550, carrefour: 1600, vea: 1650, jumbo: 1980 }
  },
  {
    id: 'lim-08',
    name: 'Limpiador Líquido para Pisos Botella 900 ml',
    category: 'limpieza',
    unit: 'u',
    price: 1650,
    priceMin: 1290,
    priceMax: 2150,
    brandExample: 'Poett Primavera, Procenex, Cif Pisos',
    supermarketPrices: { dia: 1390, coto: 1520, changomas: 1550, carrefour: 1600, vea: 1650, jumbo: 1980 }
  },
  {
    id: 'lim-09',
    name: 'Cif Crema Limpiador Multiuso Blanco 750 g',
    category: 'limpieza',
    unit: 'u',
    price: 2650,
    priceMin: 2090,
    priceMax: 3350,
    brandExample: 'Cif Crema Original con Micropartículas',
    supermarketPrices: { dia: 2290, coto: 2480, changomas: 2520, carrefour: 2600, vea: 2650, jumbo: 3150 }
  },
  {
    id: 'lim-10',
    name: 'Desengrasante para Cocina Gatillo 500 ml',
    category: 'limpieza',
    unit: 'u',
    price: 2850,
    priceMin: 2250,
    priceMax: 3600,
    brandExample: 'Mr Músculo Cocina, Cif Antigrasa, Ayudín',
    supermarketPrices: { dia: 2450, coto: 2680, changomas: 2720, carrefour: 2800, vea: 2850, jumbo: 3390 }
  },
  {
    id: 'lim-11',
    name: 'Rollo de Cocina Papel Absorbente Pack x3 u',
    category: 'limpieza',
    unit: 'paquete',
    price: 2550,
    priceMin: 1990,
    priceMax: 3300,
    brandExample: 'Sussex Clásico, Elegante, Campanita',
    supermarketPrices: { dia: 2190, changomas: 2380, coto: 2420, carrefour: 2500, vea: 2550, jumbo: 3050 }
  },
  {
    id: 'lim-12',
    name: 'Esponja de Cocina Doble Cara Pack x3 u',
    category: 'limpieza',
    unit: 'paquete',
    price: 1350,
    priceMin: 1050,
    priceMax: 1750,
    brandExample: 'Mortimer, Scotch-Brite Verde y Amarilla',
    supermarketPrices: { dia: 1100, changomas: 1220, coto: 1250, carrefour: 1300, vea: 1350, jumbo: 1650 }
  },
  {
    id: 'lim-13',
    name: 'Bolsas para Residuos 45x55 cm Paquete x30 u',
    category: 'limpieza',
    unit: 'paquete',
    price: 1950,
    priceMin: 1550,
    priceMax: 2500,
    brandExample: 'Asur, Rolan, Coto',
    supermarketPrices: { dia: 1690, changomas: 1790, coto: 1850, carrefour: 1900, vea: 1950, jumbo: 2350 }
  },
  {
    id: 'lim-14',
    name: 'Bolsas de Consorcio Negras Reforzadas 60x90 cm x10 u',
    category: 'limpieza',
    unit: 'paquete',
    price: 2250,
    priceMin: 1750,
    priceMax: 2900,
    brandExample: 'Asur Consorcio, Rolan',
    supermarketPrices: { dia: 1950, changomas: 2090, coto: 2120, carrefour: 2200, vea: 2250, jumbo: 2690 }
  },

  // ==========================================
  // --- 8. CUIDADO PERSONAL Y PERFUMERÍA (13 productos) ---
  // ==========================================
  {
    id: 'per-01',
    name: 'Papel Higiénico Hoja Doble 4 u x 30 m',
    category: 'perfumeria',
    unit: 'paquete',
    price: 2950,
    priceMin: 2350,
    priceMax: 3800,
    brandExample: 'Higienol Max Doble Hoja, Elite Soft, Campanita',
    supermarketPrices: { dia: 2550, changomas: 2750, coto: 2820, carrefour: 2900, vea: 2950, jumbo: 3500 }
  },
  {
    id: 'per-02',
    name: 'Papel Higiénico Hoja Simple 4 u x 30 m',
    category: 'perfumeria',
    unit: 'paquete',
    price: 1950,
    priceMin: 1550,
    priceMax: 2500,
    brandExample: 'Higienol Clásico, Sweety, Carrefour',
    supermarketPrices: { dia: 1650, changomas: 1780, coto: 1850, carrefour: 1900, vea: 1950, jumbo: 2350 }
  },
  {
    id: 'per-03',
    name: 'Jabón de Tocador Cremoso Pack x3 u (90 g c/u)',
    category: 'perfumeria',
    unit: 'paquete',
    price: 2350,
    priceMin: 1850,
    priceMax: 3000,
    brandExample: 'Dove Original Blanco, Rexona, Lux, Plusbelle',
    supermarketPrices: { dia: 1990, coto: 2190, changomas: 2220, carrefour: 2300, vea: 2350, jumbo: 2800 }
  },
  {
    id: 'per-04',
    name: 'Pasta Dental Anticaries Fluoruro Tubo 90 g',
    category: 'perfumeria',
    unit: 'u',
    price: 2650,
    priceMin: 2090,
    priceMax: 3450,
    brandExample: 'Colgate Total 12, Colgate Triple Acción, Odol',
    supermarketPrices: { dia: 2290, coto: 2480, changomas: 2520, carrefour: 2600, vea: 2650, jumbo: 3150 }
  },
  {
    id: 'per-05',
    name: 'Shampoo para Todo Tipo de Cabello Botella 400 ml',
    category: 'perfumeria',
    unit: 'u',
    price: 4450,
    priceMin: 3500,
    priceMax: 5800,
    brandExample: 'Sedal Bomba de Argán, Pantene Restauración, Dove',
    supermarketPrices: { dia: 3890, coto: 4200, changomas: 4250, carrefour: 4350, vea: 4450, jumbo: 5300 }
  },
  {
    id: 'per-06',
    name: 'Acondicionador Desenredante Botella 400 ml',
    category: 'perfumeria',
    unit: 'u',
    price: 4450,
    priceMin: 3500,
    priceMax: 5800,
    brandExample: 'Sedal, Pantene, Elvive L’Oréal',
    supermarketPrices: { dia: 3890, coto: 4200, changomas: 4250, carrefour: 4350, vea: 4450, jumbo: 5300 }
  },
  {
    id: 'per-07',
    name: 'Desodorante Antitranspirante Aerosol 150 ml',
    category: 'perfumeria',
    unit: 'u',
    price: 3550,
    priceMin: 2800,
    priceMax: 4500,
    brandExample: 'Rexona Hombre/Mujer Odor-Protect, Dove, Axe',
    supermarketPrices: { dia: 3100, coto: 3350, changomas: 3400, carrefour: 3500, vea: 3550, jumbo: 4200 }
  },
  {
    id: 'per-08',
    name: 'Jabón Líquido para Manos con Dosificador 250 ml',
    category: 'perfumeria',
    unit: 'u',
    price: 2450,
    priceMin: 1950,
    priceMax: 3150,
    brandExample: 'Rexona Antibacterial, Dove, Suave',
    supermarketPrices: { dia: 2100, coto: 2320, changomas: 2350, carrefour: 2400, vea: 2450, jumbo: 2900 }
  },
  {
    id: 'per-09',
    name: 'Toallitas Femeninas con Alas Ultrafinas Pack x16 u',
    category: 'perfumeria',
    unit: 'paquete',
    price: 2850,
    priceMin: 2250,
    priceMax: 3650,
    brandExample: 'Always Ultrafina, Ladysoft, Kotex',
    supermarketPrices: { dia: 2450, coto: 2680, changomas: 2720, carrefour: 2800, vea: 2850, jumbo: 3390 }
  },
  {
    id: 'per-10',
    name: 'Protectores Diarios Clásicos Pack x20 u',
    category: 'perfumeria',
    unit: 'paquete',
    price: 1850,
    priceMin: 1450,
    priceMax: 2400,
    brandExample: 'Carefree, Kotex, Calipso',
    supermarketPrices: { dia: 1550, changomas: 1720, coto: 1750, carrefour: 1800, vea: 1850, jumbo: 2200 }
  },
  {
    id: 'per-11',
    name: 'Máquina de Afeitar Descartable 3 Hojas Pack x2 u',
    category: 'perfumeria',
    unit: 'paquete',
    price: 3650,
    priceMin: 2900,
    priceMax: 4600,
    brandExample: 'Gillette Prestobarba 3, Schick Xtreme 3',
    supermarketPrices: { dia: 3200, coto: 3450, changomas: 3490, carrefour: 3600, vea: 3650, jumbo: 4350 }
  },
  {
    id: 'per-12',
    name: 'Pañales para Bebé Talle M/G Pack x36 u',
    category: 'perfumeria',
    unit: 'paquete',
    price: 13800,
    priceMin: 11200,
    priceMax: 17500,
    brandExample: 'Pampers Confort Sec, Huggies Triple Protección',
    supermarketPrices: { dia: 12200, coto: 12900, changomas: 13100, carrefour: 13500, vea: 13800, jumbo: 16400 }
  },
  {
    id: 'per-13',
    name: 'Toallitas Húmedas para Bebé Paquete x48 u',
    category: 'perfumeria',
    unit: 'paquete',
    price: 2450,
    priceMin: 1950,
    priceMax: 3150,
    brandExample: 'Huggies Puro y Natural, Pampers Limpieza',
    supermarketPrices: { dia: 2100, coto: 2320, changomas: 2350, carrefour: 2400, vea: 2450, jumbo: 2900 }
  },

  // ==========================================
  // --- 9. CONGELADOS Y COMIDAS PRÁCTICAS (8 productos) ---
  // ==========================================
  {
    id: 'con-01',
    name: 'Hamburguesas de Carne Clásicas Pack x4 u',
    category: 'congelados',
    unit: 'paquete',
    price: 4950,
    priceMin: 3950,
    priceMax: 6300,
    brandExample: 'Paty Clásicas, Swift, GoodMark',
    supermarketPrices: { dia: 4350, coto: 4650, changomas: 4700, carrefour: 4850, vea: 4950, jumbo: 5850 }
  },
  {
    id: 'con-02',
    name: 'Medallones de Carne Económicos Pack x4 u',
    category: 'congelados',
    unit: 'paquete',
    price: 3650,
    priceMin: 2900,
    priceMax: 4600,
    brandExample: 'Swift Medallón, Coto, Carrefour',
    supermarketPrices: { dia: 3190, coto: 3450, changomas: 3480, carrefour: 3600, vea: 3650, jumbo: 4300 }
  },
  {
    id: 'con-03',
    name: 'Nuggets de Pollo Crocantes Paquete 400 g',
    category: 'congelados',
    unit: 'paquete',
    price: 4450,
    priceMin: 3500,
    priceMax: 5650,
    brandExample: 'Granja del Sol, Sadia, Lucchetti',
    supermarketPrices: { dia: 3890, coto: 4200, changomas: 4250, carrefour: 4350, vea: 4450, jumbo: 5250 }
  },
  {
    id: 'con-04',
    name: 'Papas Fritas Congeladas Corte Tradicional 720 g',
    category: 'congelados',
    unit: 'paquete',
    price: 4650,
    priceMin: 3700,
    priceMax: 5900,
    brandExample: 'McCain Tradicionales, Farm Frites',
    supermarketPrices: { dia: 4090, coto: 4380, changomas: 4420, carrefour: 4550, vea: 4650, jumbo: 5490 }
  },
  {
    id: 'con-05',
    name: 'Espinaca Congelada en Porciones 400 g',
    category: 'congelados',
    unit: 'paquete',
    price: 2950,
    priceMin: 2350,
    priceMax: 3750,
    brandExample: 'Granja del Sol, Green Life, Coto',
    supermarketPrices: { dia: 2550, coto: 2790, changomas: 2820, carrefour: 2900, vea: 2950, jumbo: 3500 }
  },
  {
    id: 'con-06',
    name: 'Milanesas de Soja Rellenas Queso x4 u',
    category: 'congelados',
    unit: 'paquete',
    price: 3650,
    priceMin: 2900,
    priceMax: 4650,
    brandExample: 'Granja del Sol, Vegetalex, Lucchetti',
    supermarketPrices: { dia: 3190, coto: 3450, changomas: 3480, carrefour: 3600, vea: 3650, jumbo: 4300 }
  },
  {
    id: 'con-07',
    name: 'Pizza Congelada de Muzzarella Lista para Horno',
    category: 'congelados',
    unit: 'u',
    price: 4850,
    priceMin: 3900,
    priceMax: 6100,
    brandExample: 'Sibarita Muzzarella, Coto Artesanal',
    supermarketPrices: { dia: 4250, coto: 4550, changomas: 4600, carrefour: 4750, vea: 4850, jumbo: 5750 }
  },
  {
    id: 'con-08',
    name: 'Helado Balde Familiar 1 kg / 3 Sabores',
    category: 'congelados',
    unit: 'u',
    price: 6400,
    priceMin: 5100,
    priceMax: 8100,
    brandExample: 'Grido, Frigor, NotCo, Arcor',
    supermarketPrices: { dia: 5600, coto: 6050, changomas: 6100, carrefour: 6300, vea: 6400, jumbo: 7600 }
  },

  // ==========================================
  // --- 10. ALIMENTOS Y CUIDADO DE MASCOTAS (6 productos) ---
  // ==========================================
  {
    id: 'mas-01',
    name: 'Alimento Seco para Perro Adulto Raza Mediana 3 kg',
    category: 'mascotas',
    unit: 'paquete',
    price: 8900,
    priceMin: 7200,
    priceMax: 11200,
    brandExample: 'Dog Chow Adultos, Pedigree Carne y Vegetales, Raza',
    supermarketPrices: { changomas: 7950, dia: 8200, coto: 8500, carrefour: 8700, vea: 8900, jumbo: 10500 }
  },
  {
    id: 'mas-02',
    name: 'Alimento Seco para Perro Adulto Raza Pequeña 1.5 kg',
    category: 'mascotas',
    unit: 'paquete',
    price: 5200,
    priceMin: 4200,
    priceMax: 6500,
    brandExample: 'Dog Chow Minis y Pequeños, Pedigree',
    supermarketPrices: { changomas: 4650, dia: 4800, coto: 4950, carrefour: 5100, vea: 5200, jumbo: 6100 }
  },
  {
    id: 'mas-03',
    name: 'Alimento Seco para Gatos Adultos 1.5 kg',
    category: 'mascotas',
    unit: 'paquete',
    price: 6800,
    priceMin: 5500,
    priceMax: 8500,
    brandExample: 'Cat Chow Pescado y Pollo, Whiskas Carne',
    supermarketPrices: { changomas: 6100, dia: 6250, coto: 6450, carrefour: 6650, vea: 6800, jumbo: 8000 }
  },
  {
    id: 'mas-04',
    name: 'Alimento Húmedo en Sobre para Perro / Gato 85 g',
    category: 'mascotas',
    unit: 'u',
    price: 950,
    priceMin: 750,
    priceMax: 1250,
    brandExample: 'Whiskas Pouch, Pedigree Sobre, Felix',
    supermarketPrices: { changomas: 850, dia: 870, coto: 910, carrefour: 930, vea: 950, jumbo: 1120 }
  },
  {
    id: 'mas-05',
    name: 'Piedras Sanitarias Absorbentes para Gato Bolsa 4 kg',
    category: 'mascotas',
    unit: 'paquete',
    price: 3600,
    priceMin: 2900,
    priceMax: 4500,
    brandExample: 'Absorsol, CanCat, Poopy Pets, Coto',
    supermarketPrices: { changomas: 3200, dia: 3350, coto: 3450, carrefour: 3550, vea: 3600, jumbo: 4250 }
  },
  {
    id: 'mas-06',
    name: 'Golosinas Snacks Huesitos / Dentastix para Perro x3 u',
    category: 'mascotas',
    unit: 'paquete',
    price: 2450,
    priceMin: 1950,
    priceMax: 3100,
    brandExample: 'Dentastix Pedigree, Dog Chow Caramelo',
    supermarketPrices: { changomas: 2180, dia: 2250, coto: 2320, carrefour: 2400, vea: 2450, jumbo: 2900 }
  },
];
