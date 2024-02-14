import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize'; // Importa la instancia de Sequelize

class User extends Model {
    declare  id: number;
    declare  name: string;
    declare  phoneNumber: string;
    declare fondoCesantias: string; // Nuevo campo

    // Constructor para evitar la advertencia de campos públicos de clase
    constructor(values?: Record<string, unknown>, options?: Record<string, unknown>) {
        super(values, options);
    }
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        fondoCesantias: { // Definición del nuevo campo
            type: DataTypes.STRING,
            allowNull: true, // Dependiendo de si el cliente proporciona esta información
        },
    },
    {
        tableName: 'users', // Nombre de la tabla en la base de datos
        sequelize,
    }
);

export default User;
