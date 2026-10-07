import { CategoryInfo, ColorVariant, GarmentDesign, SizeOption } from '../types/clothing';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'all',
    name: 'All Collections',
    tagline: 'Curated Showroom Mix · Suits, Streetwear, Denim & Royal Senators',
    badge: 'Curated Showroom'
  },
  {
    id: 'senators',
    name: 'Nigerian Senators',
    tagline: 'Royal Monarch Heritage · Hand-Embroidered Architectural Tunics',
    badge: 'Royal Heritage'
  },
  {
    id: 'suits',
    name: 'Suits & Tuxedos',
    tagline: 'English Bespoke · Peak Lapel Tuxedos & Savile Row Three-Piece Cuts',
    badge: 'Savile Row'
  },
  {
    id: 'casual',
    name: 'Casual Streetwear',
    tagline: 'High-Fashion Streetwear · Heavyweight French Terry & Tactical Cuts',
    badge: 'Streetwear'
  },
  {
    id: 'denim',
    name: 'Strictly Denim',
    tagline: 'Japanese Selvedge & Vintage Stonewashed Artisanal Denim',
    badge: 'Artisan Denim'
  }
];

export const SIZES: SizeOption[] = [
  { key: 'xs', label: 'xs', scale: 0.86, chest: '36-38"', length: '39"' },
  { key: 's', label: 's', scale: 0.92, chest: '38-40"', length: '40"' },
  { key: 'm', label: 'm', scale: 1.0, chest: '40-42"', length: '41"' },
  { key: 'l', label: 'l', scale: 1.08, chest: '42-44"', length: '42"' },
  { key: 'xl', label: 'xl', scale: 1.16, chest: '44-46"', length: '43"' },
  { key: 'xxl', label: 'xxl', scale: 1.24, chest: '46-48"', length: '44"' }
];

