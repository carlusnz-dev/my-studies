// src/app/api/notion/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_TOKEN! });

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { date, seconds } = body;

    if (!date || typeof seconds !== 'number') {
        return NextResponse.json(
            {
                status: 'error',
                message: 'Dados inválidos',
            },
            { status: 400 }
        );
    }

    try {
        const databaseId = process.env.NOTION_DATABASE_ID!;
        const response = await notion.pages.create({
            parent: { database_id: databaseId },
            properties: {
                Nome: {
                    title: [
                        {
                            text: {
                                content: `Pomodoro - ${date}`,
                            },
                        },
                    ],
                },
                Minutos: {
                    number: Math.floor(seconds / 60),
                },
                Data: {
                    date: { start: date },
                },
            },
        });

        return NextResponse.json({ status: 'ok', id: response.id });
    } catch (err: any) {
        console.error('Erro Notion API:', err);
        return NextResponse.json(
            {
                status: 'error',
                message: err.message || 'Erro desconhecido',
            },
            { status: 500 }
        );
    }
}
