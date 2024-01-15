import { faker } from "@faker-js/faker";
import { container } from "tsyringe";
import { describe, expect, it } from "vitest";

import { prisma } from "@/infra/db/prisma";

import { CreateCourseService } from ".";

describe("Create Course Feature", () => {
  const sut_service = container.resolve(CreateCourseService);

  it("should create a course", async () => {
    const request = {
      name: faker.person.fullName(),
    };

    await sut_service.execute(request);

    const course_found = await prisma.course.findUnique({
      where: { name: request.name },
    });

    expect(course_found).toBeDefined();
    expect(course_found?.name).toBe(request.name);
    expect(course_found?.id).toBeTypeOf("string");
  });
});
