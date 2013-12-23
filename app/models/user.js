// This file is the model, and has features that allow us to communicate with 
// mysql database here consultations conducted validate the input data.

// Include activerecord-mysql module which allows us to communicate with the  
// database Through his meincluimos activerecord-mysql module which allows us 
// to communicate with the database through his methods.

// db var is our object to access our database
// server is the database server
// username and password of the database
// database is the name of the database

var Db = require('mysql-activerecord');
var db = new Db.Adapter({
  server: 'localhost', 
  username: 'root',
  password: 'D3c3p710n',
  database: 'intangibledb'
});

// Model data
// @nombre varchar
// @apellido varchar
// @email varchar
// @password varchar

// The function allows us to truncate the table empty tbl users
// Returns a callback with the response.

exports.truncate = function(callback) {

  // We send the query to the db.query
  db.query('truncate table tbl_users', function(err, results) { 
    // be successful if it returns result ok 
    var response = {};
    response.data = results;
    response.error = err;
    callback(response);
  });

}

// The function is responsible for validateLogin searching email and password
// parameters to json Receives it with username and password in model
// in our database if found returns a json us all
// user information to the callback is another param.

exports.validateLogin = function(model,callback) {
  
  // validate that the data is correct
  var isValid = validateModel(model);
  if (isValid.status) {
    // we send a query to find out if the user you seek
    db.select('id,email,password')
    .where(
      ' email="' + model.email + '"' + ' and ' + 
      ' password="' + model.password + '"' 
    ).get('tbl_users', function(err,data) {
      //if no error means that the consultation was a success
      //login is correct       
      if ( err===null ) { 
        if ( data.length > 0 ) {
          data[0].response = 'OK';
          callback(data[0]);
        } else {
          // If we send wrong user credentials error.
          callback([{errors:"User and password are incorrect"}]);
        }
      } else {
          // If there was an error in the query sent an error.
          callback([{errors:err}]);
      }
    });
  } else {
    // If the input data is incorrect send the error.
    callback(isValid);
  } 

}

// The function findAll allows us to bring all users that exist in our table
// Returns a callback with the response in json.

exports.findAll = function(callback) {

  // We send the query to the table tbl_users
  db.select('nombre,apellido,email,password')
  .get('tbl_users', function(err,data) {
    // If the error is null we send the user there.
    if (err===null) {
      callback(data);
    } else {
      // If there is an error send error.
      callback([{errors:err}]);
    } 
  });

}

// Save function saves the user receives as parameters a type json
// {nombre: "xxx", apellido: "xxxx", email: "jj@hhh.com", password: "jfiowj123231"}
// and responds with a callback if the answer has been saved

exports.save = function(model,callback) {

  // We validate the input data
  var isValid = validateModel(model);
  if (isValid.status) {
    db.select('id,nombre,apellido,email,password')
    .where(
      'email="'+ model.email+ 
      '" and password="'+ model.password + '"'
    ).get('tbl_users', function(err,data) {
      // If the user exists send alert
      if (data != "" && data != null) {
        callback([{errors:"Error: The username already exists"}]);  
      } else {
        // If the store does not exist.
        db.insert('tbl_users', { nombre: model.nombre, apellido: model.apellido,
          email:model.email, password:model.password }, function(err, data){
            if (err===null) {
              // Answer ok
              data.response = "OK";
              callback(data);
            } else {
              // If there was an error in the query sent an error
              callback([{errors:err}]);
            }                 
          });
        }  
      });
    } else {
    // If the input data is incorrect send the error
    callback(isValid);
    }   

}

// The findById function allows you to search a user by their unique identifier
// Receives as parameters a type json {id: userid} and if the user is found
// Responds with a callback with all user information

