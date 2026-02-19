import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product, getProductById } from "@/data/products";

export interface CartItem {
    id: number;
    name: string;
    price: string;
    priceNumeric: number;
    image: string;
    quantity: number;
    category: string;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: Product, quantity?: number) => void;
    removeFromCart: (id: number) => void;
    updateQuantity: (id: number, newQuantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "sinea-jewelry-cart";

const loadCartFromStorage = (): CartItem[] => {
    try {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch {
        // Ignore parse errors
    }
    return [];
};

const saveCartToStorage = (items: CartItem[]) => {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
        // Ignore storage errors
    }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>(loadCartFromStorage);

    // Persist to localStorage whenever cart changes
    useEffect(() => {
        saveCartToStorage(cartItems);
    }, [cartItems]);

    const addToCart = (product: Product, quantity: number = 1) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [
                ...prev,
                {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    priceNumeric: product.priceNumeric,
                    image: product.image,
                    quantity,
                    category: product.category,
                },
            ];
        });
    };

    const removeFromCart = (id: number) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const updateQuantity = (id: number, newQuantity: number) => {
        if (newQuantity <= 0) {
            removeFromCart(id);
        } else {
            setCartItems(prev =>
                prev.map(item =>
                    item.id === id ? { ...item, quantity: newQuantity } : item
                )
            );
        }
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.priceNumeric * item.quantity,
        0
    );

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                totalItems,
                subtotal,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
