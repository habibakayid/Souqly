import { Brand } from './brand';
import { Category } from './category';

export interface SubCategory {
  _id: string;
  name: string;
  slug: string;
  category?: string;
}

export interface Product {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  priceAfterDiscount?: number;
  imageCover: string;
  images: string[];
  ratingsAverage: number;
  ratingsQuantity: number;
  sold: number;
  quantity: number;
  category: Category;
  brand: Brand;
  subcategory?: SubCategory[];
}

export interface Paged<T> {
  results: number;
  metadata: {
    currentPage: number;
    numberOfPages: number;
    limit: number;
    nextPage?: number;
    prevPage?: number;
  };
  data: T[];
}

export interface ProductQuery {
  page?: number;
  limit?: number;
  sort?: string;
  keyword?: string;
  categories?: string[];
  brands?: string[];
  minPrice?: number;
  maxPrice?: number;
}
