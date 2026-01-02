/* eslint-disable */
import { Link, usePage } from '@inertiajs/react';
import { useContext } from 'react';
import { CartContext } from '@/contexts/CartContext';
import { cart as cartRoute } from '@/routes';

export default function Header() {
    const { auth } = usePage().props as any;
    const { cart } = useContext(CartContext);

    return (
        <header className="bg-white shadow-md border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
                <Link href="/" className="text-xl font-bold text-gray-800">
                    MyShop
                </Link>

                <nav className="flex items-center gap-6">
                    {!auth?.user ? (
                        <>
                            <Link
                                href="/login"
                                className="text-gray-700 hover:text-gray-900 cursor-pointer"
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="text-gray-700 hover:text-gray-900 cursor-pointer"
                            >
                                Register
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                href={cartRoute()}
                                className="text-gray-700 hover:text-gray-900 relative"
                            >
                                Cart
                                {cart?.items?.length! > 0 && (
                                    <span className="ml-1 inline-block bg-red-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                                        {cart?.items?.length ?? 0}
                                    </span>
                                )}
                            </Link>

                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="text-red-600 hover:text-red-800 cursor-pointer"
                            >
                                Logout
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