exports.findById = function(model,callback) {
  
  // we validate that the ID is an integer 
  model.id = parseInt(model.id);
  var isIntValid = isInt(model.id);
  if (isIntValid) {
    db.select('id,nombre,apellido,email,password')
    .where('id='+model.id).get('tbl_users', function(err,data) {
      
      if (err==null) {
        // if the response contains the data sent
          if (data != null && data != "") {
            data[0].response="OK";
            callback(data);
          } else {
            // if the id is not found the user does not exist and send response
            callback([{errors:"Error: User Not exist"}]);
          }
      } else {
          // If there was an error in the query sent an error
          callback([{errors:err}]);
      }  
    });

  } else {
    // If the user id is different from a number sent Error
    callback([{errors:"Error: The userid is invalid"}]);
  }

}

// The update function allows us to update a user by sending
// One with json data to update the json is 
//{email: "," nombre "," param "value"}
// If the data is correct we answer a callback with the updated information

exports.update = function(model,callback) {
  
  // we validate that the ID is an integer 
  model.id = parseInt(model.id);
  var isIntValid=isInt(model.id);
  if ( isIntValid ) {
    // We verify that the user exists
    db.select('id,nombre,apellido,email,password')
    .where('id='+model.id).get('tbl_users', function(err,data) {
        if (data.length > 0) { 
          // validate input data 
          var isValid = validateModel(model);
          if (isValid.status) {
            db.where({id:model.id});
            // Send the data to be updated
            db.update('tbl_users', model , function(err){
              // If there is no error in the query send any updated information
              if (err===null) {
                db.select('id,nombre,apellido,email,password')
                .where('id='+model.id).get('tbl_users', function(err,result) {
                    var response = {};
                    response.data = result;
                    response.data[0].response = "OK";
                    response.data[0].error = err;
                    callback(response.data);
                });
              } else {
                // If there was an error in the query sent an error
                callback([{errors:err}]);
              }    
            });
          } else {
            // If the input data is incorrect send an error
            callback(isValid);
          } 
        } else {
          // if the submitted user id does not exist, send the error
          callback([{errors:"Error: User Not exist"}]);
        }   
    });
  } else {
      // If the user id is different from a number dispatched Error
      callback([{errors:"Error: The userid is invalid"}]);
  }

}

// Delete allows us to delete a user sending the id as a parameter in json 
//{id: userId}
// If user exists is removed and responds with a callback Answered removed

exports.delete = function(model,callback) {

  // We validate that the ID is an integer 
  model.id = parseInt(model.id);
  var isIntValid = isInt(model.id);
  if ( isIntValid ) {
    // We verify that the user exists
    db.select('id,nombre,apellido,email,password').where('id='+model.id)
    .get('tbl_users',function(err,data){
      if (data != null && data != "") {
        // if the user exists send query to delete
        db.where({ id: model.id }).delete('tbl_users', function(err){
          if (err===null) {
           callback([{data:"Deleted",response:"OK"}]);  
          } else {
            // If the input data is incorrect send an error
            callback([{errors:err}]);
          }
        });
      } else {
        // if the submitted user id does not exist, send the error
        callback([{errors:"Error: User Not exist"}]);
      }   
    });
  } else {
    // If the user id is different from a number dispatched Error
    callback([{errors:"Error: The userid is invalid"}]);
  }
  
}


// isInt verifies that data is an integer

function isInt(n) {
  return typeof n === 'number' && parseFloat(n) == parseInt(n, 10) && !isNaN(n);
}

// Validate empty, email, data and sql injection.

function validateModel(data) {

  var validData = { status:1, errors:[] };
  var expreg = { 
    email:/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    other:"^$",
    tags:"^[a-zA-Z0-9]+$"
  };

  for (i in data) {
    var key = i;
    if (key != 'id') {
    var isNull = data[key].match(expreg.other);  
      if (isNull) {
        validData.status = 0;
        validData.errors.push({ error: "Error: " + key + " is required" });
      } else {
        if (key==='email') {
          var isEmail = data[key].match(expreg.email);
          if (!isEmail) {
            validData.status = 0;
            validData.errors.push({ error:"Error: email is invalid" });
          }
        }
        var notSql= data[key].match(expreg.tags);
        if (!notSql && key != 'email') {
          validData.status = 0;
          validData.errors.push({
              error: "Error: " + key + " contains invalid characters"
          });
        }
      }  
    }
  }
  return validData;
}