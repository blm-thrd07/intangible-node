var should = require('chai').should();
var assert = require("assert")
var model =require('../models/user.js');


describe('Model Save user', function() {
/*
  it('Save user sending the correct parameters', function(done) {
    model.save({
      nombre:"usernametesting",
      apellido: "apellidotesting", 
      email:"email5@testing.com",
      password:"passwordTesting"
    },
    function(callback){
     var isCorrect = callback.should.have.property('response','OK');
      if(isCorrect){
        done(); 
      } 
    });
  });
 */ 
  
  it('Save user sending data from an existing user', function(done) {
    
    model.save({ 
      nombre:"usernametesting" , 
      apellido: "apellidotesting", 
      email:"email4@testing.com" ,
      password:"passwordTesting" 
    },
    function(callback) {
      var isCorrect =(callback[0].should.have.property('errors','Error: The username already exists'));
      if (isCorrect) {
        done(); 
      } 
    });

  });

  it('Save user sending null parameters', function(done) {  
    model.save({
     nombre:"", 
     apellido: "",
     email:"",
     password:""
   },
   function(callback) {
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

  it('Save user send SQLinjection', function(done) {
    model.save({
      nombre:"'--",
      apellido: "' or '1",
      email:"//",
      password:"--<alert>"
    },
    function(callback) {
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

  it('Save user send name null', function(done) {
    model.save({
      nombre:"",
      apellido:"testApellido",
      email:"test@email.com",
      password:"lamisma" 
    },
    function(callback) {
      var isCorrect = callback.errors[0].should.have.property('error', 'Error: nombre is required');
      if (isCorrect) {
        done(); 
      }   
    });
  });

  it('Save user send apellido null', function(done) {
    model.save({
      nombre:"nombretest",
      apellido: "",
      email:"test@email.com",
      password:"lamisma"
    },
    function(callback) {
      var isCorrect = callback.errors[0].should.have.property('error', 'Error: apellido is required'); 
      if (isCorrect) {
        done(); 
      }   
    });
  });

  it('Save user send email null', function(done) {
    model.save({
      nombre:"nombretest",
      apellido:"apellidotest", 
      email:"",
      password:"lamisma"
    },
    function(callback) {
      var isCorrect = callback.errors[0].should.have.property('error', 'Error: email is required');
      if (isCorrect) {
        done(); 
      }   
    });
  });

  it('Save user send password null', function(done) {
    model.save({
      nombre:"nombretest",
      apellido: "Pena",
      email:"test@email.com",
      password:""
    },
    function(callback) {
      var isCorrect = callback.errors[0].should.have.property('error', 'Error: password is required');
      if (isCorrect) {
        done(); 
      }   
    });
  });

});


describe('Model Authentication', function() {
  
  it('#User Login correct', function(done) {
   
    model.validateLogin({
      email:"emailModificado1@mail.com",
      password:"password1"
    },
    function(callback) {
      var isCorrect = callback.should.have.property('response','OK');
      if(isCorrect){
        done(); 
      }
    });

  });


  it('#User Login incorrect', function(done) {
    
    model.validateLogin({
      email:"emailincorrect@mail.com",
      password:"passwordincorrect"
    },
    function(callback){
      var isCorrect = callback[0].should.have.property('errors', 'User and password are incorrect');      
      if(isCorrect){
        done(); 
      } 
    });

  });

  it('#User login email null', function(done) {
    
    model.validateLogin({
      email:"",
      password:"passwordincorrect"
    },
    function(callback){
    var isCorrect = callback.errors[0].should.have.property('error', 'Error: email is required');        
      if (isCorrect) {
        done(); 
      }     
    });

  });

  it('#User login password null', function(done) { 
    model.validateLogin({
      email:"",
      password:""
    },
    function(callback){
      var isCorrect =(callback.errors[0].should.have.property('error', 'Error: email is required') && 
                      callback.errors[1].should.have.property('error', 'Error: password is required')
                      );    
      if (isCorrect) {
        done(); 
      }           
    });
  });

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

describe('Model ListAll ', function() {

  it('ListAll correct', function(done) {
    model.findAll( function(callback) {
      var isCorrect = callback.should.be.an.instanceOf(Array);
      if (isCorrect) {
        done();
      }
    });
  });

});


describe('Model user findById ', function() {

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
    model.findById({
      id:1337
    },
    function(callback) {
      var isCorrect = callback[0].should.have.property('errors','Error: User Not exist');
      if (isCorrect) {
        done(); 
      }   
    });
  });

  it('findById sending incorrect id', function(done) {
    model.findById({
      id:"blalal"
    },
    function(callback) {
      var isCorrect = callback[0].should.have.property('errors','Error: The userid is invalid');  
      if (isCorrect) {
        done(); 
      }   
    })
  });
  
  it('findById sending SQLinjection', function(done) {
    model.findById({
      id:"'or'1"
    },
    function(callback) {
      var isCorrect = callback[0].should.have.property('errors','Error: The userid is invalid');
      if (isCorrect) {
        done(); 
      }   
    })
  });

});


describe('Model update user', function() {
  
  it('update correct all data', function(done) {
    model.update({
      id:2,
      nombre:"nombretest",
      email:'emailModificado1@mail.com'
    },
    function(callback) {
      var isCorrect = callback[0].should.have.property('response','OK');
      if (isCorrect) {
        done(); 
      }  
    });
  });

  it('update incorrect sending a user id that does not exist', function(done) {
    model.update({
      id:1337,
      nombre:"nombremodificado",
      email:"emailmodig@hotmail.com"
    },
    function(callback) {
      var isCorrect = callback[0].should.have.property('errors','Error: User Not exist');
      if (isCorrect) {
        done(); 
      }   
    })
  });

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

  it('update user send SQLinjection', function(done) {
    model.update({
      id:2,
      nombre:"'--",
      apellido: "' or '1",
      email:"//",
      password:"--<alert>" 
    },
    function(callback) {
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

  it('update user send name null', function(done) {
    model.update({
      id:2,nombre:"",
      apellido: "testApellido",
      email:"test@email.com",
      password:"lamisma" 
    },
    function(callback) { 
      var isCorrect = callback.errors[0].should.have.property('error', 'Error: nombre is required');
      if (isCorrect) {
        done(); 
      }   
    });
  });

  it('update user send apellido null', function(done) {
    model.update({
      id:2,
      nombre:"nombretest",
      apellido: "",
      email:"test@email.com",
      password:"lamisma"
    },
    function(callback) {
      var isCorrect = callback.errors[0].should.have.property('error', 'Error: apellido is required');   
      if (isCorrect) {
        done(); 
      }   
    });
  });

  it('update user send email null', function(done) {
    model.update({
      id:2,
      nombre:"nombretest",
      apellido: "apellidotest",
      email:"",
      password:"lamisma"
    },
    function(callback) {
      var isCorrect = callback.errors[0].should.have.property('error', 'Error: email is required'); 
      if (isCorrect) {
        done(); 
      }   
    });
  });

  it('update user send password null', function(done) {
    model.update({
      id:2,
      nombre:"nombretest",
      apellido: "testApellido",
      email:"test@email.com",
      password:""
    },
    function(callback) {
      var isCorrect = callback.errors[0].should.have.property('error', 'Error: password is required');
      if (isCorrect) {
        done(); 
      }   
    });
  });

});



describe('Model user delete ', function() {
  /*
  it('delete correct', function(done) {
    model.delete({
    id:96
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
  */
  it('delete incorrect sending a user id that does not exist', function(done) {
    model.delete({
      id:1337
    },
    function(callback) {
      var isCorrect = callback[0].should.have.property('errors','Error: User Not exist');
      if (isCorrect) {
        done(); 
      }
    });
  });

  it('delete sending incorrect id', function(done) {
    model.delete({
      id:"blalal"
    },function(callback) {
      var isCorrect = callback[0].should.have.property('errors','Error: The userid is invalid');
      if (isCorrect) {
        done(); 
      }   
    })
  });

  it('delete sending SQLinjection', function(done) {
    model.delete({
      id:"'or'1"
    },
    function(callback) {
      var isCorrect = callback[0].should.have.property('errors','Error: The userid is invalid');
      if (isCorrect) {
        done(); 
      }   
    })
  });

});