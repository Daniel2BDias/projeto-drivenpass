import faker from '@faker-js/faker';
import httpStatus from 'http-status';
import supertest from 'supertest';
import { cleanDb } from '../helpers';
import prisma from '@/database';
import { server, init, close } from '../../src/server';
import { createUser } from '../factories/users.factory';

beforeAll(async () => {
    await init();
  });

afterEach(async () => {
    await cleanDb();
});

afterAll(async () => {
    close();
});

  const app = supertest(server);

describe("POST /credentials/post", () => {

    const testeUser = () => ({
        email: "teste@teste.com",
        password: "senhateste"
    });

    const testCredential = () => ({
        title: "title",
        url: faker.internet.url(),
        username: faker.name.firstName(),
        password: faker.internet.password()
    });

    describe("when token has issues", () => {
        
        it("should return 401 if it is missing", async () => {
            const { status } = await app.post("/credentials/post");

            expect(status).toBe(httpStatus.UNAUTHORIZED);
        });

        it("should return 401 if token has invalid format", async () => {
            const fakeToken = faker.lorem.word();

            const { status } = await app.post("/credentials/post").set("Authorization", `Bearer ${fakeToken}`);
            
            expect(status).toBe(httpStatus.UNAUTHORIZED);
        });

        it("should return 401 if token is missing after Bearer statment", async () => {
            const { status } = await app.post("/credentials/post").set("Authorization", "Bearer ");
            
            expect(status).toBe(httpStatus.UNAUTHORIZED);
        })
        
        it("should respond 401 if token has valid format but is not owned by a user", async () => {
            const user = testeUser();
            await createUser(user);
            
            const { body }  = await app.post("/login").send(user);
            await prisma.user.deleteMany();
            
            
            const { status } = await app.post("/credentials/post").set("Authorization", `Bearer ${body.token}`);
            
            expect(status).toBe(httpStatus.UNAUTHORIZED);
        });
    });

        describe("when token is valid but req has body issues", () => {
            it("should return 422 if credential is provided but no body though", async () => {
                const user = testeUser();
                await createUser(user);
    
                const { body } = await app.post("/login").send(user);
    
                const { status } = await app.post("/credentials/post").set("Authorization", `Bearer ${body.token}`);
    
                expect(status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
            });
    
            it("should return 422 if credential is provided but body has no title", async () => {
                const user = testeUser();
                await createUser(user);
                const credential = testCredential();
                delete credential.title
    
                const { body } = await app.post("/login").send(user);
    
                const { status } = await app.post("/credentials/post").set("Authorization", `Bearer ${body.token}`).send(credential);
    
                expect(status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
            });
    
            it("should return 422 if credential is provided but body has no url", async () => {
                const user = testeUser();
                await createUser(user);
                const credential = testCredential();
                delete credential.url;
    
                const { body } = await app.post("/login").send(user);
    
                const { status } = await app.post("/credentials/post")
                                            .set("Authorization", `Bearer ${body.token}`)
                                            .send(credential);
    
                expect(status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
            });
    
            it("should return 422 if credential is provided but body has no username", async () => {
                const user = testeUser();
                await createUser(user);
                const credential = testCredential();
                delete credential.username;
    
                const { body } = await app.post("/login").send(user);
    
                const { status } = await app.post("/credentials/post")
                                            .set("Authorization", `Bearer ${body.token}`)
                                            .send(credential);
    
                expect(status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
            });
    
            it("should return 422 if credential is provided but but has no password", async () => {
                const user = testeUser();
                await createUser(user);
                const credential = testCredential();
                delete credential.password;
    
                const { body } = await app.post("/login").send(user);
    
                const { status } = await app.post("/credentials/post")
                                            .set("Authorization", `Bearer ${body.token}`)
                                            .send(credential);
    
                expect(status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
            });
        });

        describe("when there is a duplicated title for the same user", () => {
            it("should return 409", async () => {
                const user = testeUser();
                await createUser(user);
                const credential = testCredential();

                const { body } = await app.post("/login").send(user);
                await app.post("/credentials/post")
                                            .set("Authorization", `Bearer ${body.token}`)
                                            .send(credential);
    
                const { status } = await app.post("/credentials/post")
                                            .set("Authorization", `Bearer ${body.token}`)
                                            .send(credential);
    
                expect(status).toBe(httpStatus.CONFLICT);
            });
        });

        describe("when everything is fine", () => {
            it("should return 201", async () => {
                const user = testeUser();
                await createUser(user);
                const credential = testCredential();

                const { body } = await app.post("/login").send(user);
    
                const { status } = await app.post("/credentials/post")
                                            .set("Authorization", `Bearer ${body.token}`)
                                            .send(credential);
    
                expect(status).toBe(httpStatus.CREATED);
            });
        })
  });

  describe("GET /credentials/getall", () => {

    const testeUser = () => ({
        email: "teste@teste.com",
        password: "senhateste"
    });

    const testCredential = () => ({
        title: "title",
        url: faker.internet.url(),
        username: faker.name.firstName(),
        password: faker.internet.password()
    });

    describe("when token has issues", () => {
        
        it("should return 401 if it is missing", async () => {
            const { status } = await app.get("/credentials/getall");

            expect(status).toBe(httpStatus.UNAUTHORIZED);
        });

        it("should return 401 if token has invalid format", async () => {
            const fakeToken = faker.lorem.word();

            const { status } = await app.post("/credentials/getall").set("Authorization", `Bearer ${fakeToken}`);
            
            expect(status).toBe(httpStatus.UNAUTHORIZED);
        });

        it("should return 401 if token is missing after Bearer statment", async () => {
            const { status } = await app.get("/credentials/getall").set("Authorization", "Bearer ");
            
            expect(status).toBe(httpStatus.UNAUTHORIZED);
        })
        
        it("should respond 401 if token has valid format but is not owned by a user", async () => {
            const user = testeUser();
            await createUser(user);
            
            const { body }  = await app.post("/login").send(user);
            await prisma.user.deleteMany();
            
            
            const { status } = await app.get("/credentials/getall").set("Authorization", `Bearer ${body.token}`);
            
            expect(status).toBe(httpStatus.UNAUTHORIZED);
        });
    });

    describe("when token is provided an has valid format", () => {
        it("should return user's credentials", async () => {
            const user = testeUser();
            await createUser(user);
            const credential = testCredential();
            
            const response  = await app.post("/login").send(user);
            await app.post("/credentials/post")
                     .set("Authorization", `Bearer ${response.body.token}`)
                     .send(credential);

            const { status, body } = await app.get("/credentials/getall").set("Authorization", `Bearer ${response.body.token}`);

            expect(status).toBe(httpStatus.OK);
            expect(body).toMatchObject([credential]);
        });
    });
  });

  describe("GET /credentials/get/:credentialId", () => {
    const testeUser = () => ({
        email: "teste@teste.com",
        password: "senhateste"
    });

    const testeUser2 = () => ({
        email: "teste2@teste.com",
        password: "senhateste"
    });

    const testCredential = () => ({
        title: "title",
        url: faker.internet.url(),
        username: faker.name.firstName(),
        password: faker.internet.password()
    });

    describe("when token has issues", () => {
        
        it("should return 401 if it is missing", async () => {
            const { status } = await app.get("/credentials/get/:credentialId");

            expect(status).toBe(httpStatus.UNAUTHORIZED);
        });

        it("should return 401 if token has invalid format", async () => {
            const fakeToken = faker.lorem.word();

            const { status } = await app.get("/credentials/get/:credentialId").set("Authorization", `Bearer ${fakeToken}`);
            
            expect(status).toBe(httpStatus.UNAUTHORIZED);
        });

        it("should return 401 if token is missing after Bearer statment", async () => {
            const { status } = await app.get("/credentials/get/:credentialId").set("Authorization", "Bearer ");
            
            expect(status).toBe(httpStatus.UNAUTHORIZED);
        })
        
        it("should respond 401 if token has valid format but is not owned by a user", async () => {
            const user = testeUser();
            await createUser(user);
            
            const { body }  = await app.post("/login").send(user);
            await prisma.user.deleteMany();
            
            
            const { status } = await app.get("/credentials/get/:credentialId").set("Authorization", `Bearer ${body.token}`);
            
            expect(status).toBe(httpStatus.UNAUTHORIZED);
        });
    });

        describe("when credential is not owned by the user or does not exist", () => {
           it("should return 403 if not owned by user", async () => {
                const user1 = testeUser();
                const user2 = testeUser2();
                await createUser(user1);
                await createUser(user2);

                const response1 = await app.post("/login").send(user1);
                const response2 = await app.post("/login").send(user2);

                const credential = testCredential();

                await app.post("/credentials/post").set("Authorization", `Bearer ${response1.body.token}`).send(credential);
                await app.post("/credentials/post").set("Authorization", `Bearer ${response2.body.token}`).send(credential);

                const user1cred = await app.get("/credentials/getall").set("authorization", `Bearer ${response1.body.token}`);

                const { status } = await app.get(`/credentials/get/${user1cred.body[0].id + 10}`).set("Authorization", `Bearer ${response2.body.token}`);

                expect(status).toBe(httpStatus.FORBIDDEN);
           });

           it("should return 403 if credential does not exist", async () => {
            const user1 = testeUser();
            const user2 = testeUser2();
            await createUser(user1);
            await createUser(user2);

            const response1 = await app.post("/login").send(user1);
            const response2 = await app.post("/login").send(user2);

            const credential = testCredential();

            await app.post("/credentials/post").set("Authorization", `Bearer ${response1.body.token}`).send(credential);
            await app.post("/credentials/post").set("Authorization", `Bearer ${response2.body.token}`).send(credential);

            const user1cred = await app.get("/credentials/getall").set("authorization", `Bearer ${response1.body.token}`);

            const { status } = await app.get(`/credentials/get/${user1cred.body[0].id}`).set("Authorization", `Bearer ${response2.body.token}`);

            expect(status).toBe(httpStatus.FORBIDDEN);
           });
        })

    describe("everything is fine", () => {
        it("should return 200 and the credentials", async () => { 
            const user = testeUser();
            await createUser(user);

            const response = await app.post("/login").send(user);

            const credential = testCredential();

            await app.post("/credentials/post").set("Authorization", `Bearer ${response.body.token}`).send(credential);

            const userCred = await app.get("/credentials/getall").set("authorization", `Bearer ${response.body.token}`);

            const { status, body } = await app.get(`/credentials/get/${userCred.body[0].id}`).set("Authorization", `Bearer ${response.body.token}`);

            expect(status).toBe(httpStatus.OK);
            expect(body).toMatchObject(credential);
        });
    });
  });

  describe("DELETE /credentials/delete/:credentialId", () => {

    const testeUser = () => ({
        email: "teste@teste.com",
        password: "senhateste"
    });

    const testeUser2 = () => ({
        email: "teste2@teste.com",
        password: "senhateste"
    });

    const testCredential = () => ({
        title: "title",
        url: faker.internet.url(),
        username: faker.name.firstName(),
        password: faker.internet.password()
    });

    describe("when token has issues", () => {
        
        it("should return 401 if it is missing", async () => {
            const { status } = await app.delete("/credentials/delete/:credentialId");

            expect(status).toBe(httpStatus.UNAUTHORIZED);
        });

        it("should return 401 if token has invalid format", async () => {
            const fakeToken = faker.lorem.word();

            const { status } = await app.delete("/credentials/delete/:credentialId").set("Authorization", `Bearer ${fakeToken}`);
            
            expect(status).toBe(httpStatus.UNAUTHORIZED);
        });

        it("should return 401 if token is missing after Bearer statment", async () => {
            const { status } = await app.delete("/credentials/post").set("Authorization", "Bearer ");
            
            expect(status).toBe(httpStatus.UNAUTHORIZED);
        })
        
        it("should respond 401 if token has valid format but is not owned by a user", async () => {
            const user = testeUser();
            await createUser(user);
            
            const { body }  = await app.post("/login").send(user);
            await prisma.user.deleteMany();
            
            
            const { status } = await app.delete("/credentials/delete/:credentialId").set("Authorization", `Bearer ${body.token}`);
            
            expect(status).toBe(httpStatus.UNAUTHORIZED);
        });
    });

    describe("when credential is not owned by user or does not exist", () => {
        it("should return 403 if not owned", async () => {
            const user1 = testeUser();
            const user2 = testeUser2();
            await createUser(user1);
            await createUser(user2);

            const response1 = await app.post("/login").send(user1);
            const response2 = await app.post("/login").send(user2);

            const credential = testCredential();

            await app.post("/credentials/post").set("Authorization", `Bearer ${response1.body.token}`).send(credential);
            await app.post("/credentials/post").set("Authorization", `Bearer ${response2.body.token}`).send(credential);

            const user1cred = await app.get("/credentials/getall").set("authorization", `Bearer ${response1.body.token}`);

            const { status } = await app.delete(`/credentials/delete/${user1cred.body[0].id}`).set("Authorization", `Bearer ${response2.body.token}`);

            expect(status).toBe(httpStatus.FORBIDDEN);
        });

        it("should return 403 if does not exist", async () => {
            const user1 = testeUser();
            const user2 = testeUser2();
            await createUser(user1);
            await createUser(user2);

            const response1 = await app.post("/login").send(user1);
            const response2 = await app.post("/login").send(user2);

            const credential = testCredential();

            await app.post("/credentials/post").set("Authorization", `Bearer ${response1.body.token}`).send(credential);
            await app.post("/credentials/post").set("Authorization", `Bearer ${response2.body.token}`).send(credential);

            const user1cred = await app.get("/credentials/getall").set("authorization", `Bearer ${response1.body.token}`);

            const { status } = await app.delete(`/credentials/delete/${user1cred.body[0].id}`).set("Authorization", `Bearer ${response2.body.token}`);

            expect(status).toBe(httpStatus.FORBIDDEN);
        });
    });

    describe("when everything is fine", () => {
        it("should return 204", async () => {
            const user = testeUser();
            await createUser(user);

            const response = await app.post("/login").send(user);

            const credential = testCredential();

            await app.post("/credentials/post").set("Authorization", `Bearer ${response.body.token}`).send(credential);

            const userCred = await app.get("/credentials/getall").set("authorization", `Bearer ${response.body.token}`);

            const { status, body } = await app.delete(`/credentials/delete/${userCred.body[0].id}`).set("Authorization", `Bearer ${response.body.token}`);

            expect(status).toBe(httpStatus.NO_CONTENT);
        });
    });
  });