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

    it("should not enroll a user in an non-existing course", async () => {
        const request = {
            name: faker.person.fullName(),
            course_id: faker.string.uuid()
        }
        expect(sut_service.execute(request)).rejects.toThrow()
    })

    it("should not enroll a user to more than 3 courses", async () => {
        const name = faker.person.fullName()

        function getRequest() {
            return {
                name,
                course_id: faker.string.uuid()
            }
        }

        const request_1 = getRequest()
        const request_2 = getRequest()
        const request_3 = getRequest()
        const request_4 = getRequest()

        await prisma.course.create({ data: { id: request_1.course_id, name: faker.commerce.productName() } })
        await prisma.course.create({ data: { id: request_2.course_id, name: faker.commerce.productName() } })
        await prisma.course.create({ data: { id: request_3.course_id, name: faker.commerce.productName() } })
        await prisma.course.create({ data: { id: request_4.course_id, name: faker.commerce.productName() } })

        await sut_service.execute(request_1)
        await sut_service.execute(request_2)
        await sut_service.execute(request_3)

        expect(sut_service.execute(request_4)).rejects.toThrow()
    })
})