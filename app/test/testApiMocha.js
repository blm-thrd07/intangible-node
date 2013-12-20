var should = require('chai').should();
var supertest = require('supertest');
var api = supertest('http://localhost:5000');


describe('API Authentication', function() {

  it('errors if wrong basic auth', function(done) {
   
    api.get('/blog')
    .set('x-api-key', 'lnx1337')
    .auth('incorrect', 'credentials')
    .expect(401, done)
  
  });

  it('errors if bad x-api-key header', function(done) {
    api.get('/blog')
    .auth('correct', 'credentials')
    .expect(401)
    .expect({error:"Bad or missing app identification header"}, done);
  });

});