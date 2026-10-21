export type CategoryId =
  | 'almacen'
  | 'lacteos'
  | 'carniceria'
  | 'verduleria'
  | 'panaderia'
  | 'bebidas'
  | 'limpieza'
  | 'perfumeria'
  | 'congelados'
  | 'mascotas'
  | 'otros';

export interface Category {
  id: CategoryId;
  name: string;
  icon: string;
  color: string;
}

export type UnitType = 'u' | 'kg' | 'g' | 'L' | 'ml' | 'paquete';

export type SupermarketId = 'coto' | 'carrefour' | 'dia' | 'jumbo' | 'changomas' | 'vea';

export interface SupermarketChain {
  id: SupermarketId;
  name: string;
  shortName: string;
  tagline: string;
  badge: string;
  logoEmoji: string;
  color: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
  promosTip: string;
  discountDayTip: string;
  priceModifier: number; // Factor promedio relativo al mercado
  categoryModifiers: Partial<Record<CategoryId, number>>;
}

export interface CatalogProduct {
  id: string;
  name: string;
  category: CategoryId;
  unit: UnitType;
  price: number; // Precio promedio de referencia en ARS (Prov. de Buenos Aires, Octubre 2026)
  priceMin?: number;
  priceMax?: number;
  brandExample?: string;
  isCustom?: boolean;
  supermarketPrices?: Partial<Record<SupermarketId, number>>;
}

export interface ItemModifier {
  userName: string;
  userColor: string;
  action: 'agregó' | 'marcó en carrito' | 'desmarcó' | 'modificó cantidad' | 'editó precio' | 'editó nota';
  timestamp: number;
}

export type PricingScenario = 'max' | 'avg' | 'min';

export interface ShoppingItem {
  id: string;
  name: string;
  category: CategoryId;
  unit: UnitType;
  unitPrice: number;
  quantity: number;
  checked: boolean;
  notes?: string;
  isCustom?: boolean;
  addedAt: number;
  supermarketOrigin?: SupermarketId;
  pricingScenario?: PricingScenario;
  lastModifiedBy?: ItemModifier;
}

export interface BudgetConfig {
  totalBudget: number;
  enabled: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  color: string;
}

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';

export type ActiveTabType = 'list' | 'supermarkets' | 'catalog';
