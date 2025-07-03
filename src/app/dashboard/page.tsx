'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from 'recharts';
import NavDashboard from '@/components/NavDashboard';

type HistoryRecord = {
    date: string;
    seconds: number;
};

export default function DashboardPage() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const [history, setHistory] = useState<HistoryRecord[]>([]);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    useEffect(() => {
        const fetchHistory = async () => {
            const { data, error } = await supabase
                .from('pomodoro_history')
                .select('*')
                .eq('user_id', user?.id)
                .order('date', { ascending: true })
                .gte('date', getDateNDaysAgo(6)); // últimos 7 dias

            if (!error && data) {
                setHistory(data);
            }
        };

        if (user) {
            fetchHistory();
        }
    }, [user]);

    const getDateNDaysAgo = (n: number): string => {
        const date = new Date();
        date.setDate(date.getDate() - n);
        return date.toISOString().split('T')[0];
    };

    const getTodayDate = (): string => new Date().toISOString().split('T')[0];

    const totalSeconds = history.reduce((sum, h) => sum + h.seconds, 0);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const today = getTodayDate();
    const todaySeconds = history.find((h) => h.date === today)?.seconds || 0;
    const todayMinutes = Math.floor(todaySeconds / 60);

    const chartData = history.map((h) => ({
        date: h.date.slice(5), // MM-DD
        minutes: Math.floor(h.seconds / 60),
    }));

    if (loading || !user) return null;

    return (
        <div className="min-h-screen flex flex-col md:flex-row p-5 gap-5 bg-neutral-900 text-white">
            <aside className="md:flex-1 max-w-full md:max-w-xs bg-neutral-800 p-6 rounded-2xl relative">
                <NavDashboard />
                <p className="text-lg font-black font-mono mt-8 truncate">
                    Logado como: {user.email}
                </p>

                <button
                    className="absolute bottom-6 left-6 right-6 py-3 bg-red-500 text-white rounded-lg cursor-pointer hover:bg-red-700 transition"
                    onClick={logout}
                >
                    Sair
                </button>
            </aside>

            {/* Dashboard */}
            <main className="md:flex-3/4 p-6 md:p-10 bg-neutral-800 rounded-2xl flex flex-col">
                <h1 className="text-3xl font-bold mb-6 text-center md:text-left">
                    Dashboard de Estudos
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                    <div className="bg-neutral-700 p-6 rounded-lg shadow text-center">
                        <p className="text-lg text-gray-400">Tempo total</p>
                        <p className="text-3xl font-bold">
                            {totalHours}h e {minutes} min
                        </p>
                    </div>
                    <div className="bg-neutral-700 p-6 rounded-lg shadow text-center">
                        <p className="text-lg text-gray-400">Hoje</p>
                        <p className="text-3xl font-bold">
                            {Math.floor(todayMinutes / 60)}h e{' '}
                            {todayMinutes % 60} min
                        </p>
                    </div>
                    <div className="bg-neutral-700 p-6 rounded-lg shadow text-center">
                        <p className="text-lg text-gray-400">
                            Dias registrados
                        </p>
                        <p className="text-3xl font-bold">{history.length}</p>
                    </div>
                </div>

                <section className="bg-neutral-700 p-6 rounded-lg shadow flex-grow">
                    <h2 className="text-xl font-semibold mb-4">
                        Últimos 7 dias
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" stroke="#ccc" />
                            <YAxis stroke="#ccc" />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="minutes"
                                stroke="#00d1b2"
                                strokeWidth={3}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </section>
            </main>
        </div>
    );
}
