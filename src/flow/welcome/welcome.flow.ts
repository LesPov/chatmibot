import BotWhatsapp from '@bot-whatsapp/bot';
import { ChatCompletionMessageParam } from 'openai/resources';
import GoogleSheetsController from 'src/controllers/GoogleSheetsController';
import User from 'src/models/User';
import { run, runDetermine } from 'src/services/openai';

export default BotWhatsapp.addKeyword(BotWhatsapp.EVENTS.WELCOME)
    .addAction(async (ctx, { flowDynamic, state }) => {
        try {
            const history = (state.getMyState()?.history ?? []) as ChatCompletionMessageParam[];

            const fondoEncontrado = await runDetermine(history);
            console.log(`[QUE FONDO ESTA:`, fondoEncontrado.toLowerCase());

            if (fondoEncontrado.toLowerCase().includes('unknown')) {
                // Manejar el caso cuando no se puede determinar el fondo de cesantías
                return;
            }

            const phoneNumber = ctx.from;
            let user = await User.findOne({ where: { phoneNumber } });

            if (!user) {
                const name = ctx?.pushName ?? '';
                user = await User.create({ name, phoneNumber, fondoCesantias: fondoEncontrado });
            } else if (user.fondoCesantias && !user.fondoCesantias.toLowerCase().includes('unknown')) {
                // El usuario ya tiene un fondo de cesantías registrado, no es necesario enviar a Google Sheets nuevamente.
                return;
            }

            user.fondoCesantias = fondoEncontrado;
            await user.save();

            // Guardar en Google Sheets
            await GoogleSheetsController(user.id, user.name, user.phoneNumber, fondoEncontrado);

        } catch (err) {
            console.log(`[ERROR]:`, err);
            return;
        }
    })
    .addAction(async (ctx, { flowDynamic, state }) => {
        let fondoEncontrado;  // Declarar la variable fuera del bloque try-catch

        try {
            const newHistory = (state.getMyState()?.history ?? []) as ChatCompletionMessageParam[];
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
                await GoogleSheetsController(user.id, name, phoneNumber, fondoEncontrado);
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