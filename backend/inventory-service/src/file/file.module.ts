import { DynamicModule, Module } from '@nestjs/common';
import { FileService } from './file.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadedFile } from './file.entity';

@Module({})
export class FileModule {
  static register(config: FileModuleConfig): DynamicModule {
    return {
      module: FileModule,
      imports: [
        TypeOrmModule.forFeature([UploadedFile])
      ],
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: config,
        },
        FileService
      ],
      exports: [FileService],
    };
  }
}

export interface FileModuleConfig {
  dest: string
}

export const CONFIG_OPTIONS = 'CONFIG_OPTIONS';
