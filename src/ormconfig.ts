import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

export const connectionSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'admin',
  database: 'inar_cv',
  entities: ['src/**/**.entity{.ts,.js}'],
  migrationsTableName: '_migrations',
  //synchronize: Boolean(process.env.POSTGRES_SYNCHRONIZE),
  migrations: ['dist/migrations/*{.ts,.js}'],
});
