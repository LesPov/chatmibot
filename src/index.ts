// index.ts
import "dotenv/config"
import BotWhatsapp from '@bot-whatsapp/bot'
import database from './database/databaseConfig'
import flow from './flow'
import User from './models/User';
import express from 'express';
import { exportToExcel } from './controllers/exportToExcel';
import provider from "./provider";

const app = express();// Dentro de tu main en index.ts
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
    console.log('Bot creado exitosamente.');

  } catch (error) {
    console.error('Error al sincronizar la base de datos o crear el bot:', error);
  }
}


main();
// Ruta para exportar a Excel
app.get('/exportToExcel', exportToExcel);

app.listen(3000, () => {
  console.log('Servidor iniciado en el puerto 3000');
});
