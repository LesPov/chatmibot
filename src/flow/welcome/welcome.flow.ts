import BotWhatsapp from '@bot-whatsapp/bot';
import { ChatCompletionMessageParam } from 'openai/resources';
import GoogleSheetsController from 'src/controllers/GoogleSheetsController';
import User from 'src/models/User';
import { run, runDetermine } from 'src/services/openai';

export default BotWhatsapp.addKeyword(BotWhatsapp.EVENTS.WELCOME)
    .addAction(async (ctx, {state}) => {
        try {
            const history = (state.getMyState()?.history ?? []) as ChatCompletionMessageParam[]
            const ai = await runDetermine(history)

            console.log(`[EN QUE FONDO ESTA:`,ai.toLowerCase())

            if(ai.toLocaleLowerCase().includes('unknown')){
                return
            }

        } catch (err) {
            console.log(`[ERROR]:`, err)
            return
        }

    })

    .addAction(async (ctx, { flowDynamic, state }) => {
        try {
            const newHistory = (state.getMyState()?.history ?? []) as ChatCompletionMessageParam[]
            const name = ctx?.pushName ?? '';
            const phoneNumber = ctx.from;  // Acceder al número de teléfono desde el estado.
            console.log(`[HISTORY]:`, newHistory);
            newHistory.push({
                role: 'user',
                content: ctx.body
            });

            // Verificar si el usuario ya existe en la base de datos
            let user = await User.findOne({ where: { phoneNumber } });
            if (!user) {
                // Crear el usuario si no existe
                user = await User.create({ name, phoneNumber });
                // Enviar los datos a Google Sheets solo si el usuario no está registrado previamente
                await GoogleSheetsController(user.id, name, phoneNumber);
            }

            const largeResponse = await run(name, phoneNumber, newHistory);
            const chunks = largeResponse.split(/(?<!\d)\.\s+/g);
            for (const chunk of chunks) {
                await flowDynamic(chunk);
                await delay(5000); // Pausa de 5 segundos entre cada mensaje
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