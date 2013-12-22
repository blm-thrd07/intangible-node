// API RESTFUL USERS
// Then send call our model to make use of its functions

var model=require('../models/user.js');

/* Truncar tabla */
exports.db = function(req,res) {
  
  model.truncate( function(callback) {
    res.send(callback);
  });

}

// method: Login 
// request POST 
// params: username,password
// This function makes sending login and password

exports.login = function(req,res) {
  // We receive data via http
  var email = req.body.email.trim();
  var password = req.body.password.trim();
  // Send the data in json format type, the model to be validated
  // and make the match.
  model.validateLogin({ email:email, password:password } , function(callback) {
    // In the callback variable you receive the answer in json
    res.send(callback);
  });    
}

// method: list 
// request GET 
// params: none
// Description:
// The list function brings all users that exist in the
// database

exports.list = function(req, res) {
  
  model.findAll( function(callback) {
    //We send the response to the client.
    res.send(callback);     
  });

};

// method: create 
// request POST /users/add
// params: nombre,apellido,email,password
// The create function lets you create a new user
// get name, last name, email, password.

exports.create = function(req,res) {
  model.save( req.body, function(callback) {  
    //We send the response to the client.
    res.send(callback);
  });
}

// method: view
// request GET /users/:id 
// params: id (user id PK)
// The view function allows us to bring information from a user sending
// the id through a GET request

exports.view = function(req,res) {
  // Take the id of the url sent by GET  var id=req.params.id; 
  // validate that is an integer
  var id = req.params.id;
  var isId = id.match(/^\d+/);
  if (isId) {
    model.findById({ id:id }, function(callback) {
      // We send the response to the client.
      res.send(callback);  
    });
  } else {
    // if you receive a different parameter to an integer
    // send an error code
    res.status(430).send([{errors:"Error: Invalid Request"}]);
  } 
}

// method: update 
// request PUT /users/edit/:id
// params:id user id
// The update function allows us to update a user sending as parameters
// Update the data to the user id is required. 

exports.update = function(req,res) {
  // Take the id of the url sent by GET  var id=req.params.id; 
  // validate that is an integer
  var id = req.params.id;
  var isId = id.match(/^\d+/);
  if (isId) {
    req.body.id = id;
    model.update(req.body, function(callback) {
      // We send the response to the client.
      res.send(callback);           
    });
  } else {
    // if you receive a different parameter to an integer
    // send an error code
    res.status(430).send([{errors:"Error: Invalid Request"}]);
  } 
}

// method: delete
// request DELETE /users/:id
// params:id user id 
// This function deletes a user by sending the user id for GET

exports.delete = function(req,res) { 
  // Take the id of the url sent by GET  var id=req.params.id; 
  //  validate that is an integer
  var id = req.params.id;
  var isId = id.match(/^\d+/);
  if (isId) {
    // send the id of the user to remove the model
    model.delete( {id:id }, function(callback) {
      // We send the response to the client.
      res.send(callback);
    });
  } else {
    // if you receive a different parameter to an integer
    // send an error code
    res.status(430).send([{errors:"Error: Invalid Request"}]);
  }
}