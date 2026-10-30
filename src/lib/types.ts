// Tipos de la API de Stockfy (ver /api/schema/ en el backend).

export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type Category = {
  id: number;
  name: string;
  slug: string;
  description?: string;
};

export type Product = {
  id: number;
  name: string;
  slug: string;
  short_description?: string;
  featured?: boolean;
  category: Category;
  price_from: string | null;
  in_stock: boolean;
  primary_image: { url: string; alt_text: string } | null;
};

export type ProductImage = {
  id: number;
  url: string;
  alt_text?: string;
  position?: number;
  is_primary?: boolean;
};

export type VariantAttributeValue = {
  id: number;
  attribute_id: number;
  attribute: string;
  attribute_slug: string;
  value_id: number;
  value: string;
  value_slug: string;
};

export type ProductVariant = {
  id: number;
  sku: string;
  price: string;
  compare_at_price?: string | null;
  stock?: number;
  status?: "ACTIVE" | "HIDDEN" | "DISCONTINUED";
  attributes: VariantAttributeValue[];
};

export type ProductDetail = Omit<Product, "price_from" | "in_stock" | "primary_image"> & {
  description?: string;
  variants: ProductVariant[];
  images: ProductImage[];
  created_at: string;
  updated_at: string;
};

export type Role = "ADMIN" | "EMPLOYEE" | "CUSTOMER";

export type User = {
  id: number;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  role: Role;
  date_joined: string;
};

export type OrderStatus =
  | "PENDING_PAYMENT"
  | "PAID"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export type OrderItem = {
  id: number;
  variant: number;
  sku: string;
  product_name: string;
  variant_description: string;
  unit_price: string;
  quantity: number;
  line_total: string;
};

export type Order = {
  id: number;
  number: string;
  status: OrderStatus;
  status_display: string;
  shipping_name: string;
  shipping_address: string;
  shipping_city: string;
  shipping_postal_code: string;
  shipping_province: string;
  shipping_country: string;
  shipping_phone: string;
  notes: string;
  items: OrderItem[];
  subtotal: string;
  shipping_cost: string;
  total: string;
  currency: string;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
};

export type CheckoutSession = {
  provider: string;
  reference: string;
  client_secret: string | null;
  redirect_url: string | null;
  form_fields: Record<string, string>;
  public_key: string | null;
};

export type WishlistItem = {
  id: number;
  product: { id: number; name: string; slug: string; short_description?: string };
  created_at: string;
};

export type Wishlist = {
  id: number;
  name: string;
  is_default: boolean;
  items: WishlistItem[];
  created_at: string;
};

// --- Panel de gestión (/api/admin/...) --------------------------------------

export type ProductStatus = "DRAFT" | "ACTIVE" | "HIDDEN" | "ARCHIVED";
export type VariantStatus = "ACTIVE" | "HIDDEN" | "DISCONTINUED";

export type AdminProduct = {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  category: number;
  category_name: string;
  status: ProductStatus;
  featured: boolean;
  variants_count: number;
  total_stock: number;
  primary_image_url: string | null;
  created_at: string;
  updated_at: string;
};

export type AdminCategory = {
  id: number;
  name: string;
  slug: string;
  description: string;
  parent: number | null;
  is_active: boolean;
};

/** GET /api/categories/{slug}/attributes/ */
export type CategoryAttribute = {
  id: number;
  name: string;
  slug: string;
  required: boolean;
  filterable: boolean;
  position: number;
  values: { id: number; value: string; slug: string }[];
};

export type AdminVariant = {
  id: number;
  product: number;
  product_name: string;
  sku: string;
  price: string;
  compare_at_price: string | null;
  stock: number;
  status: VariantStatus;
  /** Ids de AttributeValue. */
  attributes: number[];
  created_at: string;
  updated_at: string;
};

export type AdminImage = {
  id: number;
  product: number;
  variant: number | null;
  url: string;
  storage_key: string | null;
  alt_text: string;
  position: number;
  is_primary: boolean;
};

export type MovementType =
  | "STOCK_IN"
  | "SALE_STORE"
  | "SALE_ONLINE"
  | "RETURN"
  | "DAMAGED"
  | "CORRECTION";

export type InventoryMovement = {
  id: number;
  variant: number;
  sku: string;
  quantity: number;
  movement_type: MovementType;
  reason: string;
  order: number | null;
  user_email: string | null;
  stock_after: number;
  created_at: string;
};

export type AdminUser = {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: Role;
  is_active: boolean;
  last_login: string | null;
  date_joined: string;
};
