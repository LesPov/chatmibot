import axios from 'axios';

const GoogleSheetsController = async (id: number, name: string, phoneNumber: string, fondoCesantias: string) => {
  try {
    if (!fondoCesantias || fondoCesantias.toLowerCase().includes('unknown')) {
      console.log(`No se envían datos a Google Sheets para ${name} con ID ${id} ya que el fondo de cesantías es desconocido.`);
      return false;
    }
    // URL de la API de Google Sheets
    const url = 'https://sheet.best/api/sheets/d9ae0d9d-97e9-410c-b9a4-019aba25253d';

    // Datos a enviar
    const data = {
      id: id,
      name: name,
      phoneNumber: phoneNumber,
      fondoCesantias: fondoCesantias // Agregar fondo de cesantías
    };

    // Configuración de la solicitud HTTP
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    // Realizar la solicitud POST a la API de Google Sheets
    await axios.post(url, data, config);
    
    console.log(`Datos de ${name} con ID ${id}, número de teléfono ${phoneNumber} y fondo de cesantías ${fondoCesantias} enviados correctamente a Google Sheets.`);
    return true; // Envío exitoso

  } catch (error) {
    console.error('Error al enviar datos a Google Sheets:', error);
    return false; // Envío fallido
  }
};

export default GoogleSheetsController;