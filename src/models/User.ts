// models/User.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize'; // Importa la instancia de Sequelize

class User extends Model {
    additionalData(arg0: string, additionalData: any) {
        throw new Error("Method not implemented.");
    }
    public id!: number;
    public name!: string;
    public phoneNumber!: string;

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
    },
    {
        tableName: 'users', // Nombre de la tabla en la base de datos
        sequelize,
    }
);

export default User;
