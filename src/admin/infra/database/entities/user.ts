import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from "typeorm"
import { Course } from "./course"

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ unique: true })
    name: string

    @ManyToMany(() => Course, course => course.students)
    @JoinTable()
    courses: Course[]
}
