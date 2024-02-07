// index.ts
import "dotenv/config"
import BotWhatsapp from '@bot-whatsapp/bot'
import database from './database/databaseConfig'
import provider from './provider'
import flow from './flow'

/**
 * Funcion principal del bot
 */
import User from './models/User'; // Importa el modelo User

const main = async () => {
  try {
    // Sincroniza el modelo User con la base de datos
    await User.sync();

    // Crea el bot con la configuración
    await BotWhatsapp.createBot({
      database,
      provider,
      flow
    });

  } catch (error) {
    console.error('Error al sincronizar la base de datos:', error);
  }
}

main();