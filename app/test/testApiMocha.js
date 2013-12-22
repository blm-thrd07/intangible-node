var should = require('chai').should();
var supertest = require('supertest');
var api = supertest('http://localhost:3000');


describe('API Authentication', function() {

  it('errors if wrong basic auth', function(done) {
    api.get('/users/list')
    .set('x-api-key', 'lnx1337')
    .expect(200, done);
  });

  it('errors if bad x-api-key header', function(done) {
    api.get('/users/list')
    .auth('correct', 'credentials')
    .expect(401)
    .expect({error:"Bad or missing app identification header"}, done);
  });

});


describe('Login Api /users/login', function() {
  
  it('Login API', function(done) {
    api.post('/users/login')
    .set('x-api-key', 'lnx1337')
    .send({
      email:"emailModificado1@mail.com",
      password:'password1'
    })
    .expect(200).expect('Content-Type', /json/)
    .end(function(err,res){
      var isCorrect = res.body.should.have.property('response','OK');
      if (isCorrect) {
        done();
      }
    });
  });

  it('Login API Login incorrect', function(done) {
    api.post('/users/login')
    .set('x-api-key', 'lnx1337')
    .send({ 
      email:"error@mail.com",
      password:'incorrect'
    })
    .expect(200).expect('Content-Type', /json/)
    .end( function(err,res) {
      var isCorrect = res.body[0].should.have.property('errors', 'User and password are incorrect');
      if (isCorrect) {
        done();
      }
    });
  });

  it('Login API password null', function(done) {
    api.post('/users/login')
    .set('x-api-key', 'lnx1337')
    .send({
      email:"",
      password:""
    })
    .expect(200).expect('Content-Type', /json/)
    .end( function(err,res) {
      var isCorrect = (
        res.body.errors[0].should.have.property('error', 'Error: email is required') && 
        res.body.errors[1].should.have.property('error', 'Error: password is required')
      );
      if (isCorrect) {
        done(); 
      } 
    });
  });

  it('#User login SQLinjection', function(done) {
    api.post('/users/login')
    .set('x-api-key', 'lnx1337')
    .send({email:"--//",password:"--//"})
    .expect(200).expect('Content-Type', /json/)
    .end( function(err,res) {
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


describe('#Api List /users/list', function() {

  it('List /users/list correct', function(done) { 
    api.get('/users/list')
    .set('x-api-key', 'lnx1337')
    .expect(200).expect('Content-Type', /json/)
    .end( function(err,res) {     
      var isCorrect = res.body[0].should.have.property('nombre','nombretest');
      if (isCorrect) {
          done();
      }
    });
  });

});


describe('API /users/add ', function() {

  /* 
  it('API /users/add sending the correct parameters',function(done){
    api.post('/users/add')
    .set('x-api-key', 'lnx1337')
    .send({
      nombre:"nuevo",
      apellido:"apellidot",
      email:"email1292@testing.com",
      password:"passwordTesting" 
    })
    .expect(200).expect('Content-Type', /json/)
    .end(function(err,res){
      if(res.body.should.have.property('response','OK')){
        done(); 
      } 
    });
  });
  */
  it('API add user sending data from an existing user  ',function(done){
    api.post('/users/add')
    .set('x-api-key', 'lnx1337')
    .send({ 
      nombre:"usernametesting",
      apellido: "apellidotesting",
      email:"email4@testing.com",
      password:"passwordTesting" 
    })
    .expect(200).expect('Content-Type', /json/)
    .end( function(err,res) {
      var isCorrect= res.body[0].should.have.property('errors','Error: The username already exists');
        if (isCorrect) {
          done(); 
        } 
    });
  });

  it('API add user sending null parameters', function(done) {  
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
  
  it('API add user send SQLinjection', function(done) {
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


describe('API GET /user/:id user findById ', function() { 

  it('API GET  /user/:id send correct id', function(done) {
    api.get('/users/1')
    .set('x-api-key', 'lnx1337')
    .expect(200).expect('Content-Type', /json/)
    .end( function(err,res) {
      var isCorrect = (res.body[0].should.have.property('response','OK') && 
        res.body[0].should.have.property('nombre') && 
        res.body[0].should.have.property('email')
      ); 
      if (isCorrect) {
        done(); 
      } 
    });
  });

 it('API GET /users/id sending a user id that does not exist', function(done) {
   api.get('/users/1337')
    .set('x-api-key', 'lnx1337')
    .expect(200).expect('Content-Type', /json/)
    .end( function(err,res) {
      var isCorrect = res.body[0].should.have.property('errors','Error: User Not exist');
      if (isCorrect) {
        done(); 
      } 
    });
  });

  it('API GET  /users/:id sending incorrect id', function(done) {
    api.get('/users/blabla')
    .set('x-api-key', 'lnx1337')
    .expect(430).expect('Content-Type', /json/)
    .end( function(err,res) {
      var isCorrect = res.body[0].should.have.property('errors','Error: Invalid Request');
      if (isCorrect) {
          done(); 
        } 
    });
  });

  it('API GET /users/:id sending SQLinjection', function(done) {
    api.get('/users/--or"1')
    .set('x-api-key', 'lnx1337')
    .expect(200).expect('Content-Type', /json/)
    .end( function(err,res) {
      var isCorrect = res.body[0].should.have.property('errors','Error: Invalid Request'); 
      if (isCorrect) {
          done(); 
        }
    });
  });

});


describe('API PUT /users/:id  update user correct', function() {
  
  it('API PUT update correct all data', function(done) {
    api.put('/users/edit/66')
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
  
  it('API PUT /users/:id update incorrect sending a user id that does not exist', function(done) {
    api.put('/users/edit/1337')
    .set('x-api-key', 'lnx1337')
    .send({
      nombre:"nombremodificado",
      email:"emailmodig@hotmail.com"
    })
    .expect(200).expect('Content-Type', /json/)
    .end( function(err,res) {
      var isCorrect = res.body[0].should.have.property('errors','Error: User Not exist');
      if (isCorrect) {
          done(); 
      }
    });
  });

  it('API PUT /users/:id update sending incorrect id', function(done) {
    api.put('/users/edit/blabla')
    .set('x-api-key', 'lnx1337')
    .send({
      nombre:"nombremodificado",
      email:"emailmodig@hotmail.com"
    })
    .expect(430).expect('Content-Type', /json/)
    .end( function(err,res) {
      var isCorrect = res.body[0].should.have.property('errors','Error: Invalid Request');
      if (isCorrect) {
        done(); 
      }
    });
  });

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
      var isCorrect = res.body.errors[0].should.have.property('error', 'Error: nombre is required');
      if (isCorrect) {
        done(); 
      }   
    });
  });
 
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



describe('API DELETE /user/:id user delete ', function() {
/*  
  it('delete correct', function(done) {   
    api.post('/users/95')
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
    */
  it('delete incorrect sending a user id that does not exist', function(done) {
    api.post('/users/1337')
    .set('x-api-key', 'lnx1337')
    .expect(200).expect('Content-Type', /json/)
    .end( function(err,res) {
      var isCorrect = res.body[0].should.have.property('errors','Error: User Not exist');
      if (isCorrect) {
        done(); 
      }
    });
  });

  it('delete sending incorrect id', function(done) {
    api.post('/users/blablabla')
    .set('x-api-key', 'lnx1337')
    .expect(200).expect('Content-Type', /json/)
    .end( function(err,res) {
      var isCorrect = res.body[0].should.have.property('errors','Error: Invalid Request');
      if (isCorrect) {
        done(); 
      }  
    });
  });

  it('delete sending SQLinjection', function(done) {
    api.post('/users/"or"1')
    .set('x-api-key', 'lnx1337')
    .expect(200).expect('Content-Type', /json/)
    .end( function(err,res) {
      var isCorrect = res.body[0].should.have.property('errors','Error: Invalid Request');
      if (isCorrect) {
        done(); 
      } 
    });
  });

});