import BotWhatsapp from '@bot-whatsapp/bot'
import helloFlow from './saludos/hello.flow'

export default BotWhatsapp.createFlow([
    helloFlow
])
