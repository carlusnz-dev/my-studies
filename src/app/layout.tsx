import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

const interFont = Inter({
    variable: '--inter',
    subsets: ['latin'],
});

const jetbrainsFont = JetBrains_Mono({
    variable: '--jetbrains-mono',
    subsets: ['latin'],
    style: 'normal',
});

export const metadata: Metadata = {
    title: 'Estudos do Carlos',
    description: 'Um simples site para contar meu tempo de estudo :)',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR">
            <body className={`${interFont.variable} ${jetbrainsFont.variable}`}>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
