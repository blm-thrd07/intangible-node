//This file contains a set of scripts that allow us to test the model with 
//different functions create read update and delete, so manually running this 
//script is using mocha
//$ mocha testModelMocha.js --reporter nyan --timeout 5000 

var should = require('chai').should();
var assert = require("assert")
var model =require('../models/user.js');

//Model Save In this series we test methods to save a user, sending null data, invalid data,
//incorrect data
describe('Model Save user', function() {
  
  //This method saves a user successfully sending an email that does not exist.
  //is very important to verify that the user create there otherwise we will mark 
  //an error and the test can not continue

  it('Save user sending the correct parameters', function(done) {
    model.save({
      nombre:"nuevousuariointangible",
      apellido: "apellidotestingintangibleeee", 
      email:"nuevousuariointangible666@testing.com",
      password:"passwordTestingin"
    },
    function(callback){
     //Because of that the user is saved successfully received a response OK 
     var isCorrect = callback.should.have.property('response','OK');
      if(isCorrect){
        done(); 
      } 
    });
  });
  
  it('Save user sending data from an existing user', function(done) {
    //parameters are sent to the model
    model.save({ 
      nombre:"usernametesting" , 
      apellido: "apellidotesting", 
      email:"nuevousuariointangible666@testing.com" ,
      password:"passwordTestingin" 
    },
    function(callback) {
      //As there the user should receive an error, this user has already used
      var isCorrect =(callback[0].should.have.property('errors','Error: The username already exists'));
      if (isCorrect) {
        done(); 
      } 
    });

  });

  //By sending null parameters must receive an error
  it('Save user sending null parameters', function(done) {  
    //parameters are sent to the model
    model.save({
     nombre:"", 
     apellido: "",
     email:"",
     password:""
   },
   function(callback) {
     //received a json with errors
     var isCorrect =(
       callback.errors[0].should.have.property('error', 'Error: nombre is required') &&
       callback.errors[1].should.have.property('error', 'Error: apellido is required') &&
       callback.errors[2].should.have.property('error', 'Error: email is required') &&
       callback.errors[3].should.have.property('error', 'Error: password is required')
       );
     if (isCorrect) {
       done();  
     }   
    }); 
  });

  //In this method we tried sending xss sqlinjection
  it('Save user send SQLinjection', function(done) {
    //parameters are sent to the model   
    model.save({
      nombre:"'--",
      apellido: "' or '1",
      email:"//",
      password:"--<alert>"
    },
    function(callback) {
      //The model we must send that data entered are invalid,
      //if the expected errors are correct the test is successful
      var isCorrect = (
        callback.errors[0].should.have.property('error', 'Error: nombre contains invalid characters') &&
        callback.errors[1].should.have.property('error', 'Error: apellido contains invalid characters') &&
        callback.errors[2].should.have.property('error', 'Error: email is invalid') &&
        callback.errors[3].should.have.property('error', 'Error: password contains invalid characters')
      );
      if (isCorrect) {
        done(); 
      }   
    });
  });
  
  //send the null name
  it('Save user send name null', function(done) {
    //parameters are sent to the model   
    model.save({
      nombre:"",
      apellido:"testApellido",
      email:"test@email.com",
      password:"lamisma" 
    },
    function(callback) {
      //The user is required and sends us an error model
      var isCorrect = callback.errors[0].should.have.property('error', 'Error: nombre is required');
      if (isCorrect) {
        //if the expected errors are correct the test is successful
        done(); 
      }   
    });
  });

   
  it('Save user send apellido null', function(done) {
    //parameters are sent to the model   
    model.save({
      nombre:"nombretest",
      apellido: "",
      email:"test@email.com",
      password:"lamisma"
    },
    function(callback) {
      var isCorrect = callback.errors[0].should.have.property('error', 'Error: apellido is required'); 
      if (isCorrect) {
        //if the expected errors are correct the test is successful
        done(); 
      }   
    });
  });

  it('Save user send email null', function(done) {
    //parameters are sent to the model   
    model.save({
      nombre:"nombretest",
      apellido:"apellidotest", 
      email:"",
      password:"lamisma"
    },
    function(callback) {
      //if the expected errors are correct the test is successful
      var isCorrect = callback.errors[0].should.have.property('error', 'Error: email is required');
      if (isCorrect) {
        done(); 
      }   
    });
  });

  it('Save user send password null', function(done) {
    //parameters are sent to the model   
    model.save({
      nombre:"nombretest",
      apellido: "Pena",
      email:"test@email.com",
      password:""
    },
    function(callback) {
      //if the expected errors are correct the test is successful
      var isCorrect = callback.errors[0].should.have.property('error', 'Error: password is required');
      if (isCorrect) {
        done(); 
      }   
    });
  });

});


