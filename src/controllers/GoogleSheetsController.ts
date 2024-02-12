import axios from 'axios';

const GoogleSheetsController = async (id: number, name: string, phoneNumber: string) => {
  try {
    // URL de la API de Google Sheets
    const url = 'https://sheet.best/api/sheets/d9ae0d9d-97e9-410c-b9a4-019aba25253d';

    // Siempre intenta agregar el nuevo usuario a la hoja de cálculo sin verificar existencia
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
    
    console.log(`Datos de ${name} con ID ${id} y número de teléfono ${phoneNumber} enviados correctamente a Google Sheets.`);
    return true; // Envío exitoso

  } catch (error) {
    console.error('Error al enviar datos a Google Sheets:', error);
    return false; // Envío fallido
  }
};

export default GoogleSheetsController;
