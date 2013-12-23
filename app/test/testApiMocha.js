//This file contains tests done to the API users sending requests GET POST PUT 
//DELETE and verify success and error messages
//so manually running this 
//script is using mocha
//$ mocha testApiMocha.js --reporter nyan --timeout 5000 

var should = require('chai').should();
var supertest = require('supertest');
var api = supertest('http://localhost:3000');


//tried the Authentication API sending the correct and incorrect
describe('API Authentication', function() {

  it('errors if wrong basic auth', function(done) {
    //GET request is sent and the credentials to the method set ()
    api.get('/users/list') 
    .set('x-api-key', 'lnx1337')
    .expect(200, done);
  });
  
  it('errors if bad x-api-key header', function(done) {
    api.get('/users/list')
    .expect(401)
    .expect({error:"Bad or missing app identification header"}, done);
  });

});

//The following method keep a user correctly, it is important that the 
//user does not exist otherwise we send the server an error is not expected 
//and the test may not continue
describe('API POST  /users/add ', function() {

  it('API /users/add sending the correct parameters',function(done){
    api.post('/users/add')
    .set('x-api-key', 'lnx1337')
    .send({
      nombre:"nuevo",
      apellido:"apellidot",
      email:"intangibleeee@testing.com",
      password:"intangibleeeee" 
    })
    .expect(200).expect('Content-Type', /json/)
    .end(function(err,res){
      //if the response contains a 200 code and json contains the key type and 
      //expected answer is correct
      if(res.body.should.have.property('response','OK')){
        done(); 
      } 
    });
  });

  //api tried sending data from an existing user
  it('API add user sending data from an existing user POST /users/add',function(done){
    api.post('/users/add')
    .set('x-api-key', 'lnx1337')
    .send({ 
      nombre:"nuevo",
      apellido: "apellidotesting",
      email:"intangibleeee@testing.com",
      password:"intangibleeeee" 
    })
    .expect(200).expect('Content-Type', /json/)
    .end( function(err,res) {
      //if the expected errors are correct the test is successful
      var isCorrect= res.body[0].should.have.property('errors','Error: The username already exists');
        if (isCorrect) {
          done(); 
        } 
    });
  });

  //send null parameters
  it('API add user sending null parameters POST /users/add', function(done) {  
    api.post('/users/add')
    .set('x-api-key', 'lnx1337')
    .send({ 
      nombre:"",
      apellido: "",
      email:"",
      password:""
    })
    .expect(200).expect('Content-Type', /json/)
    .end( function(err,res) {
      //if the expected errors are correct the test is successful
      var isCorrect = (
        res.body.errors[0].should.have.property('error', 'Error: nombre is required') &&
        res.body.errors[1].should.have.property('error', 'Error: apellido is required') &&
        res.body.errors[2].should.have.property('error', 'Error: email is required') &&
        res.body.errors[3].should.have.property('error', 'Error: password is required')
      );
      if (isCorrect) {
        done(); 
      }
    });
  });
  
  //try sending sqlinjection
  it('API add user send SQLinjection POST /users/add', function(done) {
    api.post('/users/add')
    .set('x-api-key', 'lnx1337')
    .send({
      nombre:"'--",
      apellido: "' or '1",
      email:"//",
      password:"--<alert>"
    })
    .expect(200).expect('Content-Type', /json/)
    .end( function(err,res) {
      //if the expected errors are correct the test is successful
      var isCorrect = (
        res.body.errors[0].should.have.property('error', 'Error: nombre contains invalid characters') &&
        res.body.errors[1].should.have.property('error', 'Error: apellido contains invalid characters') &&
        res.body.errors[2].should.have.property('error', 'Error: email is invalid') &&
        res.body.errors[3].should.have.property('error', 'Error: password contains invalid characters')
      );       
      if (isCorrect) {
        done(); 
      } 
    });   
  });

});

