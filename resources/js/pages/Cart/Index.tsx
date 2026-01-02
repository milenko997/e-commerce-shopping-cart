/* eslint-disable */
import { useContext } from 'react';
import AppLayout from '@/layouts/app-layout';
import { CartContext } from '@/contexts/CartContext';
import Header from '@/components/Header';

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

export default function CartPage() {
    const { cart, updateQuantity, removeItem } = useContext(CartContext);

    if (!cart || cart.items.length === 0) {
        return (
            <>
                <Header />
                <AppLayout>
                    <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
                    <p>Your cart is empty.</p>
                </AppLayout>
            </>
        );
    }

    const total = cart.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <>
            <Header />
            <AppLayout>
                <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

                <div className="space-y-4">
                    {cart.items.map((item: CartItem) => {
                        const maxQuantity = item.quantity + item.product.stock_quantity;
                        return (
                            <div
                                key={item.id}
                                className="flex justify-between items-center border p-4 rounded"
                            >
                                <div>
                                    <h2 className="font-semibold">{item.product.name}</h2>
                                    <p>{item.price} €</p>
                                    <p className="text-sm text-gray-500">
                                        Available: {maxQuantity}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        min={1}
                                        max={maxQuantity}
                                        value={item.quantity}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value);
                                            if (!isNaN(val)) {
                                                const clamped = Math.max(1, Math.min(val, maxQuantity));
                                                updateQuantity(item.id, clamped);
                                            }
                                        }}
                                        className="border w-16 text-center rounded"
                                    />
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-800 cursor-pointer"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-6 text-right">
                    <p className="text-xl font-bold">Total: {total.toFixed(2)} €</p>
                </div>
            </AppLayout>
        </>
    );
}
