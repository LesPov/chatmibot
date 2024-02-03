import BotWhatsapp from '@bot-whatsapp/bot'
import helloFlow from './saludos/hello.flow'
import welcomeFlow from './welcome/welcome.flow'

export default BotWhatsapp.createFlow([
    helloFlow,
    welcomeFlow
])
