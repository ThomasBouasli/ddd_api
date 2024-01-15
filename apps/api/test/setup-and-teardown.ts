import "reflect-metadata";

import { afterAll, beforeAll } from "vitest";

import { prisma } from "@/infra/db/prisma";
import { container } from "tsyringe";
import { PrismaClient } from "@prisma/client";


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
