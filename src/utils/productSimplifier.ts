/**
 * Utilidad para simplificar nombres de productos al exportar a WhatsApp o notas de compras.
 * Remueve descripciones comerciales de catálogo y conserva únicamente el nombre esencial y tamaño/peso.
 * Ejemplo: "Lentejas Secas Seleccionadas 400 g x1" -> "Lentejas 400g"
 */

const STATIC_SIMPLIFICATIONS: Array<[RegExp, string]> = [
  // Almacén
  [/Lentejas(?:\s+Secas)?(?:\s+Seleccionadas)?\s*400\s*g/i, 'Lentejas 400g'],
  [/Aceite de Girasol\s*900\s*ml/i, 'Aceite de Girasol 900ml'],
  [/Aceite de Girasol\s*1\.5\s*L/i, 'Aceite de Girasol 1.5L'],
  [/Aceite de Oliva(?:\s+Extra\s+Virgen)?\s*500\s*ml/i, 'Aceite de Oliva 500ml'],
  [/Arroz Largo Fino(?:\s+No Se Pasa)?\s*1\s*kg/i, 'Arroz 1kg'],
  [/Arroz Doble Carolina\s*1\s*kg/i, 'Arroz Doble Carolina 1kg'],
  [/Fideos(?:\s+Secos)?(?:\s+Guiseros)?(?:\s*\/\s*Tirabuzón)?\s*500\s*g/i, 'Fideos Tirabuzón 500g'],
  [/Fideos Tallarines(?:\s*\/\s*Spaghetti)?\s*500\s*g/i, 'Fideos Tallarines 500g'],
  [/Fideos Mostacholes(?:\s*\/\s*Penne Rigate)?\s*500\s*g/i, 'Fideos Mostacholes 500g'],
  [/Harina(?: de Trigo)?\s*000\s*1\s*kg/i, 'Harina 000 1kg'],
  [/Harina(?: de Trigo)?\s*0000\s*1\s*kg/i, 'Harina 0000 1kg'],
  [/Harina(?: de Trigo)?\s*Leudante\s*1\s*kg/i, 'Harina Leudante 1kg'],
  [/Polenta(?:\s+de Cocción Rápida)?(?:\s*1\s*Minuto)?\s*500\s*g/i, 'Polenta 500g'],
  [/Azúcar(?:\s+Común)?(?:\s+Tipo A)?\s*1\s*kg/i, 'Azúcar 1kg'],
  [/Sal Fina(?:\s+de Mesa)?(?:\s+Estuche)?\s*500\s*g/i, 'Sal Fina 500g'],
  [/Sal Gruesa(?:\s*\/\s*Entrefina)?(?:\s+para Asado)?\s*1\s*kg/i, 'Sal Gruesa 1kg'],
  [/Puré de Tomate(?:\s+Tetra Brik)?\s*520\s*g/i, 'Puré de Tomate 520g'],
  [/Tomate Triturado(?:\s+Botella)?\s*970\s*g/i, 'Tomate Triturado 970g'],
  [/Atún en Lomo(?:\s+al Natural\s*\/\s*Aceite)?(?:\s+Lata)?\s*170\s*g/i, 'Atún en Lomo 170g'],
  [/Mayonesa(?:\s+Clásica)?(?:\s+Doypack)?\s*475\s*g/i, 'Mayonesa 475g'],
  [/Mostaza(?:\s+Tradicional)?(?:\s+Pote\s*\/\s*Doypack)?\s*250\s*g/i, 'Mostaza 250g'],
  [/Kétchup(?:\s+Doypack)?\s*250\s*g/i, 'Kétchup 250g'],
  [/Galletitas de Agua(?:\s+Criollitas)?(?:\s+Tripack)?\s*300\s*g/i, 'Galletitas Criollitas 300g'],
  [/Galletitas Chocolinas(?:\s+Paquete)?\s*250\s*g/i, 'Chocolinas 250g'],
  [/Galletitas Rellenas de Chocolate(?:\s*\/\s*Oreo)?\s*118\s*g/i, 'Galletitas Oreo 118g'],
  [/Bizcochitos de Grasa(?:\s+Salados\s*\/\s*Dulces)?\s*200\s*g/i, 'Bizcochitos Don Satur 200g'],
  [/Mermelada(?:\s+Frasco)?\s*454\s*g/i, 'Mermelada 454g'],
  [/Dulce de Batata(?:\s*\/\s*Membrillo)?(?:\s+Pan)?\s*500\s*g/i, 'Dulce de Batata/Membrillo 500g'],
  [/Caldos de Verdura(?:\s*\/\s*Gallina\s*\/\s*Carne)?(?:\s+Caja)?(?:\s*x12\s*u)?/i, 'Caldos Knorr x12'],
  [/Vinagre de Alcohol(?:\s*\/\s*Manzana)?(?:\s+Botella)?\s*1\s*L/i, 'Vinagre 1L'],

  // Lácteos y Frescos
  [/Leche Entera(?:\s*\/\s*Descremada)?(?:\s+Sachet)?\s*1\s*L/i, 'Leche 1L'],
  [/Leche Larga Vida(?:\s+UAT)?(?:\s+Tetra Brik)?\s*1\s*L/i, 'Leche Larga Vida 1L'],
  [/Manteca(?:\s+Calidad Extra)?(?:\s+Pan)?\s*200\s*g/i, 'Manteca 200g'],
  [/Dulce de Leche(?:\s+Clásico\s*\/\s*Colonial)?(?:\s+Pote)?\s*400\s*g/i, 'Dulce de Leche 400g'],
  [/Queso Cremoso(?:\s*\/\s*Cremón)?(?:\s+Fraccionado)?\s*1\s*kg/i, 'Queso Cremoso 1kg'],
  [/Queso Port Salut(?:\s+Tradicional\s*\/\s*Light)?\s*1\s*kg/i, 'Queso Port Salut 1kg'],
  [/Queso Rallado(?:\s+Reggianito)?(?:\s+Sobre)?\s*100\s*g/i, 'Queso Rallado 100g'],
  [/Queso Muzzarella(?:\s+en Barra para Pizza)?\s*1\s*kg/i, 'Muzzarella 1kg'],
  [/Queso Tybo(?:\s*\/\s*Dambo)?(?:\s+en Fetas)?(?:\s+Pote)?\s*200\s*g/i, 'Queso en Fetas 200g'],
  [/Queso Crema(?:\s+Casancrem\s*\/\s*Finlandia)?(?:\s+Pote)?\s*290\s*g/i, 'Queso Crema 290g'],
  [/Yogur Bebible(?:\s+Sachet)?\s*1\s*L/i, 'Yogur Bebible 1L'],
  [/Yogur Firme(?:\s*\/\s*Batido)?(?:\s+Pack)?(?:\s*x2)?/i, 'Yogur Firme x2'],
  [/Crema de Leche(?:\s+Pote)?\s*200\s*ml/i, 'Crema de Leche 200ml'],
  [/Postre Infantil(?:\s+Chocolate\s*\/\s*Dulce de Leche)?(?:\s+Pack\s*x2)?/i, 'Postrecitos x2'],
  [/Ricotta(?:\s+Magra)?(?:\s+Pote\s*\/\s*Pan)?\s*500\s*g/i, 'Ricotta 500g'],
  [/Huevos Blancos(?:\s+Seleccionados)?(?:\s+Docena)?(?:\s*\(12\s*u\))?/i, 'Huevos Docena (12u)'],
  [/Huevos Blancos(?:\s+Maple)?(?:\s*x30\s*Unidades)?/i, 'Huevos Maple x30'],
  [/Levadura Fresca(?:\s+en Cubito)?(?:\s+Pack)?(?:\s*50\s*g\s*x2)?/i, 'Levadura Fresca x2'],

  // Carnicería
  [/Asado de Tira(?:\s+Novillito)?\s*1\s*kg/i, 'Asado de Tira 1kg'],
  [/Vacío(?:\s+de Novillito)?\s*1\s*kg/i, 'Vacío 1kg'],
  [/Bife de Chorizo(?:\s+de Novillo)?\s*1\s*kg/i, 'Bife de Chorizo 1kg'],
  [/Nalga(?:\s+Feteada para Milanesas)?\s*1\s*kg/i, 'Nalga para Milanesas 1kg'],
  [/Bola de Lomo(?:\s+para Milanesas)?\s*1\s*kg/i, 'Bola de Lomo 1kg'],
  [/Peceto(?:\s+Entero\s*\/\s*Feteado)?\s*1\s*kg/i, 'Peceto 1kg'],
  [/Carne Picada Especial(?:\s+Magra)?\s*1\s*kg/i, 'Picada Especial 1kg'],
  [/Carne Picada Intermedia(?:\s*\/\s*Común)?\s*1\s*kg/i, 'Picada Común 1kg'],
  [/Pollo Entero(?:\s+Fresco)?(?:\s+Eviscerado)?\s*1\s*kg/i, 'Pollo Entero 1kg'],
  [/Pechuga de Pollo(?:\s+Fileteada sin Piel)?\s*1\s*kg/i, 'Pechuga de Pollo 1kg'],
  [/Pata y Muslo(?:\s+de Pollo)?\s*1\s*kg/i, 'Pata y Muslo 1kg'],
  [/Milanesas de Carne(?:\s+Rebozadas Preparadas)?\s*1\s*kg/i, 'Milanesas de Carne 1kg'],
  [/Milanesas de Pollo(?:\s+Rebozadas)?\s*1\s*kg/i, 'Milanesas de Pollo 1kg'],
  [/Costillitas(?:\s*\/\s*Pechito)?(?:\s+de Cerdo)?\s*1\s*kg/i, 'Costillitas de Cerdo 1kg'],
  [/Bondiola de Cerdo(?:\s+Fresca)?\s*1\s*kg/i, 'Bondiola 1kg'],
  [/Chorizo Puro Cerdo(?:\s*\/\s*Parrillero Bombón)?\s*1\s*kg/i, 'Chorizo 1kg'],
  [/Morcilla Criolla(?:\s+Bombón)?\s*1\s*kg/i, 'Morcilla 1kg'],
  [/Filet de Merluza(?:\s+Fresco Despinado)?\s*1\s*kg/i, 'Filet de Merluza 1kg'],

  // Frutas y Verduras
  [/Papa Negra(?:\s*\/\s*Común)?\s*1\s*kg/i, 'Papa Negra 1kg'],
  [/Papa Blanca(?:\s*\/\s*Lavada Cepillada)?\s*1\s*kg/i, 'Papa Lavada 1kg'],
  [/Cebolla(?:\s+Comercial)?\s*1\s*kg/i, 'Cebolla 1kg'],
  [/Tomate Redondo(?:\s+Comercial)?\s*1\s*kg/i, 'Tomate Redondo 1kg'],
  [/Tomate Perita(?:\s+Maduro)?\s*1\s*kg/i, 'Tomate Perita 1kg'],
  [/Lechuga Criolla(?:\s*\/\s*Mantecosa)?\s*1\s*kg/i, 'Lechuga 1kg'],
  [/Zanahoria(?:\s+Común)?\s*1\s*kg/i, 'Zanahoria 1kg'],
  [/Morrón Rojo\s*1\s*kg/i, 'Morrón Rojo 1kg'],
  [/Zapallito Redondo(?:\s+Verde)?\s*1\s*kg/i, 'Zapallitos 1kg'],
  [/Calabaza(?:\s*\/\s*Zapallo Anco)?\s*1\s*kg/i, 'Calabaza 1kg'],
  [/Palta Hass(?:\s+Calidad Superior)?(?:\s+x\s*Unidad)?/i, 'Palta Hass'],
  [/Banana Ecuador\s*1\s*kg/i, 'Banana 1kg'],
  [/Manzana Red Delicious\s*1\s*kg/i, 'Manzana 1kg'],
  [/Naranja para Jugo\s*1\s*kg/i, 'Naranja para Jugo 1kg'],
  [/Mandarina Criolla(?:\s*\/\s*Murcott)?\s*1\s*kg/i, 'Mandarina 1kg'],
  [/Limón Amarillo(?:\s+Comercial)?\s*1\s*kg/i, 'Limón 1kg'],

  // Panadería y Pastas
  [/Pan Francés(?:\s*\/\s*Flauta)?(?:\s+Fresco del Día)?\s*1\s*kg/i, 'Pan Francés 1kg'],
  [/Pan Mignon(?:\s*\/\s*Felipe)?(?:\s+Fresco)?\s*1\s*kg/i, 'Pan Mignon 1kg'],
  [/Pan de Molde Lactal(?:\s+Blanco)?(?:\s+Paquete)?\s*550\s*g/i, 'Pan Lactal 550g'],
  [/Pan de Salvado(?:\s*\/\s*Integral con Semillas)?\s*550\s*g/i, 'Pan Salvado 550g'],
  [/Pan para Hamburguesas(?:\s+Pack)?(?:\s*x4\s*u)?/i, 'Pan Hamburguesas x4'],
  [/Pan para Panchos(?:\s*\/\s*Viena)?(?:\s+Pack)?(?:\s*x6\s*u)?/i, 'Pan Panchos x6'],
  [/Facturas Surtidas(?:\s+de Manteca\s*\/\s*Grasa)?(?:\s+Docena)?(?:\s*\(12\s*u\))?/i, 'Facturas Docena (12u)'],
  [/Medialunas de Manteca(?:\s+Pack)?(?:\s*x6\s*u)?/i, 'Medialunas x6'],
  [/Chipá de Queso(?:\s+Tradicional)?(?:\s+Bolsa)?\s*250\s*g/i, 'Chipá 250g'],
  [/Tapas de Empanadas(?:\s+Hojaldre\s*\/\s*Criollas)?(?:\s+Pack)?(?:\s*x12\s*u)?/i, 'Tapas Empanadas x12'],
  [/Tapas para Pascualina(?:\s+Hojaldre)?(?:\s+Pack)?(?:\s*x2\s*u)?/i, 'Tapas Pascualina x2'],
  [/Ravioles Frescos de Ricotta(?:\s+y Espinaca)?(?:\s+Caja)?\s*450\s*g/i, 'Ravioles Ricotta 450g'],
  [/Ñoquis de Papa(?:\s+Frescos)?(?:\s+Bandeja)?\s*500\s*g/i, 'Ñoquis de Papa 500g'],
  [/Fideos Cintas Frescas(?:\s+al Huevo)?\s*500\s*g/i, 'Fideos Cintas 500g'],

  // Bebidas e Infusiones
  [/Yerba Mate Tradicional(?:\s+con Palo)?\s*1\s*kg/i, 'Yerba Mate 1kg'],
  [/Yerba Mate Tradicional(?:\s+con Palo)?\s*500\s*g/i, 'Yerba Mate 500g'],
  [/Yerba Mate Compuesta(?:\s+con Hierbas Serranas)?\s*500\s*g/i, 'Yerba CBSé Hierbas 500g'],
  [/Café Tostado y Molido(?:\s+Torrado\s*\/\s*Filtro)?\s*250\s*g/i, 'Café Molido 250g'],
  [/Café Instantáneo(?:\s+Frasco Vidrio)?\s*170\s*g/i, 'Café Instantáneo 170g'],
  [/Té Negro en Saquitos(?:\s+Caja)?(?:\s*x50\s*u)?/i, 'Té Negro x50'],
  [/Mate Cocido en Saquitos(?:\s+Caja)?(?:\s*x50\s*u)?/i, 'Mate Cocido x50'],
  [/Cacao en Polvo(?:\s+Chocolatada)?(?:\s+Doypack)?\s*360\s*g/i, 'Cacao Nesquik 360g'],
  [/Agua Mineral Natural sin Gas\s*2\s*L/i, 'Agua sin Gas 2L'],
  [/Agua Mineral con Gas\s*1\.5\s*L/i, 'Agua con Gas 1.5L'],
  [/Soda en Sifón(?:\s+Descartable con Válvula)?\s*1\.5\s*L/i, 'Soda Sifón 1.5L'],
  [/Gaseosa Cola Sabor Original(?:\s+Botella)?\s*2\.25\s*L/i, 'Coca-Cola 2.25L'],
  [/Gaseosa Cola Sin Azúcar(?:\s+Botella)?\s*2\.25\s*L/i, 'Coca-Cola Zero 2.25L'],
  [/Gaseosa Lima-Limón(?:\s+Botella)?\s*2\.25\s*L/i, 'Sprite 2.25L'],
  [/Jugo en Polvo Sobrecito/i, 'Jugo en Polvo (Tang/Clight)'],
  [/Cerveza Rubia Clásica(?:\s+en Lata)?\s*473\s*ml/i, 'Cerveza Quilmes 473ml'],
  [/Cerveza Premium Rubia(?:\s+Lata)?\s*473\s*ml/i, 'Cerveza Heineken 473ml'],
  [/Vino Tinto Malbec(?:\s+Joven)?(?:\s+Botella)?\s*750\s*ml/i, 'Vino Malbec 750ml'],
  [/Aperitivo Fernet(?:\s+Tradicional)?(?:\s+Botella)?\s*750\s*ml/i, 'Fernet Branca 750ml'],
  [/Amargo Terma(?:\s+Serrano\s*\/\s*Citrus)?(?:\s+Botella)?\s*1\.35\s*L/i, 'Terma Serrano 1.35L'],

  // Limpieza
  [/Jabón Líquido para Ropa(?:\s+Botella)?\s*3\s*L/i, 'Jabón Líquido Ropa 3L'],
  [/Jabón Líquido para Ropa(?:\s+Doypack Económico)?\s*800\s*ml/i, 'Jabón Líquido Ropa 800ml'],
  [/Suavizante para Ropa(?:\s+Concentrado)?(?:\s+Doypack)?\s*900\s*ml/i, 'Suavizante Ropa 900ml'],
  [/Lavandina Clásica(?:\s+Desinfectante)?(?:\s+Botella)?\s*1\s*L/i, 'Lavandina 1L'],
  [/Lavandina Concentrada(?:\s*\/\s*en Gel)?(?:\s+Botella)?\s*2\s*L/i, 'Lavandina en Gel 2L'],
  [/Detergente Concentrado para Vajilla(?:\s+Botella)?\s*500\s*ml/i, 'Detergente Vajilla 500ml'],
  [/Detergente Económico para Vajilla\s*750\s*ml/i, 'Detergente Vajilla 750ml'],
  [/Limpiador Líquido para Pisos(?:\s+Botella)?\s*900\s*ml/i, 'Limpiador Pisos 900ml'],
  [/Cif Crema Limpiador Multiuso(?:\s+Blanco)?\s*750\s*g/i, 'Cif Crema 750g'],
  [/Desengrasante para Cocina(?:\s+Gatillo)?\s*500\s*ml/i, 'Desengrasante Cocina 500ml'],
  [/Rollo de Cocina(?:\s+Papel Absorbente)?(?:\s+Pack)?(?:\s*x3\s*u)?/i, 'Rollo de Cocina x3'],
  [/Esponja de Cocina(?:\s+Doble Cara)?(?:\s+Pack)?(?:\s*x3\s*u)?/i, 'Esponjas Cocina x3'],
  [/Bolsas para Residuos(?:\s+45x55 cm)?(?:\s+Paquete)?(?:\s*x30\s*u)?/i, 'Bolsas Residuos x30'],
  [/Bolsas de Consorcio(?:\s+Negras Reforzadas)?(?:\s+60x90 cm)?(?:\s*x10\s*u)?/i, 'Bolsas Consorcio x10'],
  [/Papel Higiénico Hoja Doble(?:\s*4\s*u\s*x\s*30\s*m)?/i, 'Papel Higiénico Doble Hoja x4'],
  [/Papel Higiénico Hoja Simple(?:\s*4\s*u\s*x\s*30\s*m)?/i, 'Papel Higiénico Simple x4'],

  // Perfumería
  [/Jabón de Tocador(?:\s+Cremoso)?(?:\s+Pack)?(?:\s*x3\s*u)?/i, 'Jabón de Tocador x3'],
  [/Pasta Dental(?:\s+Anticaries Fluoruro)?(?:\s+Tubo)?\s*90\s*g/i, 'Pasta Dental 90g'],
  [/Shampoo para Todo Tipo de Cabello(?:\s+Botella)?\s*400\s*ml/i, 'Shampoo 400ml'],
  [/Acondicionador Desenredante(?:\s+Botella)?\s*400\s*ml/i, 'Acondicionador 400ml'],
  [/Desodorante Antitranspirante(?:\s+Aerosol)?\s*150\s*ml/i, 'Desodorante 150ml'],
  [/Jabón Líquido para Manos(?:\s+con Dosificador)?\s*250\s*ml/i, 'Jabón Líquido Manos 250ml'],
  [/Toallitas Femeninas(?:\s+con Alas Ultrafinas)?(?:\s+Pack)?(?:\s*x16\s*u)?/i, 'Toallitas Femeninas x16'],
  [/Protectores Diarios(?:\s+Clásicos)?(?:\s+Pack)?(?:\s*x20\s*u)?/i, 'Protectores Diarios x20'],
  [/Máquina de Afeitar(?:\s+Descartable 3 Hojas)?(?:\s+Pack)?(?:\s*x2\s*u)?/i, 'Prestobarba 3 x2'],
  [/Pañales para Bebé(?:\s+Talle M\/G)?(?:\s+Pack)?(?:\s*x36\s*u)?/i, 'Pañales Bebé x36'],
  [/Toallitas Húmedas para Bebé(?:\s+Paquete)?(?:\s*x48\s*u)?/i, 'Toallitas Húmedas x48'],

  // Congelados
  [/Hamburguesas de Carne(?:\s+Clásicas)?(?:\s+Pack)?(?:\s*x4\s*u)?/i, 'Hamburguesas Paty x4'],
  [/Medallones de Carne(?:\s+Económicos)?(?:\s+Pack)?(?:\s*x4\s*u)?/i, 'Medallones Carne x4'],
  [/Nuggets de Pollo(?:\s+Crocantes)?(?:\s+Paquete)?\s*400\s*g/i, 'Nuggets Pollo 400g'],
  [/Papas Fritas Congeladas(?:\s+Corte Tradicional)?\s*720\s*g/i, 'Papas Congeladas 720g'],
  [/Espinaca Congelada(?:\s+en Porciones)?\s*400\s*g/i, 'Espinaca Congelada 400g'],
  [/Milanesas de Soja(?:\s+Rellenas Queso)?(?:\s*x4\s*u)?/i, 'Milanesas de Soja x4'],
  [/Pizza Congelada de Muzzarella(?:\s+Lista para Horno)?/i, 'Pizza Congelada'],
  [/Helado Balde Familiar\s*1\s*kg/i, 'Helado Familiar 1kg'],

  // Mascotas
  [/Alimento Seco para Perro Adulto Raza Mediana\s*3\s*kg/i, 'Alimento Perro 3kg'],
  [/Alimento Seco para Perro Adulto Raza Pequeña\s*1\.5\s*kg/i, 'Alimento Perro Chico 1.5kg'],
  [/Alimento Seco para Gatos Adultos\s*1\.5\s*kg/i, 'Alimento Gatos 1.5kg'],
  [/Alimento Húmedo en Sobre para Perro\s*\/\s*Gato\s*85\s*g/i, 'Alimento Húmedo Sobre'],
  [/Piedras Sanitarias Absorbentes para Gato(?:\s+Bolsa)?\s*4\s*kg/i, 'Piedras para Gato 4kg'],
  [/Golosinas Snacks Huesitos(?:\s*\/\s*Dentastix)?(?:\s+para Perro)?(?:\s*x3\s*u)?/i, 'Dentastix Perro x3'],
];

