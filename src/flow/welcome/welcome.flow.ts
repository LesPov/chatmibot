import BotWhatsapp from '@bot-whatsapp/bot';
import { ChatCompletionMessageParam } from 'openai/resources';
import { run } from 'src/services/openai';

/**
 * Un flujo conversacion que es por defecto cunado no se contgiene palabras claves en otros flujos
 */
// ... (otros imports)

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

            const largeResponse = await run(name, phoneNumber, newHistory);
            const chunks = largeResponse.split(/(?<!\d)\.\s+/g);

            for (const chunk of chunks) {
                await flowDynamic(chunk);
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


