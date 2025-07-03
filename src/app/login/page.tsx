'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const emailRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        emailRef.current?.focus();
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        setLoading(false);

        if (error) {
            setError(error.message);
        } else {
            router.push('/');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-white px-4">
            <form
                onSubmit={handleLogin}
                className="bg-neutral-800 p-8 rounded-xl shadow-lg max-w-md w-full space-y-6"
                aria-label="Formulário de login"
            >
                <h1 className="text-3xl font-bold text-center">Entrar</h1>
                {error && (
                    <p
                        className="text-red-500 text-sm text-center"
                        role="alert"
                    >
                        {error}
                    </p>
                )}
                <input
                    ref={emailRef}
                    className="w-full p-3 rounded bg-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                    type="email"
                    placeholder="E-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    aria-required="true"
                    aria-label="E-mail"
                />
                <input
                    className="w-full p-3 rounded bg-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    aria-required="true"
                    aria-label="Senha"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 rounded transition disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    {loading ? 'Entrando...' : 'Entrar'}
                </button>
            </form>
        </div>
    );
}
