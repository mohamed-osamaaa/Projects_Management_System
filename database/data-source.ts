import { config } from 'dotenv';
import {
  DataSource,
  DataSourceOptions,
} from 'typeorm';

config();

export const dataSourceOptions: DataSourceOptions = {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [ 
        'src/**/*.entity.ts', 
        'dist/**/*.entity.js' 
    ],
    migrations: [ 
        'src/database/migrations/*.ts', 
        'dist/database/migrations/*.js' 
    ],
    synchronize: false,
};

const dataSource = new DataSource(dataSourceOptions);
dataSource.initialize();
export default dataSource;