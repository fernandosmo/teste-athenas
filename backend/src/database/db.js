import {} from 'dotenv/config';
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    timezone: '-03:00',
    dialectOptions: {
      useUTC: false,
    },
  }
);

sequelize
  .authenticate()
  .then(() => console.log('Banco de dados conectado!'))
  .catch(() => {
    console.log('Erro na conexão com o banco de dados');
  });

export default sequelize;
