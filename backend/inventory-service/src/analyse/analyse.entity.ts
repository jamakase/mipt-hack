import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, Relation } from "typeorm";

@Entity({
    name: 'analyse'
})
export class Analyse {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({
        name: 'created_at',
        type: 'timestamp with time zone',
        nullable: false
    })
    startedAt: Date;

    @Column({
        name: 'lecture_id',
        nullable: false
    })
    lectureId: string;

    @OneToMany(m => AnalyseJob, m => m.analyse, {
        cascade: true
    })
    jobs: Relation<AnalyseJob[]>;
}

@Entity({
    name: 'analyse_job'
})
export class AnalyseJob {
    @PrimaryColumn({
        type: 'int8'
    })
    id: number;

    @JoinColumn({
        name: 'analyse_id'
    })
    @ManyToOne(j => Analyse, j => j.jobs, {
        orphanedRowAction: 'delete'
    })
    analyse: Analyse;
}