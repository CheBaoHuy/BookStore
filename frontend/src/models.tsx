export interface User {
    id: number,
    username: string,
    email: string,
    phone: number,
    fullName: string,
    avatar: string,
    updatedAt: string,
    createdAt: string,
    status: boolean
}

export interface CartState {
    cartItems: Product[];
    cartTotalQuantity: number;
    cartTotalAmount: number;

}

export interface Product {
    id: number;
    category: Category;
    title: string;
    image: string | null;
    oldPrice: number;
    currentPrice: number;
    quantity: number;
    description: string;
    author: string;
    publisher: string;
    publishYear: number;
    createdAt: string;
    updatedAt: string | null;
    active: boolean;
    cartTotal: number;
}

export interface Order {
    id: number;
    user: User; // Assume User interface is defined elsewhere
    fullName: string;
    email: string;
    phone: string;
    address: string;
    note: string;
    payment_method: string;
    payment_status: boolean;
    total_amount: number;
    shipping_cost: number;
    createdAt: string;
    orderStatus: OrderStatus;
}
export interface Rate {
    id: number;
    product: Product;
    user: User;
    rating: number;
    comment: string;
    createdAt: string; // or Date, depending on how you handle dates
    updatedAt: string; // or Date, depending on how you handle dates
    status: boolean;
    // orderDetails: OrderDetails;
}

export interface OrderStatus {
    id: number;
    status: string;
}

export interface Category {
    id: number;
    parentCategory: Category | null;
    name: string;
    createdAt: string;
    updatedAt: string | null;
    active: boolean;
    products: Product[];
}

export interface CategoryResponse {
    category: Category;
    categories: Category[];
}
export interface Review {
    id: number,
    user: User;
    rating: number,
    comment: string,
    createAt: string,
    updateAt: string,
    status: boolean
}
export interface Pageable {
    pageNumber: number;
    pageSize: number;
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
}

export interface ProductsPage {
    content: Product[];
    pageable: Pageable;
    last: boolean;
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    };
    first: boolean;
    numberOfElements: number;
    empty: boolean;
}
export interface ReviewsPage {
    content: Review[];
    pageable: Pageable;
    last: boolean;
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    };
    first: boolean;
    numberOfElements: number;
    empty: boolean;
}

export interface ProductsWithCategoryResponse {
    category: Category;
    products: ProductsPage;
}

export interface UserDto {
    username: string;
    fullName: string;
    email: string;
    phone: string;
    avatarLink: string;
}

export interface RegisterDto {
    username: string;
    password: string;
    email: string;
}

export interface LoginDto {
    username: string;
    password: string;
}

export interface ForgotDto {
    email: string;
}

export interface OrderDto {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    address: string;
    paymentMethod: string;
    paymentStatus: boolean;
    note: string;
    shippingCost: number;
    totalAmount: number;
    products: Product[];
    orderDetails: any[];
}

export interface AddressDto {
    id: number;
    fullName: string;
    phone: string;
    street: string;
    wardId: number;
    ward: string;
    districtId: number;
    district: string;
    provinceId: number;
    province: string;
    default: boolean;
}

export interface RateDto {
    userId: number;
    productId: number;
    content: string;
    stars: number;
    orderDetailsId: number;
}