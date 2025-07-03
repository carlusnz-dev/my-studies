'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        const { error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            setError(error.message);
        } else {
            alert('Cadastro feito! Verifique seu e-mail para confirmar.');
            router.push('/login');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-white">
            <form
                onSubmit={handleRegister}
                className="bg-neutral-800 p-8 rounded-xl shadow-lg w-96 space-y-5"
            >
                <h1 className="text-2xl font-bold text-center">Criar Conta</h1>
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
                    placeholder="Senha (mínimo 6 caracteres)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 rounded"
                >
                    Registrar
                </button>
            </form>
        </div>
    );
}
