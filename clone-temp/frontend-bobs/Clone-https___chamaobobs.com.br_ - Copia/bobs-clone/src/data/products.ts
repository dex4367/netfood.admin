export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  ingredients?: string[];
  extras?: Extra[];
  sides?: Side[];
  sauces?: Sauce[];
  addons?: Addon[];
}

export interface Extra {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
}

export interface Side {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface Sauce {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface Addon {
  id: string;
  name: string;
  price: number;
}

// Mock data - substitua por dados reais do seu backend
export const products: Product[] = [
  {
    id: '1',
    name: 'Big Bob',
    description: "O grande clássico que só tem no Bob's. São dois hambúrgueres bovinos, queijo, alface e cebola fresquinhos e molho Big Bob Original, num pão quentinho com gergelim.",
    price: 18.99,
    image: 'https://storage.shopfood.io/public/companies/poe726g0/products/medium/202204061741_3282_i.jpg',
    category: 'Hambúrgueres',
    extras: [
      { id: '1', name: 'Hambúrguer Bovino 45g', price: 6.50, image: '/images/extras/hamburger.png' },
      { id: '2', name: 'Queijo', price: 2.50, image: '/images/extras/cheese.png' },
      { id: '3', name: 'Bacon', price: 4.00, image: '/images/extras/bacon.png' },
    ],
    sides: [
      { id: '1', name: 'Batata Palito Média', description: 'Batata palito crocante e sequinha.', price: 3.00, image: '/images/sides/fries-medium.png' },
      { id: '2', name: 'Batata Palito Grande', description: 'Batata palito crocante e sequinha.', price: 4.00, image: '/images/sides/fries-large.png' },
      { id: '3', name: 'Batata Palito Mega', description: 'Batata palito crocante e sequinha.', price: 9.00, image: '/images/sides/fries-mega.png' },
      { id: '4', name: 'Franlitos 6 unidades', description: 'Tirinhas de frango empanado e crocantes', price: 8.00, image: '/images/sides/franlitos-6.png' },
      { id: '5', name: 'Franlitos 12 unidades', description: 'Tirinhas de frango empanado e crocantes', price: 21.00, image: '/images/sides/franlitos-12.png' },
    ],
    sauces: [
      { id: '1', name: 'Molho Cheddar', description: 'Aproximadamente 20g.', price: 4.00, image: '/images/sauces/cheddar.png' },
      { id: '2', name: 'Molho Big Bob', description: 'Aproximadamente 20g.', price: 4.00, image: '/images/sauces/big-bob.png' },
      { id: '3', name: 'Maionese', description: 'Aproximadamente 20g.', price: 2.50, image: '/images/sauces/mayo.png' },
      { id: '4', name: 'Molho Big Bob 200g', description: 'Ele é único e exclusivo! Aprecie o verdadeiro Molho Big Bob e deixe seu sanduíche ainda mais saboroso.', price: 21.90, image: '/images/sauces/big-bob-200g.png' },
      { id: '5', name: 'Molho Bob\'s Burger & Salad', description: 'Ele é único e exclusivo! Receita autêntica criada em nossa cozinha.', price: 21.90, image: '/images/sauces/burger-salad.png' },
    ],
    addons: [
      { id: '1', name: 'Guardanapo', price: 0 },
      { id: '2', name: 'Canudo', price: 0 },
    ]
  },
  {
    id: '2',
    name: '3 Sanduíches por 49,90',
    description: "O combo é composto por 3 sanduíches clássicos à sua escolha. Escolha entre os seus lanches preferidos: Big Bob, Cheddar Australiano ou Double Cheese.",
    price: 49.90,
    image: 'https://storage.shopfood.io/public/companies/poe726g0/products/medium/6503b26e409f4c8331d2caeeba844a5a.png',
    category: 'Promoções',
    extras: [
      { id: '1', name: 'Hambúrguer Bovino 45g', price: 6.50, image: '/images/extras/hamburger.png' },
      { id: '2', name: 'Queijo', price: 2.50, image: '/images/extras/cheese.png' },
      { id: '3', name: 'Bacon', price: 4.00, image: '/images/extras/bacon.png' },
    ],
    sides: [
      { id: '1', name: 'Batata Palito Média', description: 'Batata palito crocante e sequinha.', price: 3.00, image: '/images/sides/fries-medium.png' },
      { id: '2', name: 'Batata Palito Grande', description: 'Batata palito crocante e sequinha.', price: 4.00, image: '/images/sides/fries-large.png' },
    ],
    sauces: [
      { id: '1', name: 'Molho Cheddar', description: 'Aproximadamente 20g.', price: 4.00, image: '/images/sauces/cheddar.png' },
      { id: '2', name: 'Molho Big Bob', description: 'Aproximadamente 20g.', price: 4.00, image: '/images/sauces/big-bob.png' },
    ],
    addons: [
      { id: '1', name: 'Guardanapo', price: 0 },
      { id: '2', name: 'Canudo', price: 0 },
    ]
  },
  {
    id: '3',
    name: '2 Cheeseburguers + 1 Refri',
    description: "Clássico que todo mundo gosta tudo isso acompanhado de refrigerante.",
    price: 24.90,
    image: 'https://storage.shopfood.io/public/companies/poe726g0/products/medium/fb5466377a88236bb484991d472a48a1.jpg',
    category: 'Promoções',
    extras: [
      { id: '1', name: 'Hambúrguer Bovino 45g', price: 6.50, image: '/images/extras/hamburger.png' },
      { id: '2', name: 'Queijo', price: 2.50, image: '/images/extras/cheese.png' },
    ],
    sides: [
      { id: '1', name: 'Batata Palito Média', description: 'Batata palito crocante e sequinha.', price: 3.00, image: '/images/sides/fries-medium.png' },
    ],
    sauces: [
      { id: '1', name: 'Molho Cheddar', description: 'Aproximadamente 20g.', price: 4.00, image: '/images/sauces/cheddar.png' },
    ],
    addons: [
      { id: '1', name: 'Guardanapo', price: 0 },
      { id: '2', name: 'Canudo', price: 0 },
    ]
  },
  {
    id: '4',
    name: 'Trio Big Bob + Sundae',
    description: 'Na compra do nosso clássico Trio Big Bob, você ganha um Sundae grátis! O trio é composto por um Big Bob, uma porção média de batata palito e refrigerante.',
    price: 34.90,
    image: 'https://storage.shopfood.io/public/companies/poe726g0/products/medium/202111041521_1QBA_i.jpg',
    category: 'Combos',
    extras: [
      { id: '1', name: 'Hambúrguer Bovino 45g', price: 6.50, image: '/images/extras/hamburger.png' },
      { id: '2', name: 'Queijo', price: 2.50, image: '/images/extras/cheese.png' },
      { id: '3', name: 'Bacon', price: 4.00, image: '/images/extras/bacon.png' },
    ],
    sides: [
      { id: '1', name: 'Batata Palito Média', description: 'Batata palito crocante e sequinha.', price: 3.00, image: '/images/sides/fries-medium.png' },
      { id: '2', name: 'Batata Palito Grande', description: 'Batata palito crocante e sequinha.', price: 4.00, image: '/images/sides/fries-large.png' },
      { id: '3', name: 'Batata Palito Mega', description: 'Batata palito crocante e sequinha.', price: 9.00, image: '/images/sides/fries-mega.png' },
      { id: '4', name: 'Franlitos 6 unidades', description: 'Tirinhas de frango empanado e crocantes', price: 8.00, image: '/images/sides/franlitos-6.png' },
      { id: '5', name: 'Franlitos 12 unidades', description: 'Tirinhas de frango empanado e crocantes', price: 21.00, image: '/images/sides/franlitos-12.png' },
    ],
    sauces: [
      { id: '1', name: 'Molho Cheddar', description: 'Aproximadamente 20g.', price: 4.00, image: '/images/sauces/cheddar.png' },
      { id: '2', name: 'Molho Big Bob', description: 'Aproximadamente 20g.', price: 4.00, image: '/images/sauces/big-bob.png' },
      { id: '3', name: 'Maionese', description: 'Aproximadamente 20g.', price: 2.50, image: '/images/sauces/mayo.png' },
      { id: '4', name: 'Molho Big Bob 200g', description: 'Ele é único e exclusivo! Aprecie o verdadeiro Molho Big Bob e deixe seu sanduíche ainda mais saboroso.', price: 21.90, image: '/images/sauces/big-bob-200g.png' },
    ],
    addons: [
      { id: '1', name: 'Guardanapo', price: 0 },
      { id: '2', name: 'Canudo', price: 0 },
    ]
  },
  {
    id: '5',
    name: 'Milk Shake Colherudo 300ml',
    description: "Aquele milkshake que só o Bob's tem!",
    price: 18.90,
    image: 'https://storage.shopfood.io/public/companies/poe726g0/products/medium/d57c673008256be8b19c1f6333c6491c.jpg',
    category: 'Sobremesas',
    extras: [],
    sides: [],
    sauces: [],
    addons: [
      { id: '1', name: 'Guardanapo', price: 0 },
      { id: '2', name: 'Canudo', price: 0 },
    ]
  },
  {
    id: '6',
    name: 'Coca-Cola 500ml',
    description: "Refrigerante gelado para acompanhar seu lanche.",
    price: 8.90,
    image: 'https://storage.shopfood.io/public/companies/poe726g0/products/medium/202111041746_78R8_i.jpg',
    category: 'Bebidas',
    extras: [],
    sides: [],
    sauces: [],
    addons: [
      { id: '1', name: 'Guardanapo', price: 0 },
      { id: '2', name: 'Canudo', price: 0 },
      { id: '3', name: 'Gelo', price: 0 },
    ]
  },
  {
    id: '7',
    name: 'Guaraná Antarctica 500ml',
    description: "Refrigerante gelado para acompanhar seu lanche.",
    price: 8.90,
    image: 'https://storage.shopfood.io/public/companies/poe726g0/products/medium/202210040945_HE15_i.jpg',
    category: 'Bebidas',
    extras: [],
    sides: [],
    sauces: [],
    addons: [
      { id: '1', name: 'Guardanapo', price: 0 },
      { id: '2', name: 'Canudo', price: 0 },
      { id: '3', name: 'Gelo', price: 0 },
    ]
  },
]

// Função para buscar todos os produtos
export const getAllProducts = (): Product[] => {
  return products;
};

// Função para buscar um produto pelo ID
export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

// Função para buscar produtos por categoria
export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
}; 