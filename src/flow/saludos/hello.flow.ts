import BotWhatsapp from '@bot-whatsapp/bot'

/**
 * Un flujo conversacion que responder a las palabras claves "hola", "buenas", ...
 */
export default BotWhatsapp.addKeyword(['hola', 'buenas'])
    .addAnswer('Un gusto tenerte de nuevo ¿En qué puedo ayudarte con tus cesantías?😊')
