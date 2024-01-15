import { z } from "zod"
import { IUseCase, IController, ApplicationError, DomainValidationError } from "domain-utilities"
import { Repository } from "typeorm"
import { Course } from "../../infra/database/entities/course";
import { User } from "../../infra/database/entities/user";


class EnrollDomainService {
    static execute(user: User, course: Course) {
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

    constructor(private readonly course_repo: Repository<Course>, private readonly user_repo: Repository<User>) { }

    async execute(request: EnrollRequest) {
        const { course_id, name } = request

        const course = await this.course_repo.findOne({ where: { id: course_id } })

        if (!course) {
            throw new ApplicationError("Could not find the course specified!")
        }

        let user = await this.user_repo.findOne({ where: { name }, relations: { courses: true } });

        if (!user) {
            user = this.user_repo.create({ name })
        }

        EnrollDomainService.execute(user, course)

        course.students = [user]

        await this.course_repo.save(course);

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