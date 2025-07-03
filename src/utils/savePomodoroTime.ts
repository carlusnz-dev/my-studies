import { supabase } from '@/lib/supabase/client';
import { sendPomodoroToNotion } from '@/utils/sendToNotion';

function getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
}

export async function savePomodoroSession(seconds: number) {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user?.id) {
        console.error('Usuário não autenticado');
        return;
    }

    const userId = userData.user.id;
    const today = getTodayDate();

    const { data, error: fetchError } = await supabase
        .from('pomodoro_history')
        .select('*')
        .eq('user_id', userId)
        .eq('date', today)
        .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Erro ao buscar histórico:', fetchError.message);
        return;
    }

    if (data) {
        const { error: updateError } = await supabase
            .from('pomodoro_history')
            .update({ seconds: data.seconds + seconds })
            .eq('id', data.id);

        await sendPomodoroToNotion(today, seconds);
        if (updateError)
            console.error('Erro ao atualizar:', updateError.message);
    } else {
        const { error: insertError } = await supabase
            .from('pomodoro_history')
            .insert([{ user_id: userId, date: today, seconds }]);

        await sendPomodoroToNotion(today, seconds);
        if (insertError)
            console.error('Erro ao salvar sessão:', insertError.message);
    }
}
