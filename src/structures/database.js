const Sequelize = require('sequelize');
const { join } = require('path');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
	dialect: 'postgres',
	protocol: 'postgres',
	logging: false,
	operatorsAliases: false
});

sequelize.import(join(__dirname, '..', 'models', 'settings'));
sequelize.sync();

module.exports = sequelize;
