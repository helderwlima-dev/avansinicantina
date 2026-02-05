// constants.ts

export const PRODUCTS = {
  SALGADO_GRANDE: { name: 'Salgado grande', price: 10 },
  SALGADO_PEQUENO: { name: 'Salgado pequeno', price: 6 },
  BOLO_POTE: { name: 'Bolo de pote', price: 12 },
};

export const PRODUCT_ALIASES: { [key: string]: keyof typeof PRODUCTS } = {
  'salgado gde': 'SALGADO_GRANDE',
  'salgado grande': 'SALGADO_GRANDE',
  'salgado pq': 'SALGADO_PEQUENO',
  'salgado pequeno': 'SALGADO_PEQUENO',
  'bolo': 'BOLO_POTE',
  'bolo de pote': 'BOLO_POTE',
};
