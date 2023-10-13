import faker from "@faker-js/faker";
import credentialSchema from "../../src/schemas/credentials.schema";

describe("credentialSchema", () => {
    const validCredential = () => ({
        title: faker.lorem.word(),
        url: faker.internet.url(),
        username: faker.internet.email(),
        password: faker.internet.password()
    });

    describe("If everything is ok", () => {
        it("should pass", () => {
            const credential = validCredential()

            const { error } = credentialSchema.validate(credential, { abortEarly: false })
            
            expect(error).toBeUndefined();
        })
    })

    describe("all fields are required", () => {
        it("should return a error if title is missing", () => {
            const credential = validCredential();
            delete credential.title

            const { error } = credentialSchema.validate(credential, { abortEarly: false })
            
            expect(error).toBeDefined();
        })

        it("should return a error if url is missing", () => {
            const credential = validCredential();
            delete credential.url

            const { error } = credentialSchema.validate(credential, { abortEarly: false })
            
            expect(error).toBeDefined();
        })

        it("should return a error if username is missing", () => {
            const credential = validCredential();
            delete credential.username

            const { error } = credentialSchema.validate(credential, { abortEarly: false })
            
            expect(error).toBeDefined();
        })

        it("should return a error if password is missing", () => {
            const credential = validCredential();
            delete credential.password

            const { error } = credentialSchema.validate(credential, { abortEarly: false })
            
            expect(error).toBeDefined();
        })
    });

    describe("url must be a valid format", () => {
        it("should return a error if it is not", () => {
            const credential = validCredential();
            credential.url = faker.lorem.word();

            const { error } = credentialSchema.validate(credential, { abortEarly: false })
            
            expect(error).toBeDefined();
        })
    });
})