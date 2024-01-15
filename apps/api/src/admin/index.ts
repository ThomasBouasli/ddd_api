import "reflect-metadata";

import { PrismaClient } from "@prisma/client";
import Express from "express";
import { container } from "tsyringe";

import { CreateCourseControllerExpress } from "@/admin/features/create-course";
import { prisma } from "@/infra/db/prisma";

container.register<PrismaClient>("PrismaClient", {
  useValue: prisma,
});

const create_course_controller = container.resolve(
  CreateCourseControllerExpress,
);

const app = Express();

app.use(Express.json());

app.post("/course", (req, res) => create_course_controller.execute(req, res));

app.listen(3000, () => {
  console.log(`listening at port 3000`);
});
