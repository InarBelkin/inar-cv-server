import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagsModule } from './tags/tags.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from './LoggerMiddleware';
import { RolesModule } from './roles/roles.module';
import { MailModule } from './mail/mail.module';
import { CommentsModule } from './comments/comments.module';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB_NAME,
      entities: [],
      autoLoadEntities: true,
      migrations: [join(__dirname, './migrations/{.ts,*.js}')],
      migrationsTableName: '_migrations',
      migrationsRun: Boolean(process.env.POSTGRES_MIGRATIONS_RUN),
      synchronize: false,
    }),
    PostsModule,
    TagsModule,
    UsersModule,
    AuthModule,
    RolesModule,
    MailModule,
    CommentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('auth');
  }
}
