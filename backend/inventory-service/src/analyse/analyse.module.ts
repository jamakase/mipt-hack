import { DynamicModule, Module } from '@nestjs/common';
import { AnalyseController } from './analyse.controller';
import { AnalyseService } from './analyse.service';
import { InventoryModule } from 'src/inventory/inventory.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Analyse, AnalyseJob } from './analyse.entity';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { AnalyseResolver } from './analyse.resolver';
// file --> s2t (chunks) --> summarizator model + glossary model + ?llm
@Module({
  imports: [
    ConfigModule,
    HttpModule,
    TypeOrmModule.forFeature([Analyse, AnalyseJob]),
    InventoryModule,
  ],
  controllers: [AnalyseController],
  providers: [
    AnalyseService,
    AnalyseResolver
  ], 
  exports: [
    AnalyseResolver
  ]
})
export class AnalyseModule {
}
