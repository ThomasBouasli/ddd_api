import "reflect-metadata"

import Express, { Request, Response } from "express"
import { CreateCourseController, CreateCourseService } from "./features/create-course"
import { GetCourseController, GetCourseService } from "./features/get-course"
import { IController } from "domain-utilities"
import { EnrollController, EnrollService } from "./features/enroll"
import { prisma } from "../infra/db/prisma"

class ExpressControllerAdapter {
    constructor(private readonly controller: IController<any, any>) { }

    async execute(req: Request, res: Response) {
        const response = await this.controller.execute(req)
        res.json(response.body)
    }
}

async function main() {
    const create_course_service = new CreateCourseService(prisma)
    const create_course_controller = new ExpressControllerAdapter(new CreateCourseController(create_course_service))

    const get_course_service = new GetCourseService(prisma)
    const get_course_controller = new ExpressControllerAdapter(new GetCourseController(get_course_service))

    const enroll_service = new EnrollService(prisma)
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