import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('teste_athenas', 'admin', '12345678', {
  host: 'database-athenas-teste.cse7s6m55guz.us-east-1.rds.amazonaws.com',
  dialect: 'mysql',
});

sequelize
  .authenticate()
  .then(() => console.log('Banco de dados conectado!'))
  .catch(() => {
    console.log('Erro na conexão com o banco de dados');
  });

export default sequelize;
