import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SeriesModule } from './series/series.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReleasesModule } from './releases/releases.module';

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
  }), SeriesModule, ReleasesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
