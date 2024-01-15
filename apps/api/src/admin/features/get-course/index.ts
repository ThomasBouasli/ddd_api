import { PrismaClient } from "@prisma/client";
import { IController, IUseCase } from "domain-utilities";
import { inject, injectable } from "tsyringe";
import { z } from "zod";

interface GetCourseRequest {
  id: string;
}

type GetCourseResponse = { name: string } | null;

interface IGetCourseUC extends IUseCase<GetCourseRequest, GetCourseResponse> { }

@injectable()
export class GetCourseService implements IGetCourseUC {
  constructor(@inject("PrismaClient") private readonly prisma: PrismaClient) { }

  async execute(request: GetCourseRequest) {
    const { id } = request;

    const course = await this.prisma.course.findUnique({ where: { id } });

    if (!course) {
      console.log(`Did not find Course with id ${id}!`);
    } else {
      console.log(`Found Course with name ${course.name}!`);
    }

    return course ? { name: course.name } : null;
  }
}

const schema = z.object({
  id: z.string().uuid(),
});

interface IGetCourseController extends IController<Request, Response> { }

@injectable()
export class GetCourseController implements IGetCourseController {
  constructor(@inject("GetCourseService") private readonly service: GetCourseService) { }

  execute(request: Request): Response | Promise<Response> {
    const { body } = request;

    const data = schema.parse(body);

    this.service.execute(data);

    return new Response();
  }
}