//Login correct 
describe('Login Api /users/login', function() {
  
  //We correct login, for it is important that the email and password exist 
  //otherwise the server will respond with an error not expected and the test
  // may not continue
  it('Login API', function(done) {
    api.post('/users/login')
    .set('x-api-key', 'lnx1337')
    .send({
      email:"intangibleeee@testing.com",
      password:'intangibleeeee'
    })
    .expect(200).expect('Content-Type', /json/)
    .end(function(err,res){
      //if the response contains a 200 code and json contains the key type and 
      //expected answer is correct
      var isCorrect = res.body.should.have.property('response','OK');
      if (isCorrect) {
        done();
      }
    });
  });

  //sending incorrect credentials in json
  it('Login API Login incorrect', function(done) {
    api.post('/users/login')
    .set('x-api-key', 'lnx1337')
    .send({ 
      email:"error@mail.com",
      password:'incorrect'
    })
    .expect(200).expect('Content-Type', /json/)
    .end( function(err,res) {
      //if the expected errors are correct the test is successful
      var isCorrect = res.body[0].should.have.property('errors', 'User and password are incorrect');
      if (isCorrect) {
        done();
      }
    });
  });
  
  //try sending null data
  it('Login API email null and password null', function(done) {
    api.post('/users/login')
    .set('x-api-key', 'lnx1337')
    .send({
      email:"",
      password:""
    })
    .expect(200).expect('Content-Type', /json/)
    .end( function(err,res) {
      //if the expected errors are correct the test is successful
      var isCorrect = (
        res.body.errors[0].should.have.property('error', 'Error: email is required') && 
        res.body.errors[1].should.have.property('error', 'Error: password is required')
      );
      if (isCorrect) {
        done(); 
      } 
    });
  });
  //try sending sqlinjection
  it('#User login SQLinjection', function(done) {
    api.post('/users/login')
    .set('x-api-key', 'lnx1337')
    .send({email:"--//",password:"--//"})
    .expect(200).expect('Content-Type', /json/)
    .end( function(err,res) {
      //if the expected errors are correct the test is successful
      var isCorrect = (
        res.body.errors[0].should.have.property('error', 'Error: email is invalid') && 
        res.body.errors[1].should.have.property('error', 'Error: password contains invalid characters')
      );
      if (isCorrect) {
        done(); 
      }
    });
  });

});


//API try listing all data
describe('#Api List GET /users/list', function() {
  //is important to have at least one user
  it('List /users/list correct', function(done) { 
    api.get('/users/list')
    .set('x-api-key', 'lnx1337')
    .expect(200).expect('Content-Type', /json/)
    .end( function(err,res) {
      //if the response contains a 200 code and json contains the key type and 
      //expected answer is correct     
      var isCorrect = res.body[0].should.have.property('nombre','nuevo');
      if (isCorrect) {
          done();
      }
    });
  });

});


//We list a user by their specific id
describe('API GET /user/:id user findById ', function() { 
  
  it('API GET  /user/:id send correct id', function(done) {
    api.get('/users/2')
    .set('x-api-key', 'lnx1337')
    .expect(200).expect('Content-Type', /json/)
    .end( function(err,res) {
      //if the response contains a 200 code and json contains the key type and 
      //expected answer is correct 
      var isCorrect = (res.body[0].should.have.property('response','OK') && 
        res.body[0].should.have.property('nombre') && 
        res.body[0].should.have.property('email')
      ); 
      if (isCorrect) {
        done(); 
      } 
    });
  });

 //try sending a nonexistent id
 it('API GET /users/id sending a user id that does not exist', function(done) {
   api.get('/users/1337')
    .set('x-api-key', 'lnx1337')
    .expect(200).expect('Content-Type', /json/)
    .end( function(err,res) {
      //if the expected errors are correct the test is successful
      var isCorrect = res.body[0].should.have.property('errors','Error: User Not exist');
      if (isCorrect) {
        done(); 
      } 
    });
  });
  
  //send the model a user id that does not exist
  it('API GET  /users/:id sending incorrect id', function(done) {
    api.get('/users/blabla')
    .set('x-api-key', 'lnx1337')
    .expect(430).expect('Content-Type', /json/)
    .end( function(err,res) {
      //if the expected errors are correct the test is successful
      var isCorrect = res.body[0].should.have.property('errors','Error: Invalid Request');
      if (isCorrect) {
          done(); 
        } 
    });
  });
  
  //tried with sql injection
  it('API GET /users/:id sending SQLinjection', function(done) {
    api.get('/users/--or"1')
    .set('x-api-key', 'lnx1337')
    .expect(200).expect('Content-Type', /json/)
    .end( function(err,res) {
      //if the expected errors are correct the test is successful
      var isCorrect = res.body[0].should.have.property('errors','Error: Invalid Request'); 
      if (isCorrect) {
          done(); 
        }
    });
  });

});


