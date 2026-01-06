import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SeriesModule } from './series/series.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReleasesModule } from './releases/releases.module';
import { CategoriesModule } from './categories/categories.module';
import { AuthorsModule } from './authors/authors.module';
import { GroupsModule } from './groups/groups.module';
import { PublishersModule } from './publishers/publishers.module';
import { GenresModule } from './genres/genres.module';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'postgres', 
    host: 'localhost', 
    port: 5433, 
    username: 'root', 
    password: '123456',
    database: 'postgres',
    autoLoadEntities: true,
    synchronize: true,
  }), SeriesModule, ReleasesModule, CategoriesModule, AuthorsModule, GroupsModule, PublishersModule, GenresModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
