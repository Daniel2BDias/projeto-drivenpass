import faker from '@faker-js/faker';
import httpStatus from 'http-status';
import supertest from 'supertest';
import { cleanDb } from '../helpers';
import { server, init, close } from '@/server';
import { createUser } from '../factories/users.factory';
import dotenv from "dotenv";
import prisma, { connectDb, disconnectDB } from '@/database';
import { PrismaClient } from '@prisma/client';

dotenv.config();

beforeAll(async () => {
  await init();
  connectDb();
  });

afterEach(async () => {
    await cleanDb();
    
});

afterAll(async () => {
    await disconnectDB();
    close();
    server.listen(5000).close();
})

const app = supertest(server);

  describe("POST /signup", () => {
        const generateBody = () => ({
            email: faker.internet.email(),
            password: faker.internet.password(10)
        });

        describe("if body is invalid", () => {
            it("should return 422 if no email is provided", async () => {
                const body = generateBody();
                delete body.email;

                const { status } = await app.post("/signup").send(body);

                expect(status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
            });

            it("should return 422 if no password is provided", async () => {
                const body = generateBody();
                delete body.password;

                const { status } = await app.post("/signup").send(body);
                expect(status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
            });

            it("should return 422 if password has less than 10 characters", () => {
                const body = generateBody();
            });
        });

        describe("email already registered", () => {
            it("should return 409", async () => {
                const body = generateBody();
                await app.post("/signup").send(body);

                const { status } = await app.post("/signup").send(body);
                expect(status).toBe(httpStatus.CONFLICT);
            });
        });

        describe("if everything is ok", () => {
            it("should return 201", async () => {
                const body = generateBody();

                const { status } = await app.post("/signup").send(body);
                expect(status).toBe(httpStatus.CREATED);
            });
        });
  });

  describe("POST /login", () => {
        const generateBody = () => ({
            email: faker.internet.email(),
            password: faker.internet.password(10)
        });

        describe("when credentials are not given", () => {
            it("should return 422 when email is not provided", async () => {
                const body = generateBody();
                delete body.email;

                const { status } = await app.post("/login").send(body);

                expect(status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
;            });
            
            it("should return 422 when password is not given", async () => {
                const body = generateBody();
                delete body.password;

                const { status } = await app.post("/login").send(body);

                expect(status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
            });
        });

        describe("when credentials are given, but invalid", () => {
            it("should return 401 if email is given, but invalid", async () => {
                const body = generateBody();
                await createUser(body);

                body.email = "random@email.com";

                const { status } = await app.post("/login").send(body);

                expect(status).toBe(httpStatus.UNAUTHORIZED);
            });

            it("should return 401 if password is given, but invalid", async () => {
                const body = generateBody();
                await createUser(body);

                body.password = "randomPassword";

                const { status } = await app.post("/login").send(body);

                expect(status).toBe(httpStatus.UNAUTHORIZED);
            });
        });

        describe("when everthing is ok", () => {
            it("should return a access token and status code 200", async () => {
                const user = generateBody();

                await createUser(user);

               const { body, status } = await app.post("/login").send(user);

               expect(status).toBe(httpStatus.OK);
               expect(body.token).toBeDefined();
            });
        });

        describe("when jwt fails to generate", () => {

            it("should return error 500 and JWT error message", async () => {
                
                const user = generateBody();
                
                await createUser(user);
                
                delete process.env.JWT_SECRET;
                const { status, body } = await app.post("/login").send(user);

                expect(status).toBe(httpStatus.INTERNAL_SERVER_ERROR);
            });
        });

  });