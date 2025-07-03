'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            setError(error.message);
        } else {
            router.push('/'); // Redireciona para o App principal
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-white">
            <form
                onSubmit={handleLogin}
                className="bg-neutral-800 p-8 rounded-xl shadow-lg w-96 space-y-5"
            >
                <h1 className="text-2xl font-bold text-center">Entrar</h1>
                {error && (
                    <p className="text-red-500 text-sm text-center">{error}</p>
                )}
                <input
                    className="w-full p-3 rounded bg-neutral-700 text-white"
                    type="email"
                    placeholder="E-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    className="w-full p-3 rounded bg-neutral-700 text-white"
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-2 rounded"
                >
                    Entrar
                </button>
            </form>
        </div>
    );
}
