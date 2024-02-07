import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: 'localhost',
  username: 'root',
  password: 'admin123',
  database: 'botprueba',
});

export default sequelize; // Exporta directamente el objeto sequelize
