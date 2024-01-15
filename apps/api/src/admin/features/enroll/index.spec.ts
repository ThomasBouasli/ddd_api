import { describe, expect, it } from "vitest"
import { faker } from "@faker-js/faker"
import { EnrollService } from "."
import { prisma } from "../../../infra/db/prisma"

describe("Enroll Feature", () => {
    const sut_service = new EnrollService(prisma)

    it("should enroll a user to a course", async () => {
        const request = {
            name: faker.person.fullName(),
            course_id: faker.string.uuid()
        }

        const course = await prisma.course.create({ data: { id: request.course_id, name: faker.commerce.productName() } })

        await sut_service.execute(request)

        const user_found = await prisma.user.findUnique({ where: { name: request.name }, include: { courses: true } })

        expect(user_found).toBeDefined()
        expect(user_found?.courses).toContainEqual(course)
        expect(user_found?.id).toBeTypeOf("string")
    })
})