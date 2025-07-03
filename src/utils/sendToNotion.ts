export async function sendPomodoroToNotion(date: string, seconds: number) {
    try {
        const response = await fetch('/api/notion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ date, seconds }),
        });

        const result = await response.json();
        if (result.status === 'ok') {
            console.log('✅ Enviado ao Notion via API:', result.id);
        } else {
            console.error('❌ Erro no envio Notion:', result.message);
        }
    } catch (error) {
        console.error('❌ Erro fetch Notion:', error);
    }
}
