const {checkUserCredentials}=require('../../models/users');
const server=require('../../index');
const config = require("../../config/global")
const chai = require("chai");
const should = chai.should();
const expect = chai.expect;
const chaiHttp = require("chai-http");

chai.use(chaiHttp);

  describe("routes: authentication",() => {

    const expected = {
        expiresIn: '3600'
    };
    let credentials;

    // it("check login,config.auth.bypass=TRUE", done => {
    //   credentials={
    //     username:'amalbogast',
    //     password:"12345"
    //   }
    //   chai
    //     .request(server)
    //     .post('/login')
    //     .send(credentials)
    //     .end((err, res) => {
    //       should.not.exist(err);
    //       if(config.auth.bypass){
    //         console.log('********config.auth.bypass');
    //         expect(res.body).to.deep.equal(expected);
    //         res.status.should.eql(200);
    //         res.type.should.eql("application/json");
    //       }
    //       done();
    //     });
    // });
    
    it("check login,valid users", done => {
        credentials={
          username:'amalbogast',
          password:"12345"
        }
        chai
          .request(server)
          .post('/login')
          .send(credentials)
          .end((err, res) => {
            should.not.exist(err);
            console.log('******** valid user');
            res.status.should.eql(200);
            res.type.should.eql("application/json");
            expect(res.body).to.deep.equal(expected);
            done();
          });
      });

      it("check login,invalid users",done=> {
        credentials={
          username:'xxxxx',
          password:"ccxxxx"
        }
        chai
          .request(server)
          .post('/login')
          .send(credentials)
          .end((err, res) => {
            should.not.exist(err);
            console.log('********undefined');
            res.status.should.eql(401);
            res.type.should.eql("application/json");
            expect(res.body.message).to.equal("Invalid username & password.");
            done();
          });
      });
  });
