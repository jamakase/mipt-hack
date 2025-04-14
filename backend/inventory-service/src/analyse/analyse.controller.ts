import { Controller, Get, Inject, Param, Post, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AnalyseService } from './analyse.service';
import { randomUUID } from 'crypto';

@Controller('analyse')
export class AnalyseController {

    constructor(
        private readonly analyseService: AnalyseService
        ) { }

    @Post('lecture/:id')
    async analyse(@Param('id') id: string): Promise<string> {
        return await this.analyseService.analyse(id);
    }


    @Get(':id/progress')
    async progress(@Param('id') id: string) {
        return await this.analyseService.progress(id)
    }

}
