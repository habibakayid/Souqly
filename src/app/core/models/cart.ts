import { Brand } from './brand';
import { Category } from './category';

export interface CartProduct {
  _id: string; title: string; imageCover: string; ratingsAverage?: number;
  category?: Category; brand?: Brand; quantity?: number;
}
export interface CartItem { _id: string; count: number; price: number; product: CartProduct }
export interface CartData { _id: string; products: CartItem[]; totalCartPrice: number }
export interface CartResponse { status: string; numOfCartItems: number; cartId?: string; data: CartData }