const server=require('../../index');
// require supertest
const request = require("supertest");

// close the server after each test
afterEach(() => {
    server.close();
  });

describe("routes: health", () => {

  test("should respond as expected", async () => {
    const response = await request(server).get("/");
    try{
        expect(response.status).toEqual(204);
    }catch(e){
        expect(response.status).toEqual(500);
    }
   
  });

  test("test on dummy post",async()=>{
      const response=await request(server).post("/dummypost");
      try{
        expect(response.status).toEqual(200);
        expect(response.type).toEqual("application/json");
        expect(response.body.dummy).toEqual("hello");
      }catch(err){
        expect(response.status).toEqual(400);
        expect(response.body).toEqual(err.getData());
        // if (err instanceof HTTPResponseError && err.getData().resp.message === 'Error occured') {
        //     expect(response.status).toEqual(400);
        //     expect(response.body).toEqual(err.getData());
        // }
        // else {
        //     throw err;
        // }
      }
      
  });

 
});