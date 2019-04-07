const server=require('../../index');
const usersModel=require('../../models/users');
// require supertest
const request = require("supertest");


// close the server after each test
afterEach(() => {
    server.close();
  });

describe("routes: users",() => {
    const expected =[
        {
            username:"amalbogast",
            password:"12345",
            active:"YES"
        },
        {
            username:"samanangu",
            password:"12345",
            active:"YES"
        },
        {
            username:"rkishimba",
            password:"12345",
            active:"YES"
        },
        {
            username:"slosindilo",
            password:"12345",
            active:"YES"
        }
    ];
    

    test("should respond as expected", async () => {
        const response = await request(server).get("/users");
        expect(response.status).toEqual(200);
        expect(response.type).toBe('application/json');
        expect(response.body).toMatchObject(expected);
    });

});