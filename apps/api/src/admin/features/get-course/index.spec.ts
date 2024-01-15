import { faker } from "@faker-js/faker";
import { container } from "tsyringe";
import { describe, expect, it } from "vitest";

import { prisma } from "@/infra/db/prisma";

import { GetCourseService } from ".";

describe("GetCourse Feature", () => {
  const sut_service = container.resolve(GetCourseService);

  it("should get a course by id", async () => {
    const course = await prisma.course.create({
      data: { id: faker.string.uuid(), name: faker.commerce.productName() },
    });

    const found_course = await sut_service.execute({ id: course.id });

    expect(found_course).toBeDefined();
    expect(found_course?.name).toBe(course.name);
  });

  it("should not get a course by id if it does not exist", async () => {
    const found_course = await sut_service.execute({ id: faker.string.uuid() });

    expect(found_course).toBeDefined();
  });
});
