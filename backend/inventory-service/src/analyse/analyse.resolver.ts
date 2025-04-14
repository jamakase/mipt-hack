import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { Args, Field, ObjectType, Query, Resolver } from "@nestjs/graphql";
import { firstValueFrom } from 'rxjs';

@ObjectType()
export class Progress {

    @Field(type => String)
    s2t: string;
    @Field(type => String)
    summarize: string;
    @Field(type => String)
    terms: string;
    @Field(type => String)
    llm: string;
}

@ObjectType()
export class Analyse {
    @Field(type => String)
    id: string

    @Field(type => Progress)
    progress: Progress
}

@Resolver(of => Analyse)
export class AnalyseResolver {

    private readonly workerUrl: string;
    constructor(
        private readonly config: ConfigService,
        private readonly httpService: HttpService

    ) {
        this.workerUrl = this.config.get('worker').url
    }

    @Query(returns => Analyse)
    async analyse(@Args('id', { type: () => String }) id: string) {
        const response = await firstValueFrom(this.httpService.get(`${this.workerUrl}/tasks${id}`));
        if (response.status == 200) {
            const analyse = new Analyse()
            const progress = new Progress()
            progress.s2t = response.data?.s2t || 'PENDING' 
            progress.summarize = response.data?.summarize || 'PENDING' 
            progress.terms = response.data?.terms || 'PENDING' 
            progress.llm = response.data?.llm || 'PENDING' 
            analyse.progress = progress
            analyse.id = response.data.task_id
            return analyse
        }
        throw Error()
    }
}