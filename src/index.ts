import BotWhatsapp from '@bot-whatsapp/bot'
import MockAdapter from '@bot-whatsapp/database/mock'
import ProviderWS from '@bot-whatsapp/provider/baileys'


const flujoDeSaludar = BotWhatsapp.addKeyword(['hola', 'buenas'])
    .addAnswer('Bienvenido a mi chatbot para marihuanos')
/**
 * Funcion principal del bot
 */
const main = async () => {

    await BotWhatsapp.createBot({
        database: new MockAdapter(),
        flow: BotWhatsapp.createFlow([flujoDeSaludar]),
        provider: BotWhatsapp.createProvider(ProviderWS)
    })

}

main()