/* eslint-disable */
import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';

interface Product {
    id: number;
    name: string;
    price: number;
    stock_quantity: number;
}

interface CartItem {
    id: number;
    quantity: number;
    price: number;
    product: Product;
}

interface Cart {
    items: CartItem[];
}

interface CartContextType {
    cart: Cart | null;
    addToCart: (productId: number, quantity?: number) => Promise<void>;
    updateQuantity: (itemId: number, quantity: number) => Promise<void>;
    removeItem: (itemId: number) => Promise<void>;
}

export const CartContext = createContext<CartContextType>({} as CartContextType);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setCart] = useState<Cart | null>(null);

    const fetchCart = async () => {
        try {
            const res = await axios.get('/cart/data');
            setCart(res.data);
        } catch (e) {
            setCart(null);
        }
    };

    const addToCart = async (productId: number, quantity = 1) => {
        await axios.post('/cart/add', { product_id: productId, quantity });
        await fetchCart();
    };

    const updateQuantity = async (itemId: number, quantity: number) => {
        await axios.patch(`/cart/items/${itemId}`, { quantity });
        await fetchCart();
    };

    const removeItem = async (itemId: number) => {
        await axios.delete(`/cart/items/${itemId}`);
        await fetchCart();
    };

    useEffect(() => {
        fetchCart();
    }, []);

    return (
        <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeItem }}>
            {children}
        </CartContext.Provider>
    );
};
