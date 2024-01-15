import { PrismaClient } from "@prisma/client";
import { IController, IUseCase } from "domain-utilities";
import { inject, injectable } from "tsyringe";
import { z } from "zod";

import { ExpressControllerAdapter } from "@/infra/server/express-adapter";

interface CreateCourseRequest {
  name: string;
}

type CreateCourseResponse = void;

interface ICreateCourseUC
  extends IUseCase<CreateCourseRequest, CreateCourseResponse> {}

@injectable()
export class CreateCourseService implements ICreateCourseUC {
  constructor(@inject("PrismaClient") private readonly prisma: PrismaClient) {}

  async execute(request: CreateCourseRequest) {
    const { name } = request;

    const course = await this.prisma.course.create({ data: { name } });

    console.log(`Created Course with name ${name} and id ${course.id}!`);
  }
}

const schema = z.object({
  name: z.string(),
});

interface ICreateCourseController extends IController<Request, Response> {}

@injectable()
export class CreateCourseController implements ICreateCourseController {
  constructor(
    @inject("CreateCourseService")
    private readonly service: CreateCourseService,
  ) {}

  execute(request: Request): Response | Promise<Response> {
    const { body } = request;

    const data = schema.parse(body);

    this.service.execute(data);

    return new Response();
  }
}

@injectable()
export class CreateCourseControllerExpress extends ExpressControllerAdapter {
  constructor(
    @inject(CreateCourseController) controller: CreateCourseController,
  ) {
    super(controller);
  }
}
