const server=require('../../index');
const config = require("../../config/global")
const chai = require("chai");
const should = chai.should();
const expect = chai.expect;
const chaiHttp = require("chai-http");

chai.use(chaiHttp);

describe("routes: health", () => {

  it("should respond as expected", async done => {
    chai
      .request(server)
      .get('/')
      .then((res)=>{
          expect(res).to.have.status(204);
      })
      .catch((err,res)=>{
          res.status.should.eql(500);
       });
       done();
        // .end((err, res) => {
        //   should.not.exist(err);
        //     try{
        //         res.status.should.eql(204);
        //     }catch(e){
        //         res.status.should.eql(500);
        //     }
        //   done();
        // });
  });

  it("test on dummy post",async done=>{
    chai
        .request(server)
        .post('/dummypost')
        .then((res)=>{
            res.status.should.eql(200);
            expect(res.body).to.equal("hello");
            res.type.should.eql("application/json");
          })
        .catch((err,res)=>{
          res.status.should.eql(400);
          expect(res.body).to.equal(err.getData());
        });
       done();

        // .end((err, res) => {
        //   should.not.exist(err);
        //     try{
        //         res.status.should.eql(200);
        //         expect(res.body).to.equal("hello");
        //         res.type.should.eql("application/json");
        //     }catch(ex){
        //         res.status.should.eql(400);
        //         expect(response.body).to.equal(ex.getData());
        //         // if (ex instanceof HTTPResponseError && ex.getData().resp.message === 'Error occured') {
        //         //     res.status.should.eql(400);
        //         //     expect(res.body).to.equal("hello");
        //         //     expect(response.body).to.equal(ex.getData());
        //         // }
        //         // else {
        //         //     throw err;
        //         // }
        //     }
        //   done();
        // });
  });

 
});