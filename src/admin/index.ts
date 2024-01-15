import "reflect-metadata"

import Express, { Request, Response } from "express"
import { DataSource, EntityManager, Repository } from "typeorm"
import { CreateCourseController, CreateCourseService } from "../admin/features/create-course"
import { GetCourseController, GetCourseService } from "../admin/features/get-course"
import { Course } from "./infra/database/entities/course"
import { IController } from "domain-utilities"
import { EnrollController, EnrollService } from "./features/enroll"
import { User } from "./infra/database/entities/user"

class ExpressControllerAdapter {
    constructor(private readonly controller: IController<any, any>) { }

    async execute(req: Request, res: Response) {
        const response = await this.controller.execute(req)
        res.json(response.body)
    }
}

async function main() {
    const data_source = await new DataSource({
        type: "sqlite",
        database: "database/data",
        entities: [Course, User],
        dropSchema: true,
        synchronize: true
    }).initialize()


    const manager = new EntityManager(data_source)

    const course_repo = new Repository(Course, manager)
    const user_repo = new Repository(User, manager)

    const create_course_service = new CreateCourseService(course_repo)
    const create_course_controller = new ExpressControllerAdapter(new CreateCourseController(create_course_service))

    const get_course_service = new GetCourseService(course_repo)
    const get_course_controller = new ExpressControllerAdapter(new GetCourseController(get_course_service))

    const enroll_service = new EnrollService(course_repo, user_repo)
    const enroll_controller = new ExpressControllerAdapter(new EnrollController(enroll_service))

    const app = Express()

    app.use(Express.json())

    app.post("/course", (req, res) => create_course_controller.execute(req, res))
    app.get("/course", (req, res) => get_course_controller.execute(req, res))
    app.post("/enroll", (req, res) => enroll_controller.execute(req, res))

    app.listen(3000, () => {
        console.log(`listening at port 3000`)
    })
}

main()