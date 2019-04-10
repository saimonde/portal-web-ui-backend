const server=require('../../index');
const config = require("../../config/global")
const chai = require("chai");
const should = chai.should();
const expect = chai.expect;
const chaiHttp = require("chai-http");

chai.use(chaiHttp);

describe("routes: health", () => {

  it("on try{}:should respond as expected", async done => {
    chai
      .request(server)
      .get('/')
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.eql(204);
      });
      done();
      // .then((res)=>{
      //     expect(res).to.have.status(204);
      // })
      // .catch((err,res)=>{
      //     res.status.should.eql(500);
      //  });
      //  done();
  });

  // it("on catch{}:should respond as expected", async done => {
  //   chai
  //     .request(server)
  //     .get('/')
  //     .end((err, res) => {
  //       should.not.exist(err);
  //       res.status.should.eql(500);
  //     });
  //     done();
  // });


  it("test on dummy post",async done=>{
    chai
        .request(server)
        .post('/dummypost')
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.eql(200);
          res.type.should.eql("application/json");  
          expect(res.body.dummy).to.equal("hello");
        });
        done();
        //   .then((res)=>{
      //       res.status.should.eql(200);
      //       expect(res.body).to.equal("hello");
      //       res.type.should.eql("application/json");
      //     })
      //   .catch((err,res)=>{
      //     res.status.should.eql(400);
      //     expect(res.body).to.equal(err.getData());
      //   });
      //  done();
  });

 
});