import { z } from "zod"
import { IUseCase, IController, ApplicationError, DomainValidationError } from "domain-utilities"
import { User, Course, PrismaClient } from "@prisma/client"


class EnrollDomainService {
    static execute(user: User & { courses: Course[] }) {
        if (user?.courses?.length >= 3) {
            throw new DomainValidationError("User cannot be enrolled in 3 or more courses!")
        }
    }
}

interface EnrollRequest {
    name: string,
    course_id: string
}

type EnrollResponse = void

interface IEnrollUC extends IUseCase<EnrollRequest, EnrollResponse> { }

export class EnrollService implements IEnrollUC {

    constructor(private readonly prisma: PrismaClient) { }

    async execute(request: EnrollRequest) {
        const { course_id, name } = request

        const course = await this.prisma.course.findUnique({ where: { id: course_id } })

        if (!course) {
            throw new ApplicationError("Could not find the course specified!")
        }

        let user = await this.prisma.user.findUnique({ where: { name }, include: { courses: true } })

        if (!user) {
            user = await this.prisma.user.create({ data: { name }, include: { courses: true } })
        }

        EnrollDomainService.execute(user)


        await this.prisma.user.update({ where: { name }, data: { courses: { connect: { id: course_id } } } })

        console.log(`User ${user.name} enrolled into course ${course.name}`)
    }
}

const schema = z.object({
    name: z.string(),
    course_id: z.string().uuid()
})

interface IEnrollController extends IController<Request, Response> { }

export class EnrollController implements IEnrollController {

    constructor(private readonly service: EnrollService) { }

    execute(request: Request): Response | Promise<Response> {
        const { body } = request

        const data = schema.parse(body)

        this.service.execute(data)

        return new Response()
    }
}