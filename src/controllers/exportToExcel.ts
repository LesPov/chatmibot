import { Request, Response } from 'express';
import { writeFile, unlink } from 'fs/promises'; // Agrega unlink aquí
import { parse } from 'json2csv';
import ExcelJS from 'exceljs';
import User from 'src/models/User';

export const exportToExcel = async (req: Request, res: Response) => {
  try {
    // Obtener todos los usuarios de la base de datos
    const users = await User.findAll();

    // Convertir los datos a formato CSV
    const csv = parse(users.map(user => user.toJSON()));

    // Escribir los datos en un archivo CSV temporal
    await writeFile('usuarios.csv', csv, 'utf8');

    // Crear un nuevo workbook de Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Usuarios');

    // Agregar los datos del CSV al worksheet de Excel
    const csvData = csv.split('\n').map(row => row.split(','));
    worksheet.addRows(csvData);

    // Generar un nombre de archivo único
    const fileName = `usuarios_${new Date().toISOString()}.xlsx`;

    // Escribir el workbook en un archivo Excel
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    await workbook.xlsx.write(res);

    // Eliminar el archivo CSV temporal
    await unlink('usuarios.csv');
  } catch (error) {
    console.error('Error al exportar a Excel:', error);
    return res.status(500).json({ error: 'Error al exportar a Excel' });
  }
};
