const { DataSource } = require('typeorm');
const url = require('url');
require('dotenv/config');

const jawsDbUrl = process.env.DB_HOST;

let dataSourceConfig;

if (jawsDbUrl !== 'mysql' && jawsDbUrl !== 'localhost') {
  const dbUrl = url.parse(jawsDbUrl);
  const [username, password] = dbUrl.auth.split(':');
  dataSourceConfig = {
    type: 'mysql',
    host: dbUrl.hostname,
    port: parseInt(dbUrl.port, 10),
    username,
    password,
    database: dbUrl.pathname.substring(1),
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/migrations/*.ts'],
    synchronize: false,
  };
} else {
  dataSourceConfig = {
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/migrations/*.ts'],
    synchronize: false,
  };
}

const AppDataSource = new DataSource(dataSourceConfig);
module.exports = AppDataSource;
