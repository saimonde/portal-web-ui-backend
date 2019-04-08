const {checkUserCredentials}=require('../../models/users');
const server=require('../../index');
// require supertest
const request = require("supertest");
const config = require("../../config/global")

 // close the server after each test
 afterEach(() => {
    server.close();
  });

  describe("routes: dfsps",async () => {
    const expected ={
        expiresIn: '3600'
    };
    const checkUser = await checkUserCredentials('amalbogast', '12345');

    test("checkuser should be defined", async () => {
        expect(checkUser).toBeDefined();
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
        if(checkUser === undefined){
            expect(response.status).toEqual(401);
            expect(response.type).toBe('application/json');
            expect(response.body.message).toEqual("Invalid username & password.");
        }
    });

    test("User does not exist", async () => {
        const response = await request(server).post("/login");
        if(checkUser !== undefined){
            expect(response.status).toEqual(200);
            expect(response.type).toBe('application/json');
            expect(response.body).toEqual(expected);
        }
    });

});