//In the following we test methods on user login
describe('Model Authentication', function() {
  
  it('#User Login correct', function(done) {
    //This method makes a correct login
    model.validateLogin({
      email:"nuevousuariointangible666@testing.com",
      password:"passwordTestingin"
    },
    function(callback) {
      //if the expected errors are correct the test is successful
      var isCorrect = callback.should.have.property('response','OK');
      if (isCorrect) {
        done(); 
      }
    });

  });

  //This method validate an incorrect login when we send credentials that do not exist
  it('#User Login incorrect', function(done) {
    //parameters are sent to the model   
    model.validateLogin({
      email:"emailincorrect@mail.com",
      password:"passwordincorrect"
    },
    function(callback) {
      //if the expected errors are correct the test is successful
      var isCorrect = callback[0].should.have.property('errors', 'User and password are incorrect');      
      if (isCorrect) {
        done(); 
      } 
    });

  });

  it('#User login email null', function(done) {
    //validate the login with null email    
    model.validateLogin({
      email:"",
      password:"passwordincorrect"
    },
    function(callback){
    //if the expected errors are correct the test is successful  
    var isCorrect = callback.errors[0].should.have.property('error', 'Error: email is required');        
      if (isCorrect) {
        done(); 
      }     
    });

  });

  //validate the login with email null and password null
  it('#User login password null', function(done) { 
    model.validateLogin({
      email:"",
      password:""
    },
    function(callback){
      //if the expected errors are correct the test is successful  
      var isCorrect =(callback.errors[0].should.have.property('error', 'Error: email is required') && 
                      callback.errors[1].should.have.property('error', 'Error: password is required')
                      );    
      if (isCorrect) {
        done(); 
      }           
    });
  });

  //with sql injection
  it('#User login SQLinjection', function(done) {
    model.validateLogin({
      email:"--//",
      password:"--//"
    },
    function(callback) {
      var isCorrect = (callback.errors[0].should.have.property('error', 'Error: email is invalid') && 
                       callback.errors[1].should.have.property('error', 'Error: password contains invalid characters')
                      );
      if (isCorrect) {
        done(); 
      }               
    });
  });

});


//try listing all data
describe('Model ListAll ', function() {

  it('ListAll correct', function(done) {
    model.findAll( function(callback) {
      //if the answer is an object array is correct
      var isCorrect = callback.should.be.an.instanceOf(Array);
      if (isCorrect) {
        done();
      }
    });
  });

});


//In the following methods tried looking for a user by id
describe('Model user findById ', function() {
  
  //send an existing id in our database, otherwise we will send an error and 
  //the test can not continue
  it('findById send correct id', function(done) {
    model.findById({
      id:1
    },
    function(callback) {
      var isCorrect = (
        callback[0].should.have.property('response','OK') && 
        callback[0].should.have.property('nombre') && 
        callback[0].should.have.property('email') 
      );   
      if (isCorrect) {
        done(); 
      } 
    });
  });
   
  it('findById sending a user id that does not exist', function(done) {
    //send the model a user id that does not exist
    model.findById({
      id:1337
    },
    function(callback) {
      //if the expected errors are correct the test is successful
      var isCorrect = callback[0].should.have.property('errors','Error: User Not exist');
      if (isCorrect) {
        done(); 
      }   
    });
  });
   
  //sent an invalid id
  it('findById sending incorrect id', function(done) {
    model.findById({
      id:"blalal"
    },
    function(callback) {
      //if the expected errors are correct the test is successful
      var isCorrect = callback[0].should.have.property('errors','Error: The userid is invalid');  
      if (isCorrect) {
        done(); 
      }   
    })
  });
  
  //tried with sql injection
  it('findById sending SQLinjection', function(done) {
    model.findById({
      id:"'or'1"
    },
    function(callback) {
      //if the expected errors are correct the test is successful
      var isCorrect = callback[0].should.have.property('errors','Error: The userid is invalid');
      if (isCorrect) {
        done(); 
      }   
    })
  });

});


