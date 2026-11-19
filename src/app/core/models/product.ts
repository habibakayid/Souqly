export interface Named {
  _id: string;
  name: string;
  slug: string;
  image?: string;
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
  category: Named;
  brand: Named;
  subcategory?: Named[];
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
