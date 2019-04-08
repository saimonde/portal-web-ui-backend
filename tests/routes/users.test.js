const server=require('../../index');
const {getUsers}=require('../../models/users');
// require supertest
const request = require("supertest");

// close the server after each test
afterEach(() => {
    server.close();
  });

describe("routes: users",() => {
    const expected = getUsers();
    test("should respond as expected", async () => {
        const response = await request(server).get("/users");
        expect(response.status).toEqual(200);
        expect(response.type).toBe('application/json');
        expect(response.body).toMatchObject(expected);
    });
});