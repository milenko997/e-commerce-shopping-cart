import { ReactNode } from 'react';
import Header from '@/components/Header';

interface PublicLayoutProps {
    children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
    return (
        <>
            <Header />
            <main className="p-6">
                {children}
            </main>
        </>
    );
}
