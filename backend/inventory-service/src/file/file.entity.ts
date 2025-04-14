import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: 'uploaded_file'
})
export class UploadedFile {
    @Column({ primary: true})
    id: string;

    @Column({
        name: 'uploaded_at',
        type: 'timestamp with time zone',
        nullable: false
    })
    uploadedAt: Date;

    @Column({
        nullable: false,
        name: 'original_name'
    })
    originalName: string;

    @Column({
        nullable: false
    })
    path: string;
}