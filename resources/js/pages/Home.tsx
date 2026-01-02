/* eslint-disable */
import { useContext, useState } from 'react';
import { CartContext } from '@/contexts/CartContext';
import PublicLayout from '@/layouts/public-layout';
import { usePage } from '@inertiajs/react';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock_quantity: number;
}

interface HomeProps {
    products: Product[];
}

export default function Home({ products: initialProducts }: HomeProps) {
    const { addToCart } = useContext(CartContext);
    const { auth } = usePage().props as any;

    const [products, setProducts] = useState<Product[]>(initialProducts);

    const handleAddToCart = async (productId: number) => {
        if (!auth?.user) {
            window.location.href = '/login';
            return;
        }

        try {
            await addToCart(productId);

            setProducts((prev: Product[]) =>
                prev.map((p) =>
                    p.id === productId
                        ? { ...p, stock_quantity: Math.max(p.stock_quantity - 1, 0) }
                        : p
                )
            );
        } catch (err: any) {
            if (err.response && err.response.data.message) {
                alert(err.response.data.message);
            }
        }
    };

    return (
        <PublicLayout>
            <h1 className="text-3xl font-bold mb-8 text-center">Shop</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="border rounded-lg shadow hover:shadow-lg transition p-6 flex flex-col justify-between"
                    >
                        <div>
                            <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                            <p className="text-gray-600 mb-4">{product.description}</p>
                            <p className="text-lg font-bold">{product.price} €</p>
                            <p className="text-sm text-gray-500">
                                {product.stock_quantity > 0
                                    ? `In stock: ${product.stock_quantity}`
                                    : 'Out of stock'}
                            </p>
                        </div>

                        <button
                            onClick={() => handleAddToCart(product.id)}
                            disabled={product.stock_quantity === 0}
                            className={`mt-4 px-4 py-2 rounded font-semibold text-white transition cursor-pointer ${
                                product.stock_quantity === 0
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-black hover:bg-gray-800'
                            }`}
                        >
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>
        </PublicLayout>
    );
}
