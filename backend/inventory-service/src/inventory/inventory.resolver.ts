import { Args, Field, Float, Int, ObjectType, Query, Resolver } from "@nestjs/graphql";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Lecture as LectureEntity } from "./inventory.entity";

@ObjectType()
export class File {
    @Field(type => String)
    id: string

    @Field(type => Date)
    uploadedAt: Date;

    @Field(type => String)
    originalName: string;

    @Field(type => String)
    path: string;
}


@ObjectType()
export class TextChunk {
    @Field(type => String)
    id: string

    @Field(type => Float)
    from: number;
    
    @Field(type => Float)
    to: number;
    
    @Field(type => Int)
    order: number;
    
    @Field(type => String)
    content: string
}


@ObjectType()
export class GlossaryItem {
    @Field(type => String)
    id: string

    @Field(type => String)
    term: string;

    @Field(type => String)
    meaning: string;
}

@ObjectType()
export class Glossary {
    @Field(type => String)
    id: string

    @Field(type => Date)
    createdAt: Date;

    @Field(type => [GlossaryItem], { nullable: true })
    items?: [GlossaryItem];
}

@ObjectType()
export class Lecture {
    @Field(type => String)
    id: string;

    @Field({ nullable: false })
    lectureName: string;

    @Field({ nullable: true })
    summarizedDescription?: string;

    @Field(type => Date)
    createdAt: Date;

    @Field(type => File, { nullable: true })
    file?: File;

    @Field(type => Glossary, { nullable: true })
    glossary?: Glossary;

    @Field(type => [TextChunk], {nullable: true})
    textChunks: [TextChunk]
}


@Resolver(of => Lecture)
export class LectureResolver {

    constructor(@InjectRepository(LectureEntity) private readonly lectureRepository: Repository<LectureEntity>) { }

    @Query(returns => Lecture)
    async lecture(@Args('id', { type: () => String }) id: string) {
        const lecture = await this.lectureRepository.findOne({
            where: {
                id
            },
            relations: {
                file: true,
                glossary: {
                    items: true
                },
                textChunks: true,
                text: true
            }
        })
        return lecture;
    }

    @Query(returns => [Lecture])
    async lectures(
        @Args('offset', { type: () => Int, defaultValue: 0 }) offset: number,
        @Args('size', { type: () => Int, defaultValue: 0 }) size: number,
        @Args('sort', {type:() => String, defaultValue: "DESC"}) sort: 'DESC' | 'ASC'
    ) {
        const lecture = await this.lectureRepository.find({
            relations: {
                file: true,
                glossary: {
                    items: true
                },
                textChunks: true,
                text: true
            },
            order: {
                createdAt: sort
            }
        })
        return lecture;
    }
} 
