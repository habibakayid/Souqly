import { Brand } from '../../../../core/models/brand';
import { Category } from '../../../../core/models/category';
import { Order } from '../../../../core/models/order';

export interface Entry { name: string; value: number }

export interface DashboardStats {
  totalOrders: number;
  totalSpent: number;
  avgOrder: number;
  delivered: number;
  paid: number;
  cash: number;
  card: number;
  monthly: { label: string; value: number }[];
  byCategory: Entry[];
  topProducts: { id: string; title: string; image: string; count: number }[];
  topBrands: Entry[];
  topCities: Entry[];
}

type Ref = { _id?: string; name?: string } | string | null | undefined;
type Named = { _id: string; name: string };

/** الـ API ساعات بيرجّع object وساعات id، فبنتعامل مع الاتنين */
function nameOf(ref: Ref, list: Named[]): string | undefined {
  if (!ref) return undefined;
  if (typeof ref === 'object' && ref.name) return ref.name;
  const id = typeof ref === 'string' ? ref : ref._id;
  return list.find((x) => x._id === id)?.name;
}

function add(map: Map<string, number>, key: string | undefined, by: number): void {
  if (key) map.set(key, (map.get(key) ?? 0) + by);
}

function top(map: Map<string, number>, n = 5): Entry[] {
  return [...map]
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([name, value]) => ({ name, value }));
}

export function buildStats(orders: Order[], categories: Category[], brands: Brand[], locale: string): DashboardStats {
  const monthly = new Map<string, number>();
  const byCategory = new Map<string, number>();
  const brandCount = new Map<string, number>();
  const cities = new Map<string, number>();
  const products = new Map<string, { title: string; image: string; count: number }>();
  let spent = 0, delivered = 0, paid = 0, cash = 0, card = 0;

  for (const o of orders) {
    spent += o.totalOrderPrice;
    if (o.isDelivered) delivered++;
    if (o.isPaid) paid++;
    if (o.paymentMethodType === 'card') card++;
    else cash++;

    const d = new Date(o.createdAt);
    add(monthly, `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`, o.totalOrderPrice);
    add(cities, o.shippingAddress?.city?.trim(), 1);

    for (const it of o.cartItems ?? []) {
      add(byCategory, nameOf(it.product.category, categories), it.price * it.count);
      add(brandCount, nameOf(it.product.brand, brands), it.count);
      const cur = products.get(it.product._id) ?? { title: it.product.title, image: it.product.imageCover, count: 0 };
      cur.count += it.count;
      products.set(it.product._id, cur);
    }
  }

  const fmt = new Intl.DateTimeFormat(locale, { month: 'short', year: '2-digit' });

  return {
    totalOrders: orders.length,
    totalSpent: spent,
    avgOrder: orders.length ? spent / orders.length : 0,
    delivered,
    paid,
    cash,
    card,
    monthly: [...monthly]
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([key, value]) => {
        const [y, m] = key.split('-');
        return { label: fmt.format(new Date(+y, +m - 1, 1)), value };
      }),
    byCategory: top(byCategory, 6),
    topProducts: [...products]
      .map(([id, p]) => ({ id, ...p }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5),
    topBrands: top(brandCount),
    topCities: top(cities),
  };
}