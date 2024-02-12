import axios from 'axios';

// Controlador para manejar el envío de datos a Google Sheets
const GoogleSheetsController = async (id: number, name: string, phoneNumber: string) => {
  try {
    // URL de la API de Google Sheets
    const url = 'https://sheet.best/api/sheets/d9ae0d9d-97e9-410c-b9a4-019aba25253d';

    // Realizar una consulta a la hoja de cálculo para verificar si el usuario ya está registrado
    const response = await axios.get(url, {
      params: {
        query: `SELECT * WHERE id='${id}' AND phoneNumber='${phoneNumber}'`
      }
    });

    // Verificar si la consulta fue exitosa y si el usuario ya está registrado
    if (response.status === 200 && response.data.length > 0) {
      console.log(`El usuario con ID ${id} y número de teléfono ${phoneNumber} ya está registrado en Google Sheets.`);
      return true; // No es necesario enviar datos, el usuario ya está registrado
    }

    // Si el usuario no está registrado, enviar los datos a Google Sheets
    const data = {
      id: id,
      name: name,
      phoneNumber: phoneNumber
    };

    // Configuración de la solicitud HTTP
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    // Realizar la solicitud POST a la API de Google Sheets
    await axios.post(url, data, config);
    
    console.log('Datos enviados correctamente a Google Sheets.');
    return true; // Envío exitoso

  } catch (error) {
    console.error('Error al enviar datos a Google Sheets:', error);
    return false; // Envío fallido
  }
};

export default GoogleSheetsController;