/**
 * Limpia y simplifica el nombre de un producto:
 * - Elimina sufijos como "x1", "(x1)", "x 1 u"
 * - Elimina adjetivos comerciales superfluos ("Secas Seleccionadas", "Tradicional", etc.)
 * - Compacta espaciado de unidades ("400 g" -> "400g", "1 kg" -> "1kg", "1 L" -> "1L")
 * - Devuelve un nombre limpio, directo y amigable para leer en WhatsApp
 */
export function simplifyProductName(rawName: string): string {
  if (!rawName) return '';

  // 1. Eliminar multiplicadores superfluos x1 adheridos al texto (ej: "Lentejas 400g x1" -> "Lentejas 400g")
  let cleaned = rawName
    .replace(/\s*\(?\s*x\s*1\s*(?:u|unidades)?\s*\)?$/i, '')
    .replace(/\s*x\s*1\b/i, '')
    .trim();

  // 2. Verificar coincidencias en el diccionario específico
  for (const [pattern, simplified] of STATIC_SIMPLIFICATIONS) {
    if (pattern.test(cleaned)) {
      return simplified;
    }
  }

  // 3. Reglas heurísticas de limpieza general para productos nuevos o personalizados
  cleaned = cleaned
    .replace(/\s+(?:Secas|Secos|Seleccionadas|Seleccionados|Seleccionada|Seleccionado)\b/gi, '')
    .replace(/\s+(?:Tradicional|Comercial|Común|Eviscerado|Fresca|Fresco|Económico|Económica|Económicos)\b/gi, '')
    .replace(/\s+con Palo\b/gi, '')
    .replace(/\s+Tipo\s+[A-Z0-9]+\b/gi, '')
    .replace(/\s+Tetra\s*Brik\b/gi, '')
    .replace(/\s+Doypack\b/gi, '')
    .replace(/\s+Botella\b/gi, '')
    .replace(/\s+Frasco(?:\s+Vidrio)?\b/gi, '')
    .replace(/\s+Pote\b/gi, '')
    .replace(/\s+Sachet\b/gi, '')
    .replace(/\s+Caja\b/gi, '')
    .replace(/\s+Sobre\b/gi, '')
    .replace(/\s+Tubo\b/gi, '')
    .replace(/\s+Bandeja\b/gi, '')
    .replace(/\s+Pan\b/gi, '')
    .replace(/\s+Gatillo\b/gi, '')
    .replace(/\s+Aerosol\b/gi, '')
    .replace(/\s+Pack\b/gi, '')
    .replace(/\s+Paquete\b/gi, '')
    .replace(/\s+Larga\s+Vida(?:\s+UAT)?\b/gi, '')
    .replace(/\s+Calidad\s+Extra\b/gi, '')
    .replace(/\s+del\s+Día\b/gi, '')
    // Compactar unidades ("400 g" -> "400g", "1 kg" -> "1kg", "1 L" -> "1L")
    .replace(/(\d+)\s+g\b/gi, '$1g')
    .replace(/(\d+)\s+kg\b/gi, '$1kg')
    .replace(/(\d+(?:\.\d+)?)\s+L\b/gi, '$1L')
    .replace(/(\d+)\s+ml\b/gi, '$1ml')
    // Limpieza de espacios múltiples
    .replace(/\s+/g, ' ')
    .trim();

  return cleaned;
}

/**
 * Formatea una línea de artículo para WhatsApp según las especificaciones del usuario:
 * - Nombre simplificado (ej: "Lentejas 400g")
 * - Si cantidad > 1: " (x2)"
 * - Si cantidad === 1: NADA de "x1"
 * - SIN precio individual por producto (solo se muestra al final de la lista)
 */
export function formatWhatsAppItemLine(
  item: { name: string; quantity: number; checked?: boolean; notes?: string },
  includeItemPrice = false,
  unitPrice = 0,
  formattedPriceStr = ''
): string {
  const status = item.checked ? '✅' : '▫️';
  const cleanName = simplifyProductName(item.name);
  const qtyStr = item.quantity > 1 ? ` (x${item.quantity})` : '';
  const noteStr = item.notes ? ` [${item.notes}]` : '';
  const priceStr = includeItemPrice && unitPrice > 0 ? ` - ${formattedPriceStr}` : '';

  return `${status} ${cleanName}${qtyStr}${noteStr}${priceStr}`;
}
