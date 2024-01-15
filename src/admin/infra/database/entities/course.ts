import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from "typeorm"
import { User } from "./user"

@Entity()
export class Course {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    name: string

    @ManyToMany(() => User, users => users.courses, { cascade: true })
    students: User[]
}
