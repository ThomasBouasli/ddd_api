import "reflect-metadata";

import { PrismaClient } from "@prisma/client";
import Express from "express";
import { container } from "tsyringe";

import { CreateCourseControllerExpress, EnrollControllerExpress, GetCourseControllerExpress } from "@/admin/features";
import { prisma } from "@/infra/db/prisma";

container.register<PrismaClient>("PrismaClient", {
  useValue: prisma,
});

const create_course_controller = container.resolve(
  CreateCourseControllerExpress,
);

const get_course_controller = container.resolve(
  GetCourseControllerExpress,
);

const enroll_controller = container.resolve(
  EnrollControllerExpress,
);

const app = Express();

app.use(Express.json());

app.post("/course", (req, res) => create_course_controller.execute(req, res));
app.get("/course", (req, res) => get_course_controller.execute(req, res));
app.post("/enroll", (req, res) => enroll_controller.execute(req, res));

app.listen(3000, () => {
  console.log(`listening at port 3000`);
});
