import { describe, expect, it } from "vitest"
import { faker } from "@faker-js/faker"
import { CreateCourseService } from "."
import { prisma } from "../../../infra/db/prisma"

describe("Create Course Feature", () => {
    const sut_service = new CreateCourseService(prisma)

    it("should create a course", async () => {
        const request = {
            name: faker.person.fullName()
        }

        await sut_service.execute(request)

        const course_found = await prisma.course.findUnique({ where: { name: request.name } })

        expect(course_found).toBeDefined()
        expect(course_found?.name).toBe(request.name)
        expect(course_found?.id).toBeTypeOf("string")
    })
})