import * as dotenv from 'dotenv';
import {
  DataSource,
  DataSourceOptions,
} from 'typeorm';

dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities:
    process.env.NODE_ENV === 'test' ? ['src/**/*.entity.ts'] : ['dist/**/*.entity.js'],
  migrations:
    process.env.NODE_ENV === 'test'
      ? []
      : ['dist/database/migrations/*.js'],
  synchronize: process.env.NODE_ENV === 'test' ? true : false,
  dropSchema: process.env.NODE_ENV === 'test' ? true : false,

};

const dataSource = new DataSource(dataSourceOptions);
// dataSource.initialize();
export default dataSource;