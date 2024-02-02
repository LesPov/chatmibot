import BotWhatsapp from '@bot-whatsapp/bot'
import MockAdapter from '@bot-whatsapp/database/mock'
import ProviderWS from '@bot-whatsapp/provider/baileys'
import database from './database'
import provider from './provider'
import flow from './flow'



/**
 * Funcion principal del bot
 */
const main = async () => {

    await BotWhatsapp.createBot({
        database,
        provider,
        flow

    })

}

main()