import { HttpException, Injectable, Logger } from '@nestjs/common';
import { Glossary, GlossaryItem, Lecture, LectureText, LectureTextChunk } from './inventory.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { FileService } from 'src/file/file.service';
import { Page, Pageable } from 'src/commons/page';

@Injectable()
export class InventoryService {

    private readonly logger = new Logger(InventoryService.name);

    constructor(
        private readonly fileService: FileService,
        @InjectRepository(Lecture) private readonly lectureRepository: Repository<Lecture>,
        @InjectRepository(LectureText) private readonly lectureTextRepository: Repository<LectureText>,
        @InjectRepository(Glossary) private readonly glossaryRepository: Repository<Glossary>,
        @InjectRepository(GlossaryItem) private readonly glossaryItemRepository: Repository<GlossaryItem>,
    ) { }

    async createLecture(
        name: string,
        file: Express.Multer.File): Promise<Lecture> {
        this.logger.debug(`Creating lecture::${name}...`);
        const lecture = new Lecture();
        lecture.createdAt = new Date()
        lecture.lectureName = name;
        if (file) {
            lecture.file = await this.fileService.saveFile(file.buffer, name, file.originalname, "mp3");
        }
        return await this.lectureRepository.save(lecture);
    }

    async listLecturepage(pageable: Pageable): Promise<Page<Lecture>> {
        const [result, total] = await this.lectureRepository.findAndCount({
            order: { createdAt: pageable.sort },
            take: pageable.size,
            skip: pageable.offset,
            relations: {
                file: true,
                glossary: {
                    items: true
                }
            }
        })

        return {
            content: result,
            total
        }
    }

    async getLectureById(id: string): Promise<Lecture> {
        return this.lectureRepository.findOne({
            where: {
                id
            },
            relations: {
                file: true,
            }
        })
    }

    async createLectureTextChunks(lectureId: string, chunks: {content:string, from: number, to: number}[]): Promise<Lecture> {
        this.logger.debug(`Saving chunks for lecture::${lectureId}...`)

        if (await this.lectureRepository.exist({
            where: {
                id: lectureId
            }
        })) {
            const lecture = await this.lectureRepository.findOne({
                where: {
                    id: lectureId
                },
                relations: {
                    text: true,
                }
            });
            if (lecture.text) {
                await this.lectureTextRepository.delete(lecture.text)
                lecture.text = null;
            }


            const lectureText: LectureText = new LectureText();
            lectureText.createdAt = new Date();
            lectureText.content =  chunks.map(c => c.content).join();
            lectureText.lecture = lecture;
            lecture.textChunks = chunks.map((c, i) => {
                const chunk = new LectureTextChunk();
                chunk.order = i;
                chunk.from = c.from || 0;
                chunk.to = c.to || 0;
                chunk.content = c.content;
                chunk.lecture = lecture;
                return chunk;
            });
            lecture.text = lectureText;
            const lectResult = await this.lectureRepository.save(lecture);
            this.logger.debug(`Chunks for lecture::${lectureId} were saved`)
            return lectResult
        } else {
            throw new HttpException(`Lecture::${lectureId} was not found`, 404);
        }
    }
    async updateLectureSumm(lectureId: string, summ: string): Promise<Lecture> {
        this.logger.debug(`Updating lecture`)

        if (await this.lectureRepository.exist({
            where: {
                id: lectureId
            }
        })) {
            const lecture = await this.lectureRepository.findOne({
                where: {
                    id: lectureId
                },
                relations: {
                    text: true,
                }
            });
            lecture.summarizedDescription = summ;
            const lectResult = await this.lectureRepository.save(lecture);
            this.logger.debug(`Summirized description::${lectureId} were saved`)
            return lectResult
        } else {
            throw new HttpException(`Lecture::${lectureId} was not found`, 404);
        }
    }

    async createGlossary(lectureId: string, items: {term: string, meaning: string}[]): Promise<Glossary> {
        const lecture = await this.lectureRepository.findOne({
            where: {
                id: lectureId
            },
            relations: {
                glossary: true
            }
        });
        if (!lecture) {
            throw new HttpException('NOT FOUND', 404);
        }
        if (lecture.glossary) {
            await this.glossaryRepository.delete(lecture.glossary);
        }

        const glossary = new Glossary();
        lecture.glossary = glossary;
        glossary.lecture = lecture;
        glossary.createdAt = new Date();
        return await this.glossaryRepository.save(glossary)
    }
    async updateGlossary(lectureId: string, items: {term: string, meaning: string}[]): Promise<void> {
        const lecture = await this.lectureRepository.findOne({
            where: {
                id: lectureId
            },
            relations: {
                glossary: true
            }
        });
      if (!lecture) {
        throw new HttpException('NOT FOUND', 404);
      }
      const glossaryItems = items.map(i => {
        const item = new GlossaryItem();
        item.term = i.term;
        item.meaning = i.meaning;
        item.glossary = lecture.glossary;

        return item;
      })
      await this.glossaryItemRepository.save(glossaryItems);
    }

    async createGlossaryItem(glossaryId: string, term: string, meaning: string): Promise<GlossaryItem> {
        const glossary = await this.glossaryRepository.findOne({
            where: {
                id: glossaryId
            }
        });
        if (!glossary) {
            throw new HttpException('NOT FOUND', 404);
        }
        const item = new GlossaryItem();
        item.term = term;
        item.meaning = meaning;
        item.glossary = glossary;
        return await this.glossaryItemRepository.save(item);
    }

    async updateGlossaryItem(glossaryId: string, itemid: string, term: string, meaning: string): Promise<GlossaryItem> {
        const item = await this.glossaryItemRepository.findOne({
            where: {
                id: itemid,
                glossary: {
                    id: glossaryId
                }
            }
        });
        if (!item) {
            throw new HttpException('NOT FOUND', 404);
        }
        item.term = term;
        item.meaning = meaning;
        return await this.glossaryItemRepository.save(item);
    }

    async deleteGlossaryItem(glossaryId: string, itemid: string) {
        const item = await this.glossaryItemRepository.findOne({
            where: {
                id: itemid,
                glossary: {
                    id: glossaryId
                }
            }
        });
        if (!item) {
            throw new HttpException('NOT FOUND', 404);
        }
        await this.glossaryItemRepository.delete(item);
    }
}
