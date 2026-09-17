// Predefined SVG Data-URI Product Image Catalog
// Enables automatic fallbacks for Coca-Cola, Pepsi, Milk, Rice, Laptop, Keyboard, Mouse, Mobile Phone, Notebook, Pen, Headphones.

const createSvgDataUrl = (bgGradient, text, iconSvg) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bgGradient[0]}" />
        <stop offset="100%" stop-color="${bgGradient[1]}" />
      </linearGradient>
    </defs>
    <rect width="300" height="300" rx="20" fill="url(#grad)" />
    <g fill="none" stroke="#ffffff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" transform="translate(110, 80) scale(3.3)">
      ${iconSvg}
    </g>
    <text x="150" y="240" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="700" fill="#ffffff" text-anchor="middle">${text}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const catalogImages = {
  'coca-cola': createSvgDataUrl(['#dc2626', '#991b1b'], 'Coca-Cola', '<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>'),
  'pepsi': createSvgDataUrl(['#1d4ed8', '#1e3a8a'], 'Pepsi Drink', '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/>'),
  'laptop': createSvgDataUrl(['#2563eb', '#1e40af'], 'Laptop', '<rect width="20" height="14" x="2" y="3" rx="2"/><path d="M2 20h20"/>'),
  'keyboard': createSvgDataUrl(['#475569', '#1e293b'], 'Keyboard', '<rect width="20" height="12" x="2" y="4" rx="2"/><path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h8"/>'),
  'mouse': createSvgDataUrl(['#64748b', '#334155'], 'Optical Mouse', '<rect width="12" height="18" x="6" y="3" rx="6"/><path d="M12 3v6"/>'),
  'mobile-phone': createSvgDataUrl(['#0ea5e9', '#0369a1'], 'Mobile Phone', '<rect width="12" height="20" x="6" y="2" rx="2"/><line x1="12" x2="12" y1="18" y2="18.01"/>'),
  'notebook': createSvgDataUrl(['#d97706', '#92400e'], 'Spiral Notebook', '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>'),
  'pen': createSvgDataUrl(['#059669', '#047857'], 'Gel Pen', '<path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18z"/>'),
  'headphones': createSvgDataUrl(['#7c3aed', '#5b21b6'], 'Headphones', '<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H4a1 1 0 0 1-1-1v-6a9 9 0 0 1 18 0v6a1 1 0 0 1-1 1h-2a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>'),
  'milk': createSvgDataUrl(['#0284c7', '#0369a1'], 'Fresh Milk', '<path d="M8 2h8v4H8zM6 6h12v16H6z"/><path d="M6 12h12"/>'),
  'rice': createSvgDataUrl(['#d97706', '#b45309'], 'Basmati Rice', '<path d="M6 3h12l2 18H4L6 3z"/><circle cx="12" cy="12" r="3"/>'),
  'beverages': createSvgDataUrl(['#ea580c', '#c2410c'], 'Beverage', '<path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/>'),
  'electronics': createSvgDataUrl(['#7c3aed', '#6d28d9'], 'Electronics', '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/>'),
  'grocery': createSvgDataUrl(['#059669', '#047857'], 'Grocery', '<path d="m5 11 4-7"/><path d="m19 11-4-7"/><path d="M2 11h20l-2 9H4z"/>'),
  'default': createSvgDataUrl(['#4b5563', '#374151'], 'Retail Product', '<path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>')
};

export const getDefaultImageForProduct = (name = '', category = '') => {
  const lowerName = name.toLowerCase();
  const lowerCat = category.toLowerCase();

  if (lowerName.includes('coca') || lowerName.includes('coke')) return catalogImages['coca-cola'];
  if (lowerName.includes('pepsi')) return catalogImages['pepsi'];
  if (lowerName.includes('laptop') || lowerName.includes('macbook') || lowerName.includes('notebook pc')) return catalogImages['laptop'];
  if (lowerName.includes('keyboard')) return catalogImages['keyboard'];
  if (lowerName.includes('mouse')) return catalogImages['mouse'];
  if (lowerName.includes('mobile') || lowerName.includes('phone') || lowerName.includes('iphone') || lowerName.includes('samsung')) return catalogImages['mobile-phone'];
  if (lowerName.includes('notebook') || lowerName.includes('book') || lowerName.includes('diary')) return catalogImages['notebook'];
  if (lowerName.includes('pen') || lowerName.includes('pencil') || lowerName.includes('marker')) return catalogImages['pen'];
  if (lowerName.includes('headphone') || lowerName.includes('headset') || lowerName.includes('earphone') || lowerName.includes('airpods')) return catalogImages['headphones'];
  if (lowerName.includes('milk') || lowerName.includes('curd') || lowerName.includes('butter')) return catalogImages['milk'];
  if (lowerName.includes('rice') || lowerName.includes('wheat') || lowerName.includes('grain')) return catalogImages['rice'];

  if (lowerCat.includes('beverage') || lowerCat.includes('drink')) return catalogImages['beverages'];
  if (lowerCat.includes('electronic') || lowerCat.includes('gadget')) return catalogImages['electronics'];
  if (lowerCat.includes('grocery') || lowerCat.includes('food')) return catalogImages['grocery'];

  return catalogImages['default'];
};