//In the following methods to update a user tried
describe('Model update user', function() {
  //Update a user that there is satisfactory, it is important that the user id 
  //exists otherwise send us a unexpected error and the test may not continue
  it('update correct all data', function(done) {
    model.update({
      id:1,
      nombre:"nombretest",
      email:'emailModificado1@mail.com'
    },
    function(callback) {
      //if everything is fine received a response OK
      var isCorrect = callback[0].should.have.property('response','OK');
      if (isCorrect) {
        done(); 
      }  
    });
  });

  //Sending a user that does not exist
  it('update incorrect sending a user id that does not exist', function(done) {
    model.update({
      id:1337,
      nombre:"nombremodificado",
      email:"emailmodig@hotmail.com"
    },
    function(callback) {
      //if the expected errors are correct the test is successful
      var isCorrect = callback[0].should.have.property('errors','Error: User Not exist');
      if (isCorrect) {
        done(); 
      }   
    })
  });

  //tried with a wrong id
  it('update sending incorrect id',function(done){
    model.update({
      id:"blalal"
    },
    function(callback) {
      var isCorrect = callback[0].should.have.property('errors','Error: The userid is invalid');
      if (isCorrect) { 
        done(); 
      }   
    })
  });
  
  //tried with sql injection
  it('update user send SQLinjection', function(done) {
    model.update({
      id:1,
      nombre:"'--",
      apellido: "' or '1",
      email:"//",
      password:"--<alert>" 
    },
    function(callback) {
      //if the expected errors are correct the test is successful
      var isCorrect = (
        callback.errors[0].should.have.property('error', 'Error: nombre contains invalid characters') &&
        callback.errors[1].should.have.property('error', 'Error: apellido contains invalid characters') &&
        callback.errors[2].should.have.property('error', 'Error: email is invalid') &&
        callback.errors[3].should.have.property('error', 'Error: password contains invalid characters')
      );
      if (isCorrect) {
            done(); 
      }   
    });
  });
  
  //in the following methods send null data to test which returns errors
  it('update user send name null', function(done) {
    model.update({
      id:1,nombre:"",
      apellido: "testApellido",
      email:"test@email.com",
      password:"lamisma" 
    },
    function(callback) {
      //if the expected errors are correct the test is successful 
      var isCorrect = callback.errors[0].should.have.property('error', 'Error: nombre is required');
      if (isCorrect) {
        done(); 
      }   
    });
  });

  it('update user send apellido null', function(done) {
    model.update({
      id:1,
      nombre:"nombretest",
      apellido: "",
      email:"test@email.com",
      password:"lamisma"
    },
    function(callback) {
      //if the expected errors are correct the test is successful
      var isCorrect = callback.errors[0].should.have.property('error', 'Error: apellido is required');   
      if (isCorrect) {
        done(); 
      }   
    });
  });

  it('update user send email null', function(done) {
    model.update({
      id:1,
      nombre:"nombretest",
      apellido: "apellidotest",
      email:"",
      password:"lamisma"
    },
    function(callback) {
      //if the expected errors are correct the test is successful
      var isCorrect = callback.errors[0].should.have.property('error', 'Error: email is required'); 
      if (isCorrect) {
        done(); 
      }   
    });
  });

  it('update user send password null', function(done) {
    model.update({
      id:1,
      nombre:"nombretest",
      apellido: "testApellido",
      email:"test@email.com",
      password:""
    },
    function(callback) {
      //if the expected errors are correct the test is successful
      var isCorrect = callback.errors[0].should.have.property('error', 'Error: password is required');
      if (isCorrect) {
        done(); 
      }   
    });
  });

});


//The following methods tried to delete a user
describe('Model user delete ', function() {
  
  //to remove a user successfully send an id there otherwise we will send an 
  //unexpected error and not be able to continue the test
  it('delete correct', function(done) {
    model.delete({
    id:1
    },
    function(callback) {
      var isCorrect = (
        callback[0].should.have.property('response', 'OK') &&
        callback[0].should.have.property('data', 'Deleted')
      );
      if (isCorrect) {
        done();
      } 
    });
  });

  //tried sending an id that does not exist
  it('delete incorrect sending a user id that does not exist', function(done) {
    model.delete({
      id:1337
    },
    function(callback) {
      //if the expected errors are correct the test is successful
      var isCorrect = callback[0].should.have.property('errors','Error: User Not exist');
      if (isCorrect) {
        done(); 
      }
    });
  });

  //try sending a wrong id
  it('delete sending incorrect id', function(done) {
    model.delete({
      id:"blalal"
    },function(callback) {
      //if the expected errors are correct the test is successful
      var isCorrect = callback[0].should.have.property('errors','Error: The userid is invalid');
      if (isCorrect) {
        done(); 
      }   
    })
  });

  //try sending sqlinjection
  it('delete sending SQLinjection', function(done) {
    model.delete({
      id:"'or'1"
    },
    function(callback) {
      //if the expected errors are correct the test is successful
      var isCorrect = callback[0].should.have.property('errors','Error: The userid is invalid');
      if (isCorrect) {
        done(); 
      }   
    })
  });

});