import BotWhatsapp from '@bot-whatsapp/bot';
import { generatePromptDetermine } from 'src/services/openai/proms/prompt';

/**
 * Un flujo conversacion que responder a las palabras claves "hola", "buenas", ...
 */
export default BotWhatsapp.addKeyword(['hola', 'buenas'])
    .addAnswer('Un gusto tenerte de nuevo mi nombre es Santiago Laverde ¿En qué puedo ayudarte con tus cesantías?😊 ')
