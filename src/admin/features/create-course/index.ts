import { z } from "zod"
import { IUseCase, IController } from "domain-utilities"
import { Repository } from "typeorm"
import { Course } from "../../infra/database/entities/course";

interface CreateCourseRequest {
    name: string,
}

type CreateCourseResponse = void

interface ICreateCourseUC extends IUseCase<CreateCourseRequest, CreateCourseResponse> { }

export class CreateCourseService implements ICreateCourseUC {

    constructor(private readonly repo: Repository<Course>) { }

    async execute(request: CreateCourseRequest) {
        const { name } = request;

        const course = this.repo.create({ name })

        await this.repo.save(course)

        console.log(`Created Course with name ${name} and id ${course.id}!`)
    }
}

const schema = z.object({
    name: z.string()
})

interface ICreateCourseController extends IController<Request, Response> { }

export class CreateCourseController implements ICreateCourseController {

    constructor(private readonly service: CreateCourseService) { }

    execute(request: Request): Response | Promise<Response> {
        const { body } = request

        const data = schema.parse(body)

        this.service.execute(data)

        return new Response()
    }
}