//update user
describe('API PUT /users/:id  update user correct', function() {
  
  //Update a user that there is satisfactory, it is important that the user id 
  //exists otherwise send us a unexpected error and the test may not continue
  it('API PUT update correct all data', function(done) {
    api.put('/users/edit/2')
    .set('x-api-key', 'lnx1337')
    .send({
      nombre:"nombretest",
      email:'emailModificado1@mail.com'
    })
    .expect(200).expect('Content-Type', /json/)
    .end( function(err,res) {
      var isCorrect = res.body[0].should.have.property('response','OK');
      if (isCorrect) {
        done(); 
      }  
    });
  });
  
  //Sending a user that does not exist 1337
  it('API PUT /users/:id update incorrect sending a user id that does not exist', function(done) {
    api.put('/users/edit/1337')
    .set('x-api-key', 'lnx1337')
    .send({
      nombre:"nombremodificado",
      email:"emailmodig@hotmail.com"
    })
    .expect(200).expect('Content-Type', /json/)
    .end( function(err,res) {
      //if the expected errors are correct the test is successful
      var isCorrect = res.body[0].should.have.property('errors','Error: User Not exist');
      if (isCorrect) {
          done(); 
      }
    });
  });

  //tried with a wrong id
  it('API PUT /users/:id update sending incorrect id', function(done) {
    api.put('/users/edit/blabla')
    .set('x-api-key', 'lnx1337')
    .send({
      nombre:"nombremodificado",
      email:"emailmodig@hotmail.com"
    })
    .expect(430).expect('Content-Type', /json/)
    .end( function(err,res) {
      //if the expected errors are correct the test is successful
      var isCorrect = res.body[0].should.have.property('errors','Error: Invalid Request');
      if (isCorrect) {
        done(); 
      }
    });
  });

  //in the following methods send null data to test which returns errors
  it('API PUT /users/:id update user send  null all data', function(done) {
    api.put('/users/edit/2')
    .set('x-api-key', 'lnx1337')
    .send({
      nombre:"",
      apellido: "",
      email:"",
      password:""
    })
    .expect(200).expect('Content-Type', /json/)
    .end( function(err,res) {
      //if the expected errors are correct the test is successful
      var isCorrect = res.body.errors[0].should.have.property('error', 'Error: nombre is required');
      if (isCorrect) {
        done(); 
      }   
    });
  });
  
  //tried with sql injection
  it('API PUT /users/:id update user send SQLinjection', function(done) {
    api.put('/users/edit/2')
    .set('x-api-key', 'lnx1337')
    .send({ 
      nombre:"'--",
      apellido: "' or '1",
      email:"//",
      password:"--<alert>"
    })
    .expect(200).expect('Content-Type', /json/)
    .end( function(err,res) {
      //if the expected errors are correct the test is successful
      var isCorrect = (
        res.body.errors[0].should.have.property('error', 'Error: nombre contains invalid characters') &&
        res.body.errors[1].should.have.property('error', 'Error: apellido contains invalid characters') &&
        res.body.errors[2].should.have.property('error', 'Error: email is invalid') &&
        res.body.errors[3].should.have.property('error', 'Error: password contains invalid characters')
      );
      if (isCorrect) {
          done(); 
      }   
    });
  });

});


//try the following methods to delete a user
describe('API DELETE /user/:id user delete ', function() {

  //to remove a user successfully send an id there otherwise we will send an 
  //unexpected error and not be able to continue the test
  
  it('delete correct', function(done) {   
    api.post('/users/2')
    .set('x-api-key', 'lnx1337')
    .expect(200).expect('Content-Type', /json/)
    .end( function(err,res) {
      var isCorrect = (
        res.body[0].should.have.property('response', 'OK') && 
        res.body[0].should.have.property('data', 'Deleted')
      );
      if (isCorrect) {
        done();
      } 
    });
  });
 
  //tried sending an id that does not exist
  it('delete incorrect sending a user id that does not exist /users/1337', function(done) {
    api.post('/users/1337')
    .set('x-api-key', 'lnx1337')
    .expect(200).expect('Content-Type', /json/)
    .end( function(err,res) {
      //if the expected errors are correct the test is successful
      var isCorrect = res.body[0].should.have.property('errors','Error: User Not exist');
      if (isCorrect) {
        done(); 
      }
    });
  });

  //try sending a wrong id
  it('delete sending incorrect id', function(done) {
    api.post('/users/blablabla')
    .set('x-api-key', 'lnx1337')
    .expect(200).expect('Content-Type', /json/)
    .end( function(err,res) {
      //if the expected errors are correct the test is successful
      var isCorrect = res.body[0].should.have.property('errors','Error: Invalid Request');
      if (isCorrect) {
        done(); 
      }  
    });
  });

  //try sending sqlinjection
  it('delete sending SQLinjection', function(done) {
    api.post('/users/"or"1')
    .set('x-api-key', 'lnx1337')
    .expect(200).expect('Content-Type', /json/)
    .end( function(err,res) {
      //if the expected errors are correct the test is successful
      var isCorrect = res.body[0].should.have.property('errors','Error: Invalid Request');
      if (isCorrect) {
        done(); 
      } 
    });
  });

});