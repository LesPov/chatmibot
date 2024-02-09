import BotWhatsapp from '@bot-whatsapp/bot';
import { ChatCompletionMessageParam } from 'openai/resources';
import User from 'src/models/User';
import { run } from 'src/services/openai';

/**
 * Un flujo conversacion que es por defecto cunado no se contgiene palabras claves en otros flujos
 */
export default BotWhatsapp.addKeyword(BotWhatsapp.EVENTS.WELCOME)

.addAction(async (ctx, { flowDynamic, state }) => {
    try {
        const newHistory = (state.getMyState()?.history ?? []) as ChatCompletionMessageParam[];
        const name = ctx?.pushName ?? '';
        const phoneNumber = ctx.from;  // Acceder al número de teléfono desde el estado.

        console.log(`[HISTORY]:`, newHistory);

        newHistory.push({
            role: 'user',
            content: ctx.body
        });

        // Verificar si el usuario ya está registrado en la base de datos
        const existingUser = await User.findOne({
            where: {
                name,
                phoneNumber,
            },
        });

        if (!existingUser) {
            // Si el usuario no está registrado, agregarlo a la base de datos
            await User.create({
                name,
                phoneNumber,
            });
        }

        const largeResponse = await run(name, phoneNumber, newHistory);
        const chunks = largeResponse.split(/(?<!\d)\.\s+/g);

        for (const chunk of chunks) {
            await flowDynamic(chunk);
            await delay(5000); // Pausa de 3 segundos entre cada mensaje
        }

        newHistory.push({
            role: 'assistant',
            content: largeResponse
        });

        await state.update({ history: newHistory });

    } catch (err) {
        console.log(`[ERROR]:`, err);
    }
});

// Función para pausar el proceso durante un número específico de milisegundos
async function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
