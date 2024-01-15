import "reflect-metadata";

import { PrismaClient } from "@prisma/client";
import { container } from "tsyringe";
import { afterAll, beforeAll } from "vitest";

import { prisma } from "@/infra/db/prisma";

container.register<PrismaClient>("PrismaClient", {
  useValue: prisma,
});

beforeAll(async () => {
  await prisma.user.deleteMany();
  await prisma.course.deleteMany();
});

afterAll(async () => {
  await prisma.user.deleteMany();
  await prisma.course.deleteMany();
});
