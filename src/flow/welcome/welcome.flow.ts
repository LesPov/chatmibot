import BotWhatsapp from '@bot-whatsapp/bot';
import { ChatCompletionMessageParam } from 'openai/resources';
import { run } from 'src/services/openai';

/**
 * Un flujo conversacion que es por defecto cunado no se contgiene palabras claves en otros flujos
 */
export default BotWhatsapp.addKeyword(BotWhatsapp.EVENTS.WELCOME)

    .addAction(async (ctx, { flowDynamic, state }) => {
        try {
            const newHistory = (state.getMyState()?.history ?? []) as ChatCompletionMessageParam[]
            const name = ctx?.pushName ?? ''

            console.log(`[HISTORY]:`, newHistory)

            newHistory.push({
                role: 'user',
                content: ctx.body
            })

            const ai = await run(name, newHistory)

            await flowDynamic(ai)


            newHistory.push({
                role: 'assistant',
                content: ai
            })

            await state.update({ history: newHistory })

        } catch (err) {
            console.log(`[ERROR]:`, err)
        }
    })

