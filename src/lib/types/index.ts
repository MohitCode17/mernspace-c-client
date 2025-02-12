export interface Tenant {
  id: string;
  name: string;
  address: string;
}

export interface Attribute {
  name: string;
  widgetType: "switch" | "radio";
  defaultValue: string;
  availableOptins: string[];
}

export interface PriceConfiguration {
  [key: string]: {
    priceType: "base" | "aditional";
    availableOptions: string[];
  };
}

export interface Category {
  _id: string;
  name: string;
  priceConfiguration: PriceConfiguration;
  attributes: Attribute[];
}

export type ProductAttribute = {
  name: string;
  value: string | boolean;
};

export interface ProductPriceConfiguration {
  [key: string]: {
    priceType: "base" | "aditional";
    availableOptions: {
      [key: string]: number;
    };
  };
}

export type Product = {
  _id: string;
  name: string;
  description: string;
  category: Category;
  priceConfiguration: ProductPriceConfiguration;
  attributes: ProductAttribute[];
  status: boolean;
  createdAt: string;
  image: string;
  isPublish: boolean;
};

export type Topping = {
  id: string;
  name: string;
  price: number;
  image: string;
};

export type Address = {
  text: string;
  isDefault: boolean;
};

export type Customer = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  addresses: Address[];
};

export type CouponCodeData = {
  code: string;
  tenantId: string;
};
