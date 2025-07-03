'use client';

import React, { useState, useEffect } from 'react';
import { savePomodoroSession } from '@/utils/savePomodoroTime';
import { useAuth } from '@/context/AuthContext';

const POMODORO_DURATION = 25 * 60;
const SHORT_BREAK_DURATION = 5 * 60;
const LONG_BREAK_DURATION = 15 * 60;

type PomodoroMode = 'pomodoro' | 'shortBreak' | 'longBreak';

interface ClockProps {
    timeLeft: number;
    setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
    isRunning: boolean;
    setIsRunning: React.Dispatch<React.SetStateAction<boolean>>;
    mode: PomodoroMode;
    setMode: React.Dispatch<React.SetStateAction<PomodoroMode>>;
}

export default function Clock({
    timeLeft,
    setTimeLeft,
    isRunning,
    setIsRunning,
    mode,
    setMode,
}: ClockProps) {
    const { user } = useAuth();

    const [pomodoroCount, setPomodoroCount] = useState<number>(0);

    useEffect(() => {
        if (!isRunning) {
            let initialTime: number;
            switch (mode) {
                case 'pomodoro':
                    initialTime = POMODORO_DURATION;
                    break;
                case 'shortBreak':
                    initialTime = SHORT_BREAK_DURATION;
                    break;
                case 'longBreak':
                    initialTime = LONG_BREAK_DURATION;
                    break;
                default:
                    initialTime = POMODORO_DURATION;
            }
            setTimeLeft(initialTime);
        }
    }, [mode]);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (!interval && isRunning && timeLeft > 0  && user) {
            interval = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
        } else if (timeLeft === 0 && isRunning) {
            setIsRunning(false);
            console.log('Tempo esgotado!');

            if (mode === 'pomodoro') {
                setPomodoroCount((prevCount) => prevCount + 1);
                savePomodoroSession(POMODORO_DURATION); // ⏱️ salvar tempo!

                if ((pomodoroCount + 1) % 4 === 0) {
                    setMode('longBreak');
                } else {
                    setMode('shortBreak');
                }
            } else if (mode === 'shortBreak') {
                setMode('pomodoro');
            } else if (mode === 'longBreak') {
                setMode('pomodoro');
                setPomodoroCount(0);
            }
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [
        isRunning,
        timeLeft,
        mode,
        setTimeLeft,
        setIsRunning,
        setMode,
        pomodoroCount,
    ]);

    useEffect(() => {
        if (timeLeft === 0 && isRunning) {
            const sound = new Audio('/alarm.mp3');
            sound.play();
        }
    }, [timeLeft, isRunning]);

    const formatTime = (timeInSeconds: number): string => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;

        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');

        return `${formattedMinutes}:${formattedSeconds}`;
    };

    return (
        <div className="my-12 rounded-2xl">
            <span className="text-[12em] font-black font-mono">
                {formatTime(timeLeft)}
            </span>
        </div>
    );
}
