import { Brand } from './brand';
import { Category } from './category';

export interface ShippingAddress {
  details: string;
  phone: string;
  city: string;
}

export interface OrderItem {
  _id: string;
  count: number;
  price: number;
  product: {
    _id: string;
    title: string;
    imageCover: string;
    category?: Category | string;
    brand?: Brand | string;
  };
}

export interface Order {
  _id: string;
  id?: number;
  cartItems: OrderItem[];
  shippingAddress?: ShippingAddress;
  paymentMethodType: 'cash' | 'card';
  isPaid: boolean;
  isDelivered: boolean;
  totalOrderPrice: number;
  shippingPrice: number;
  taxPrice: number;
  createdAt: string;
}
