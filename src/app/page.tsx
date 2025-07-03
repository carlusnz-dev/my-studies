'use client';

import Clock from '@/components/Clock';
import { useAuth } from '@/context/AuthContext';
import { sendPomodoroToNotion } from '@/utils/sendToNotion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type PomodoroMode = 'pomodoro' | 'shortBreak' | 'longBreak';

export default function App() {
    const { user, loading } = useAuth();
    const router = useRouter();

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
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading || !user) return null;

    return (
        <div
            className={`min-h-screen flex flex-col justify-center items-center text-white ${getBackgroundMode()} transition-colors duration-500 px-4 py-6 overflow-y-hidden`}
        >
            <Link
                href="/dashboard"
                className="mb-6 underline text-white text-sm hover:text-gray-300 self-center max-w-full truncate"
            >
                Ver Dashboard
            </Link>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-3 text-center">
                Relógio Pomodoro
            </h1>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-mono mb-8 text-center">
                Estado: {mode}
            </h2>

            <div className="flex flex-col sm:flex-row gap-4 mb-8 w-full max-w-md justify-center">
                <button
                    className={`flex-1 px-4 py-3 rounded-md font-semibold text-center ${
                        mode === 'pomodoro'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-700 text-gray-200'
                    }`}
                    onClick={() => setMode('pomodoro')}
                >
                    Pomodoro
                </button>
                <button
                    className={`flex-1 px-4 py-3 rounded-md font-semibold text-center ${
                        mode === 'shortBreak'
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-700 text-gray-200'
                    }`}
                    onClick={() => setMode('shortBreak')}
                >
                    Descanso Curto
                </button>
                <button
                    className={`flex-1 px-4 py-3 rounded-md font-semibold text-center ${
                        mode === 'longBreak'
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-700 text-gray-200'
                    }`}
                    onClick={() => setMode('longBreak')}
                >
                    Descanso Longo
                </button>
            </div>

            <div className="w-full max-w-lg">
                <Clock
                    timeLeft={timeLeft}
                    setTimeLeft={setTimeLeft}
                    isRunning={isRunning}
                    setIsRunning={setIsRunning}
                    mode={mode}
                    setMode={setMode}
                />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-10 w-full max-w-md">
                <button
                    className="flex-1 text-lg px-5 py-3 bg-white text-black font-black ring-white hover:bg-transparent hover:ring-4 hover:text-white transition-all duration-300 cursor-pointer rounded-md"
                    onClick={() => setIsRunning(!isRunning)}
                >
                    {isRunning ? 'Pausar' : 'Começar'}
                </button>

                <button
                    className="flex-1 text-lg px-5 py-3 bg-gray-600 text-white font-black ring-gray-600 hover:bg-transparent hover:ring-4 hover:text-white transition-all duration-300 cursor-pointer rounded-md"
                    onClick={resetTimer}
                >
                    Resetar
                </button>
            </div>
        </div>
    );
}
