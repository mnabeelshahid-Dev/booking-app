export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  total: number;
  createdAt: Date;
}