export const ALL_GARMENTS: GarmentDesign[] = [
  // ==========================================
  // SUITS & TUXEDOS
  // ==========================================
  {
    id: 'suit-tuxedo',
    code: '01',
    category: 'suits',
    categoryLabel: 'British Black-Tie',
    title: 'Mayfair Peak-Lapel Tuxedo',
    subtitle: 'English Grosgrain Silk Lapel & Tapered Trousers',
    series: 'Savile Row Ceremonial Line',
    cut: 'Sharp Structured Shoulders · Fitted Waistline',
    lapelOrCollar: 'Satin Grosgrain Peak Lapel',
    fabric: 'Super 180s English Worsted Wool & Mulberry Silk',
    priceNaira: '₦320,000',
    priceRaw: 320000,
    description: 'An immaculate Mayfair black-tie tuxedo tailored from Super 180s worsted wool. Engineered with architectural silk grosgrain peak lapels, silk-covered single button, and matching tailored trousers with side satin braid.',
    leadTime: '7–10 Business Days',
    defaultColorId: 'obsidian',
    colorVariants: [
      {
        id: 'obsidian',
        name: 'Midnight Obsidian',
        hex: '#111317',
        dotColor: '#111317',
        frontImg: '/suits/01_tuxedo_front.png',
        backImg: '/suits/01_tuxedo_back.png',
        modelImg: '/models/suits/tuxedo_model.jpg',
        modelCaption: 'Runway Model · 6\'2" wearing Mayfair Tuxedo in Obsidian (Size M)',
        status: 'Bespoke Order',
        stockSlots: 3,
        filter: 'none'
      },
      {
        id: 'midnight-navy',
        name: 'Royal Midnight Navy',
        hex: '#162238',
        dotColor: '#162238',
        frontImg: '/suits/01_tuxedo_front.png',
        backImg: '/suits/01_tuxedo_back.png',
        modelImg: '/models/suits/savile_model.jpg',
        modelCaption: 'Editorial Model · 6\'1" wearing Mayfair Tuxedo in Midnight Navy (Size L)',
        status: 'Limited Reserve',
        stockSlots: 2,
        filter: 'hue-rotate(210deg) saturate(1.8) brightness(0.9) contrast(1.05)'
      },
      {
        id: 'bordeaux',
        name: 'Velvet Bordeaux',
        hex: '#4a1525',
        dotColor: '#4a1525',
        frontImg: '/suits/01_tuxedo_front.png',
        backImg: '/suits/01_tuxedo_back.png',
        modelImg: '/models/suits/tuxedo_model.jpg',
        modelCaption: 'Gala Edition · 6\'2" wearing Mayfair Tuxedo in Bordeaux Velvet (Size M)',
        status: 'Bespoke Order',
        stockSlots: 4,
        filter: 'hue-rotate(325deg) saturate(2.2) brightness(0.85) contrast(1.15)'
      }
    ]
  },
  {
    id: 'suit-savile',
    code: '02',
    category: 'suits',
    categoryLabel: 'Savile Row Tailoring',
    title: 'Savile Row Double-Breasted Suit',
    subtitle: 'Six-on-Two Horn Button Stance · English Drape Cut',
    series: 'Westminster Chamber Cut',
    cut: 'Contemporary English Drape Cut',
    lapelOrCollar: 'Generous 4-inch Peak Lapel',
    fabric: 'Loro Piana 150s Merino Wool & Cashmere',
    priceNaira: '₦295,000',
    priceRaw: 295000,
    description: 'Classic British power suiting reimagined for the modern gentleman. Features a commanding double-breasted 6x2 button silhouette, roped sleeve heads, ticket pocket welt, and fluid tailored trousers.',
    leadTime: '6–8 Business Days',
    defaultColorId: 'royal-navy',
    colorVariants: [
      {
        id: 'royal-navy',
        name: 'Chamber Navy',
        hex: '#1a2744',
        dotColor: '#1a2744',
        frontImg: '/suits/02_savile_front.png',
        backImg: '/suits/02_savile_back.png',
        modelImg: '/models/suits/savile_model.jpg',
        modelCaption: 'Editorial Model · 6\'1" wearing Westminster Double-Breasted in Navy',
        status: 'Ready to Tailor',
        stockSlots: 5,
        filter: 'none'
      },
      {
        id: 'forest-tweed',
        name: 'Highland Forest Green',
        hex: '#2b3a29',
        dotColor: '#2b3a29',
        frontImg: '/suits/02_savile_front.png',
        backImg: '/suits/02_savile_back.png',
        modelImg: '/models/suits/savile_model.jpg',
        modelCaption: 'Editorial Model · 6\'1" wearing Savile Double-Breasted in Highland Green',
        status: 'Bespoke Order',
        stockSlots: 2,
        filter: 'hue-rotate(85deg) saturate(1.4) brightness(0.88)'
      },
      {
        id: 'charcoal',
        name: 'Bank Charcoal Grey',
        hex: '#2a2b2e',
        dotColor: '#2a2b2e',
        frontImg: '/suits/02_savile_front.png',
        backImg: '/suits/02_savile_back.png',
        modelImg: '/models/suits/savile_model.jpg',
        modelCaption: 'Executive Model · 6\'2" wearing Charcoal Savile Cut',
        status: 'Ready to Tailor',
        stockSlots: 4,
        filter: 'grayscale(1) brightness(0.82) contrast(1.1)'
      }
    ]
  },
  {
    id: 'suit-threepiece',
    code: '03',
    category: 'suits',
    categoryLabel: 'Ascot Aristocracy',
    title: 'Royal Ascot Glen Plaid 3-Piece',
    subtitle: 'Tailored Waistcoat, Notch Jacket & Straight Trousers',
    series: 'Aristocrat Heritage Series',
    cut: 'Three-Piece English Fitted Waistcoat Cut',
    lapelOrCollar: 'Classic Stepped Notch Lapel',
    fabric: 'Dormeuil Glenurquhart Check Worsted Flannel',
    priceNaira: '₦340,000',
    priceRaw: 340000,
    description: 'A distinguished 3-piece British sartorial ensemble featuring an iconic Glen Plaid check jacket, single-breasted five-button matching waistcoat with watch chain pocket, and pleated drape trousers.',
    leadTime: '8–12 Business Days',
    defaultColorId: 'glen-plaid',
    colorVariants: [
      {
        id: 'glen-plaid',
        name: 'Heritage Glen Plaid Grey',
        hex: '#63686d',
        dotColor: '#63686d',
        frontImg: '/suits/03_threepiece_front.png',
        backImg: '/suits/03_threepiece_back.png',
        modelImg: '/models/suits/threepiece_model.jpg',
        modelCaption: 'Editorial Model · 6\'3" wearing Royal Ascot 3-Piece in Glen Plaid',
        status: 'Atelier Signature',
        stockSlots: 2,
        filter: 'none'
      },
      {
        id: 'peaky-camel',
        name: 'Windsor Camel Melange',
        hex: '#8d785e',
        dotColor: '#8d785e',
        frontImg: '/suits/03_threepiece_front.png',
        backImg: '/suits/03_threepiece_back.png',
        modelImg: '/models/suits/threepiece_model.jpg',
        modelCaption: 'Ascot Model · 6\'3" wearing 3-Piece Suit in Windsor Camel',
        status: 'Bespoke Reserve',
        stockSlots: 3,
        filter: 'sepia(0.6) hue-rotate(345deg) saturate(1.35) brightness(0.95)'
      },
      {
        id: 'midnight-tweed',
        name: 'Midnight Navy Tweed',
        hex: '#1e283b',
        dotColor: '#1e283b',
        frontImg: '/suits/03_threepiece_front.png',
        backImg: '/suits/03_threepiece_back.png',
        modelImg: '/models/suits/threepiece_model.jpg',
        modelCaption: 'Ascot Model · 6\'3" wearing 3-Piece Suit in Midnight Tweed',
        status: 'Limited Edition',
        stockSlots: 2,
        filter: 'hue-rotate(200deg) saturate(1.5) brightness(0.82)'
      }
    ]
  },

  // ==========================================
  // CASUAL STREETWEAR
  // ==========================================
  {
    id: 'casual-hoodie',
    code: '04',
    category: 'casual',
    categoryLabel: 'Luxury Streetwear',
    title: 'Atelier Heavyweight Boxy Hoodie Set',
    subtitle: '500 GSM Loopback French Terry & Relaxed Sweatpants',
    series: 'Metropolitan Streetwear Cut',
    cut: 'Boxy Drop-Shoulder Oversized Silhouette',
    lapelOrCollar: 'Double-Layered Structured Hood',
    fabric: 'Custom Milled 500 GSM Organic Combed Cotton French Terry',
    priceNaira: '₦125,000',
    priceRaw: 125000,
    description: 'Premium heavyweight streetwear hoodie and sweatpants duo. Crafted with oversized drop shoulders, kangaroo pocket, thick ribbed hems, and custom garment-dyed wash for a lived-in vintage feel.',
    leadTime: '3–5 Business Days',
    defaultColorId: 'washed-charcoal',
    colorVariants: [
      {
        id: 'washed-charcoal',
        name: 'Washed Charcoal Black',
        hex: '#37383a',
        dotColor: '#37383a',
        frontImg: '/casual/01_hoodie_front.png',
        backImg: '/casual/01_hoodie_back.png',
        modelImg: '/models/casual/hoodie_model.jpg',
        modelCaption: 'Streetwear Model · 6\'0" wearing Atelier Heavyweight Set in Charcoal (Size L)',
        status: 'In Stock · Ready to Ship',
        stockSlots: 8,
        filter: 'none'
      },
      {
        id: 'slate-olive',
        name: 'Tactical Slate Olive',
        hex: '#47533b',
        dotColor: '#47533b',
        frontImg: '/casual/01_hoodie_front.png',
        backImg: '/casual/01_hoodie_back.png',
        modelImg: '/models/casual/hoodie_model.jpg',
        modelCaption: 'Streetwear Model · 5\'11" wearing Tactical Olive Hoodie Set (Size M)',
        status: 'In Stock · Ready to Ship',
        stockSlots: 6,
        filter: 'sepia(0.45) hue-rotate(65deg) saturate(1.4) brightness(0.88)'
      },
      {
        id: 'sandstone',
        name: 'Sahara Sand Dune',
        hex: '#968875',
        dotColor: '#968875',
        frontImg: '/casual/01_hoodie_front.png',
        backImg: '/casual/01_hoodie_back.png',
        modelImg: '/models/casual/hoodie_model.jpg',
        modelCaption: 'Streetwear Model · 6\'0" wearing Sahara Sand Dune Heavyweight (Size L)',
        status: 'Limited Edition',
        stockSlots: 4,
        filter: 'sepia(0.55) hue-rotate(350deg) saturate(1.25) brightness(1.1)'
      }
    ]
  },
  {
    id: 'casual-cargo',
    code: '05',
    category: 'casual',
    categoryLabel: 'Tactical Utility',
    title: 'Tactical Utility Cargo Shacket',
    subtitle: 'Quad Gusset Pockets & Heavy Ripstop Cotton',
    series: 'Urban Utility Series',
    cut: 'Relaxed Overshirt & Pleated Cargo Trouser Cut',
    lapelOrCollar: 'Camp Collar with Concealed Fasteners',
    fabric: 'Military-Grade Washed Cotton Ripstop',
    priceNaira: '₦138,000',
    priceRaw: 138000,
    description: 'Engineered utility streetwear overshirt featuring four bellow cargo pockets with hidden snap closures, reinforced elbow panels, and structured boxy tailoring.',
    leadTime: '3–5 Business Days',
    defaultColorId: 'military-olive',
    colorVariants: [
      {
        id: 'military-olive',
        name: 'Army Combat Olive',
        hex: '#48523a',
        dotColor: '#48523a',
        frontImg: '/casual/02_cargo_front.png',
        backImg: '/casual/02_cargo_back.png',
        modelImg: '/models/casual/cargo_model.jpg',
        modelCaption: 'Editorial Model · 5\'11" wearing Cargo Shacket in Combat Olive (Size M)',
        status: 'In Stock · Fast Dispatch',
        stockSlots: 7,
        filter: 'none'
      },
      {
        id: 'stealth-black',
        name: 'Stealth Raven Black',
        hex: '#232528',
        dotColor: '#232528',
        frontImg: '/casual/02_cargo_front.png',
        backImg: '/casual/02_cargo_back.png',
        modelImg: '/models/casual/cargo_model.jpg',
        modelCaption: 'Editorial Model · 6\'0" wearing Stealth Black Utility Fit (Size L)',
        status: 'In Stock',
        stockSlots: 5,
        filter: 'grayscale(1) brightness(0.48) contrast(1.2)'
      },
      {
        id: 'desert-tan',
        name: 'Desert Nomad Tan',
        hex: '#96856b',
        dotColor: '#96856b',
        frontImg: '/casual/02_cargo_front.png',
        backImg: '/casual/02_cargo_back.png',
        modelImg: '/models/casual/cargo_model.jpg',
        modelCaption: 'Editorial Model · 5\'11" wearing Desert Nomad Utility Shacket',
        status: 'Limited Edition',
        stockSlots: 3,
        filter: 'sepia(0.55) hue-rotate(350deg) saturate(1.2) brightness(1.05)'
      }
    ]
  },

  // ==========================================
  // STRICTLY DENIM
  // ==========================================
  {
    id: 'denim-selvedge',
    code: '06',
    category: 'denim',
    categoryLabel: 'Kojima Raw Denim',
    title: 'Raw Japanese Selvedge Trucker',
    subtitle: '14oz Red-Line Shuttle-Loomed Denim & Selvedge Jeans',
    series: 'Kojima Artisan Selvedge',
    cut: 'Type-II Heritage Trucker Cut & Straight Leg Trouser',
    lapelOrCollar: 'Pointed Western Collar with Copper Rivets',
    fabric: '14oz Kurabo Mills Raw Unsanforized Indigo Denim',
    priceNaira: '₦175,000',
    priceRaw: 175000,
    description: 'Handcrafted on vintage shuttle looms in Kojima, Japan. Features red-line selvedge ID on the inner placket, custom antiqued brass doughnut buttons, pleated front chest box seams, and raw crisp indigo that fades with wear.',
    leadTime: '4–6 Business Days',
    defaultColorId: 'deep-indigo',
    colorVariants: [
      {
        id: 'deep-indigo',
        name: 'Deep Raw Indigo (14oz)',
        hex: '#1a273e',
        dotColor: '#1a273e',
        frontImg: '/denim/01_selvedge_front.png',
        backImg: '/denim/01_selvedge_back.png',
        modelImg: '/models/denim/selvedge_model.jpg',
        modelCaption: 'Workwear Model · 6\'1" wearing Japanese Selvedge Trucker in Deep Indigo',
        status: 'Artisan Batch · 5 Cuts',
        stockSlots: 5,
        filter: 'none'
      },
      {
        id: 'kuro-black',
        name: 'Kuro Raw Black Selvedge',
        hex: '#1f2024',
        dotColor: '#1f2024',
        frontImg: '/denim/01_selvedge_front.png',
        backImg: '/denim/01_selvedge_back.png',
        modelImg: '/models/denim/selvedge_model.jpg',
        modelCaption: 'Workwear Model · 6\'1" wearing Kuro Black Selvedge Set',
        status: 'Limited Batch',
        stockSlots: 3,
        filter: 'grayscale(1) brightness(0.42) contrast(1.25)'
      },
      {
        id: 'washed-mid-blue',
        name: 'Mid-Washed Indigo',
        hex: '#3a5375',
        dotColor: '#3a5375',
        frontImg: '/denim/01_selvedge_front.png',
        backImg: '/denim/01_selvedge_back.png',
        modelImg: '/models/denim/selvedge_model.jpg',
        modelCaption: 'Workwear Model · 6\'1" wearing Mid-Washed Japanese Selvedge',
        status: 'Artisan Batch',
        stockSlots: 4,
        filter: 'hue-rotate(350deg) saturate(1.2) brightness(1.22) contrast(0.95)'
      }
    ]
  },
  {
    id: 'denim-vintage',
    code: '07',
    category: 'denim',
    categoryLabel: 'Artisanal Vintage Denim',
    title: '90s Vintage Stonewash Denim Set',
    subtitle: 'Hand-Distressed Washed Denim Jacket & Relaxed Jeans',
    series: 'Retro Californian Wash',
    cut: 'Relaxed 90s Boxy Jacket Cut',
    lapelOrCollar: 'Classic Denim Trucker Collar',
    fabric: '12.5oz Washed Ring-Spun American Cotton',
    priceNaira: '₦160,000',
    priceRaw: 160000,
    description: 'Iconic 1990s relaxed stonewashed trucker jacket. Finished with artisanal hand-sanded whiskering, honeycombs, tobacco contrast double-needle topstitching, and branded nickel hardware.',
    leadTime: '3–5 Business Days',
    defaultColorId: 'stonewash-blue',
    colorVariants: [
      {
        id: 'stonewash-blue',
        name: '90s Light Stonewash Blue',
        hex: '#6f8ba6',
        dotColor: '#6f8ba6',
        frontImg: '/denim/02_vintage_front.png',
        backImg: '/denim/02_vintage_back.png',
        modelImg: '/models/denim/vintage_model.jpg',
        modelCaption: 'Vintage Model · 6\'2" wearing 90s Stonewash Jacket & Jeans (Size M)',
        status: 'In Stock · Ready to Ship',
        stockSlots: 6,
        filter: 'none'
      },
      {
        id: 'raw-overdye',
        name: 'Deep Tinted Overdye',
        hex: '#233246',
        dotColor: '#233246',
        frontImg: '/denim/02_vintage_front.png',
        backImg: '/denim/02_vintage_back.png',
        modelImg: '/models/denim/vintage_model.jpg',
        modelCaption: 'Vintage Model · 6\'2" wearing Deep Tinted Indigo (Size M)',
        status: 'In Stock',
        stockSlots: 4,
        filter: 'hue-rotate(20deg) saturate(1.6) brightness(0.62) contrast(1.2)'
      },
      {
        id: 'bleached-ice',
        name: 'Bleached Ice Wash',
        hex: '#a6c0d8',
        dotColor: '#a6c0d8',
        frontImg: '/denim/02_vintage_front.png',
        backImg: '/denim/02_vintage_back.png',
        modelImg: '/models/denim/vintage_model.jpg',
        modelCaption: 'Vintage Model · 6\'2" wearing Bleached Ice Wash Denim (Size M)',
        status: 'Limited Summer Batch',
        stockSlots: 3,
        filter: 'brightness(1.25) saturate(0.85) contrast(0.95)'
      }
    ]
  },

  // ==========================================
  // NIGERIAN ROYAL SENATORS
  // ==========================================
  {
    id: 'senator-01',
    code: '08',
    category: 'senators',
    categoryLabel: 'Sahelian Monarch',
    title: 'Kano Terracotta Senator',
    subtitle: 'Antique Bronze Chevron Embroidery & Mandarin Placket',
    series: 'Sahelian Monarch Series',
    cut: 'Contemporary Longline Tunic',
    lapelOrCollar: 'Architectural Mandarin Collar',
    fabric: 'Super 160s Italian Polished Wool & Cashmere',
    priceNaira: '₦165,000',
    priceRaw: 165000,
    description: 'A regal sienna silhouette cut from luxury Italian polished wool, adorned with intricate geometric chevron embroidery along the mandarin placket and cuffs.',
    leadTime: '5–7 Business Days',
    defaultColorId: 'sienna',
    colorVariants: [
      {
        id: 'sienna',
        name: 'Terracotta Sienna',
        hex: '#532918',
        dotColor: '#532918',
        frontImg: '/senators/01_terracotta_front.png',
        backImg: '/senators/01_terracotta_back.png',
        modelImg: '/models/senators/01_model.jpg',
        modelCaption: 'Monarch Model · 6\'2" wearing Kano Terracotta Senator (Size L)',
        status: 'Ready to Tailor',
        stockSlots: 4
      },
      {
        id: 'ivory',
        name: 'Pristine Royal Ivory',
        hex: '#eae6dd',
        dotColor: '#eae6dd',
        frontImg: '/senators/07_ivory_front.png',
        backImg: '/senators/07_ivory_back.png',
        modelImg: '/models/senators/07_model.jpg',
        modelCaption: 'Monarch Model · 6\'2" wearing Royal Ivory Cut',
        status: 'Bespoke Order',
        stockSlots: 3
      }
    ]
  },
  {
    id: 'senator-02',
    code: '09',
    category: 'senators',
    categoryLabel: 'Savannah Gold',
    title: 'Sahelian Ochre Senator',
    subtitle: 'Narrow Tribal Diamond Weave & Pocket Welt Trim',
    series: 'Savannah Gold Series',
    cut: 'Contemporary Longline Silhouette',
    lapelOrCollar: 'Clean Round Neckline',
    fabric: 'Egyptian Giza Polished Cotton Blend',
    priceNaira: '₦170,000',
    priceRaw: 170000,
    description: 'Warm mustard ochre tailored tunic featuring narrow geometric tribal diamond and chevron threadwork along the center placket and pocket welt.',
    leadTime: '4–6 Business Days',
    defaultColorId: 'ochre',
    colorVariants: [
      {
        id: 'ochre',
        name: 'Savannah Ochre Gold',
        hex: '#c59b27',
        dotColor: '#c59b27',
        frontImg: '/senators/02_ochre_front.png',
        backImg: '/senators/02_ochre_back.png',
        modelImg: '/models/senators/02_model.jpg',
        modelCaption: 'Heritage Model · 6\'1" wearing Savannah Ochre Senator (Size M)',
        status: 'Ready to Tailor',
        stockSlots: 3
      },
      {
        id: 'emerald',
        name: 'Caliphate Emerald Green',
        hex: '#1d4a32',
        dotColor: '#1d4a32',
        frontImg: '/senators/02_emerald_front.png',
        backImg: '/senators/02_emerald_back.png',
        modelImg: '/models/senators/02_model.jpg',
        modelCaption: 'Heritage Model · 6\'1" wearing Emerald Green Variant',
        status: 'Limited Edition',
        stockSlots: 2
      }
    ]
  },
  {
    id: 'senator-03',
    code: '10',
    category: 'senators',
    categoryLabel: 'Aristocrat Cut',
    title: 'Lavender Sovereign Senator',
    subtitle: 'Silver Metallic Drops & Asymmetrical Cord Accents',
    series: 'Aristocrat Modern Cut',
    cut: 'Modern Longline Drop',
    lapelOrCollar: 'Clean Minimalist Round Collar',
    fabric: 'Loro Piana Lightweight Tropical Wool',
    priceNaira: '₦185,000',
    priceRaw: 185000,
    description: 'Contemporary pastel lilac longline tunic accented by bespoke silver vertical cording drops and delicate tassel embroidery on the chest.',
    leadTime: '5–7 Business Days',
    defaultColorId: 'lavender',
    colorVariants: [
      {
        id: 'lavender',
        name: 'Pastel Lavender',
        hex: '#b8a9c9',
        dotColor: '#b8a9c9',
        frontImg: '/senators/03_lavender_front.png',
        backImg: '/senators/03_lavender_back.png',
        modelImg: '/models/senators/03_model.jpg',
        modelCaption: 'Aristocrat Model · 6\'2" wearing Sovereign Lavender (Size M)',
        status: 'Atelier Signature',
        stockSlots: 3
      },
      {
        id: 'burgundy',
        name: 'Deep Imperial Burgundy',
        hex: '#6b1d2f',
        dotColor: '#6b1d2f',
        frontImg: '/senators/03_burgundy_front.png',
        backImg: '/senators/03_burgundy_back.png',
        modelImg: '/models/senators/05_model.jpg',
        modelCaption: 'Aristocrat Model · 6\'2" wearing Imperial Burgundy Variant',
        status: 'Ready to Tailor',
        stockSlots: 4
      }
    ]
  },
  {
    id: 'senator-04',
    code: '11',
    category: 'senators',
    categoryLabel: 'Executive Chamber',
    title: 'Obsidian Origami Senator',
    subtitle: 'Central Box Pleat with Burnished Metal Button Studs',
    series: 'Executive Chamber Cut',
    cut: 'Architectural Mid-Sleeve Drop',
    lapelOrCollar: 'Concealed Fastening Band Collar',
    fabric: 'Dormeuil Cashmere Wool Drape',
    priceNaira: '₦195,000',
    priceRaw: 195000,
    description: 'Architectural obsidian black tunic engineered with central box fold and geometric diagonal pin-tucks secured by burnished metal button studs.',
    leadTime: '7–10 Business Days',
    defaultColorId: 'obsidian',
    colorVariants: [
      {
        id: 'obsidian',
        name: 'Charcoal Obsidian',
        hex: '#1f2024',
        dotColor: '#1f2024',
        frontImg: '/senators/04_obsidian_front.png',
        backImg: '/senators/04_obsidian_back.png',
        modelImg: '/models/senators/04_model.jpg',
        modelCaption: 'Chamber Model · 6\'3" wearing Obsidian Origami Senator (Size L)',
        status: 'Bespoke Commission',
        stockSlots: 2
      },
      {
        id: 'onyx-black',
        name: 'Deep Midnight Onyx',
        hex: '#111215',
        dotColor: '#111215',
        frontImg: '/senators/04_onyx_front.png',
        backImg: '/senators/04_onyx_back.png',
        modelImg: '/models/senators/04_model.jpg',
        modelCaption: 'Chamber Model · 6\'3" wearing Midnight Onyx Cut',
        status: 'Bespoke Order',
        stockSlots: 3
      }
    ]
  },
  {
    id: 'senator-05',
    code: '12',
    category: 'senators',
    categoryLabel: 'Monarch Heritage',
    title: 'Zaria Crimson Monarch',
    subtitle: 'Mother-of-Pearl Fasteners & Deep Side Pockets',
    series: 'Monarch Heritage Cut',
    cut: 'Royal Classic Tunic with Deep Pockets',
    lapelOrCollar: 'Standing Band Collar',
    fabric: 'Pure Merino Cashmere Suiting',
    priceNaira: '₦180,000',
    priceRaw: 180000,
    description: 'Distinguished deep burgundy crimson tunic with elbow-length sleeves, mother-of-pearl buttons, and tailored deep patch pockets.',
    leadTime: '5–7 Business Days',
    defaultColorId: 'burgundy',
    colorVariants: [
      {
        id: 'burgundy',
        name: 'Regal Burgundy Wine',
        hex: '#6b1d2f',
        dotColor: '#6b1d2f',
        frontImg: '/senators/05_burgundy_front.png',
        backImg: '/senators/05_burgundy_back.png',
        modelImg: '/models/senators/05_model.jpg',
        modelCaption: 'Heritage Model · 6\'2" wearing Zaria Crimson Monarch (Size L)',
        status: 'In High Demand',
        stockSlots: 2
      },
      {
        id: 'sapphire',
        name: 'Royal Sapphire Blue',
        hex: '#1e3863',
        dotColor: '#1e3863',
        frontImg: '/senators/05_sapphire_front.png',
        backImg: '/senators/05_sapphire_back.png',
        modelImg: '/models/senators/06_model.jpg',
        modelCaption: 'Heritage Model · 6\'2" wearing Sapphire Blue Monarch',
        status: 'Ready to Tailor',
        stockSlots: 3
      }
    ]
  },
  {
    id: 'senator-06',
    code: '13',
    category: 'senators',
    categoryLabel: 'Federal Chamber',
    title: 'Abuja Sunburst Senator',
    subtitle: 'Circular Sunburst Medallion & Bronze Trim',
    series: 'Federal Chamber Series',
    cut: 'Senate Floor Traditional Tailoring',
    lapelOrCollar: 'Structured Band Collar with Button Tab',
    fabric: 'English Worsted Cashmere Drape',
    priceNaira: '₦175,000',
    priceRaw: 175000,
    description: 'Deep midnight navy blue tunic finished with bronze geometric placket embroidery and an ornate circular sunburst medallion on the breast pocket.',
    leadTime: '4–6 Business Days',
    defaultColorId: 'midnight-navy',
    colorVariants: [
      {
        id: 'midnight-navy',
        name: 'Midnight Navy Sunburst',
        hex: '#162238',
        dotColor: '#162238',
        frontImg: '/senators/06_navy_sunburst_front.png',
        backImg: '/senators/06_navy_sunburst_back.png',
        modelImg: '/models/senators/06_model.jpg',
        modelCaption: 'Senate Model · 6\'2" wearing Abuja Sunburst Senator (Size M)',
        status: 'Pre-order Open',
        stockSlots: 5
      },
      {
        id: 'camel',
        name: 'Royal Camel Tan',
        hex: '#a3845c',
        dotColor: '#a3845c',
        frontImg: '/senators/06_camel_front.png',
        backImg: '/senators/06_camel_back.png',
        modelImg: '/models/senators/06_model.jpg',
        modelCaption: 'Senate Model · 6\'2" wearing Camel Tan Sunburst',
        status: 'Ready to Tailor',
        stockSlots: 4
      }
    ]
  },
  {
    id: 'senator-07',
    code: '14',
    category: 'senators',
    categoryLabel: 'Grand Vizier',
    title: 'Calabar Pearl Statesman',
    subtitle: 'Pristine Ivory Cream with Dotted Topstitch Pockets',
    series: 'Grand Vizier Series',
    cut: 'Bespoke Statesman Elbow-Sleeve Tunic',
    lapelOrCollar: 'Mandarin Collar with Split Button Tab',
    fabric: 'Egyptian Super-Fine Cotton & Silk',
    priceNaira: '₦190,000',
    priceRaw: 190000,
    description: 'Impeccable royal off-white ivory cream Senator with split mandarin collar and dual rounded patch pockets bordered by delicate dotted topstitching.',
    leadTime: '6–8 Business Days',
    defaultColorId: 'pristine-ivory',
    colorVariants: [
      {
        id: 'pristine-ivory',
        name: 'Pristine Ivory Cream',
        hex: '#ebe7dd',
        dotColor: '#ebe7dd',
        frontImg: '/senators/07_ivory_front.png',
        backImg: '/senators/07_ivory_back.png',
        modelImg: '/models/senators/07_model.jpg',
        modelCaption: 'Statesman Model · 6\'2" wearing Calabar Pearl Statesman (Size L)',
        status: 'Hand-Tailored Reserve',
        stockSlots: 2
      },
      {
        id: 'amethyst',
        name: 'Noble Royal Amethyst',
        hex: '#5c3866',
        dotColor: '#5c3866',
        frontImg: '/senators/07_amethyst_front.png',
        backImg: '/senators/07_amethyst_back.png',
        modelImg: '/models/senators/07_model.jpg',
        modelCaption: 'Statesman Model · 6\'2" wearing Noble Amethyst',
        status: 'Limited Reserve',
        stockSlots: 3
      }
    ]
  },
  {
    id: 'senator-08',
    code: '15',
    category: 'senators',
    categoryLabel: 'Executive Cut',
    title: 'Savannah Olive Executive',
    subtitle: 'Polished 24K Gold Bar Insignia Plaque',
    series: 'Executive Chamber Cut',
    cut: 'Executive Three-Quarter Sleeve Drop',
    lapelOrCollar: 'Clean Round Mandarin Collar',
    fabric: 'Italian Polished Gabardine Wool',
    priceNaira: '₦175,000',
    priceRaw: 175000,
    description: 'Executive minimalist olive green longline tunic featuring concealed fastening and a polished 24k gold-plated horizontal bar insignia.',
    leadTime: '4–5 Business Days',
    defaultColorId: 'olive-green',
    colorVariants: [
      {
        id: 'olive-green',
        name: 'Savannah Olive Green',
        hex: '#4b5320',
        dotColor: '#4b5320',
        frontImg: '/senators/08_olive_front.png',
        backImg: '/senators/08_olive_back.png',
        modelImg: '/models/senators/08_model.jpg',
        modelCaption: 'Executive Model · 6\'1" wearing Savannah Olive Executive (Size M)',
        status: 'Atelier Exclusive',
        stockSlots: 5,
        filter: 'none'
      },
      {
        id: 'midnight-noir',
        name: 'Midnight Onyx Noir',
        hex: '#1b1d1f',
        dotColor: '#1b1d1f',
        frontImg: '/senators/08_olive_front.png',
        backImg: '/senators/08_olive_back.png',
        modelImg: '/models/senators/08_model.jpg',
        modelCaption: 'Executive Model · 6\'1" wearing Midnight Noir Executive Cut',
        status: 'Ready to Tailor',
        stockSlots: 3,
        filter: 'grayscale(1) brightness(0.42) contrast(1.2)'
      }
    ]
  },
  {
    id: 'senator-09',
    code: '16',
    category: 'senators',
    categoryLabel: 'Savannah Noble',
    title: 'Benue Sage Accordion',
    subtitle: 'Five Sharp Architectural Vertical Accordion Pleats',
    series: 'Savannah Noble Series',
    cut: 'Contemporary Short-Sleeve Tunic',
    lapelOrCollar: 'Round Neck with Keyhole Slit',
    fabric: 'Fine Tropical Wool & Linen Drape',
    priceNaira: '₦170,000',
    priceRaw: 170000,
    description: 'Distinctive dusty sage green Senator tunic cut with crisp short sleeves, keyhole neck slit, and five sharp architectural vertical accordion pleats down the right chest.',
    leadTime: '4–6 Business Days',
    defaultColorId: 'sage-green',
    colorVariants: [
      {
        id: 'sage-green',
        name: 'Benue Dusty Sage Green',
        hex: '#7a8d79',
        dotColor: '#7a8d79',
        frontImg: '/senators/09_sage_front.png',
        backImg: '/senators/09_sage_back.png',
        modelImg: '/models/senators/09_model.jpg',
        modelCaption: 'Noble Model · 6\'1" wearing Benue Sage Accordion (Size M)',
        status: 'Atelier Exclusive',
        stockSlots: 3,
        filter: 'none'
      },
      {
        id: 'terracotta-earth',
        name: 'Terracotta Earth',
        hex: '#6d3c26',
        dotColor: '#6d3c26',
        frontImg: '/senators/09_sage_front.png',
        backImg: '/senators/09_sage_back.png',
        modelImg: '/models/senators/09_model.jpg',
        modelCaption: 'Noble Model · 6\'1" wearing Terracotta Earth Accordion',
        status: 'Bespoke Order',
        stockSlots: 2,
        filter: 'sepia(0.6) hue-rotate(330deg) saturate(1.6) brightness(0.88)'
      }
    ]
  }
];

export function getGarmentsByCategory(categoryId: string): GarmentDesign[] {
  if (categoryId === 'all') {
    // Showroom Mix: curated selection featuring key pieces from every collection
    const selectedIds = [
      'suit-tuxedo',
      'casual-hoodie',
      'denim-selvedge',
      'senator-01',
      'suit-savile',
      'casual-cargo',
      'denim-vintage',
      'senator-07',
      'suit-threepiece'
    ];
    return selectedIds
      .map(id => ALL_GARMENTS.find(g => g.id === id))
      .filter((g): g is GarmentDesign => Boolean(g));
  }
  return ALL_GARMENTS.filter(g => g.category === categoryId);
}
