'use client';

import Clock from '@/components/Clock';
import { useAuth } from '@/context/AuthContext';
import { sendPomodoroToNotion } from '@/utils/sendToNotion';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type PomodoroMode = 'pomodoro' | 'shortBreak' | 'longBreak';

export default function App() {
    const { user, loading } = useAuth();

    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [mode, setMode] = useState<PomodoroMode>('pomodoro');

    const getBackgroundMode = (): string => {
        switch (mode) {
            case 'pomodoro':
                return 'bg-rose-500';
            case 'shortBreak':
                return 'bg-emerald-500';
            case 'longBreak':
                return 'bg-sky-500';
            default:
                return 'bg-gray-700';
        }
    };

    const resetTimer = () => {
        setIsRunning(false);
        setMode('pomodoro');
    };

    useEffect(() => {
        if (!loading && !user) {
            // router.push('/login');
        }
    }, [user, loading]);

    if (loading || !user) return null; // ou uma tela de carregando...

    return (
        <div
            className={`h-screen flex flex-col justify-center items-center text-white ${getBackgroundMode()} transition-colors duration-500`}
        >
            <Link
                href="/dashboard"
                className="mt-8 underline text-white text-sm hover:text-gray-300"
            >
                Ver Dashboard
            </Link>
            <h1 className="text-2xl mb-3">Relógio Pomodoro</h1>
            <h1 className="text-5xl font-bold font-mono">Estado: {mode}</h1>

            <div className="flex gap-4 mt-8">
                <button
                    className={`px-4 py-2 rounded-md font-semibold ${
                        mode === 'pomodoro'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-700 text-gray-200'
                    }`}
                    onClick={() => setMode('pomodoro')}
                >
                    Pomodoro
                </button>
                <button
                    className={`px-4 py-2 rounded-md font-semibold ${
                        mode === 'shortBreak'
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-700 text-gray-200'
                    }`}
                    onClick={() => setMode('shortBreak')}
                >
                    Descanso Curto
                </button>
                <button
                    className={`px-4 py-2 rounded-md font-semibold ${
                        mode === 'longBreak'
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-700 text-gray-200'
                    }`}
                    onClick={() => setMode('longBreak')}
                >
                    Descanso Longo
                </button>
            </div>

            <Clock
                timeLeft={timeLeft}
                setTimeLeft={setTimeLeft}
                isRunning={isRunning}
                setIsRunning={setIsRunning}
                mode={mode}
                setMode={setMode}
            />

            <button
                className="text-lg px-5 py-2 bg-white text-black font-black ring-white hover:bg-transparent hover:ring-4 hover:text-white transition-all duration-300 cursor-pointer rounded-md"
                onClick={() => setIsRunning(!isRunning)}
            >
                {isRunning ? 'Pausar' : 'Começar'}
            </button>

            <button
                className="text-lg px-5 py-2 mt-4 bg-gray-600 text-white font-black ring-gray-600 hover:bg-transparent hover:ring-4 hover:text-white transition-all duration-300 cursor-pointer rounded-md"
                onClick={resetTimer}
            >
                Resetar
            </button>

            <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={async () => {
                    const today = new Date().toISOString().split('T')[0];
                    await sendPomodoroToNotion(today, 1500); // 25 minutos
                }}
            >
                Testar envio Notion
            </button>
        </div>
    );
}
