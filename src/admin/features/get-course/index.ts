import { z } from "zod"
import { IUseCase, IController } from "domain-utilities"
import { Repository } from "typeorm"
import { Course } from "../../infra/database/entities/course";


interface GetCourseRequest {
    id: string,
}

type GetCourseResponse = { name: string } | null

interface IGetCourseUC extends IUseCase<GetCourseRequest, GetCourseResponse> { }

export class GetCourseService implements IGetCourseUC {

    constructor(private readonly repo: Repository<Course>) { }

    async execute(request: GetCourseRequest) {
        const { id } = request;

        const course = await this.repo.findOne({ where: { id } })

        if (!course) {
            console.log(`Did not find Course with id ${id}!`)
        } else {
            console.log(`Found Course with name ${course.name}!`)

        }

        return course ? { name: course.name } : null
    }
}

const schema = z.object({
    id: z.string().uuid()
})

interface IGetCourseController extends IController<Request, Response> { }

export class GetCourseController implements IGetCourseController {

    constructor(private readonly service: GetCourseService) { }

    execute(request: Request): Response | Promise<Response> {
        const { body } = request

        const data = schema.parse(body)

        this.service.execute(data)

        return new Response()
    }
}