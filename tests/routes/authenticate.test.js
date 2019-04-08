const {checkUserCredentials}=require('../../models/users');
const server=require('../../index');
// require supertest
const request = require("supertest");
const config = require("../../config/global")

 // close the server after each test
 afterEach(() => {
    server.close();
  });

  describe("routes: authentication",async () => {
    const expected ={
        expiresIn: '3600'
    };
    const user = await checkUserCredentials('amalbogast', '12345');
    const nonUser = await checkUserCredentials('amalbogast1244', '12345d');

    test("checkuser should be defined", async () => {
        expect(user).toBeDefined();
        expect(nonUser).toBeDefined();
    });

    test("Oauth2 is bypassed", async () => {
        const response = await request(server).post("/login");
        if (config.auth.bypass) {
            expect(response.status).toEqual(200);
            expect(response.type).toBe('application/json');
            expect(response.body).toEqual(expected);
        }
    });
    
    test("User exists", async () => {
        const response = await request(server).post("/login");
        if(user !== undefined){
            expect(response.status).toEqual(200);
            expect(response.type).toBe('application/json');
            expect(response.body).toEqual(expected);
        }
    });

    test("User does not exist", async () => {
        const response = await request(server).post("/login");
        if(nonUser === undefined){
            expect(response.status).toEqual(401);
            expect(response.type).toBe('application/json');
            expect(response.body.message).toEqual("Invalid username & password.");
        }
    });

});