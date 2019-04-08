const {getDfsps}=require('../../models/dfsps');
const server=require('../../index');
// require supertest
const request = require("supertest");

 // close the server after each test
 afterEach(() => {
    server.close();
  });

describe("routes: dfsps",() => {
    const expected = getDfsps();
    test("should respond as expected", async () => {
        const response = await request(server).get("/dfsps");
        try{
            expect(response.status).toEqual(200);
            expect(response.type).toBe('application/json');
            expect(response.body).toEqual(expected);
        }catch(err){
            expect(response.status).toEqual(500);
        }
    });
});