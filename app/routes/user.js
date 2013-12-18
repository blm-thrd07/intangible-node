// API RESTFUL USERS
// Then send call our model to make use of its functions
// We send one call activerecord-mysql module that allows us to have communication
// with the database

var model=require('../models/user.js');
var Db = require('mysql-activerecord');

// db is our object to access our database
// server is the database server
// database username and password for the database
// so the name of the same database
var db = new Db.Adapter({
  server: 'localhost', 
  username: 'root',
  password: '',
  database: 'intangibledb'
});

/* Truncar tabla */
exports.db=function(req,res){
  model.truncate(function(callback){
    res.send(callback);
  })
}

//method: Login 
//request POST 
//params: username,password
// This function makes sending login and password
exports.login=function(req,res){
  //We receive data via http
  var email=req.body.email.trim();
  var password=req.body.password.trim();
  // Send the data in json format type, the model to be validated
  // and make the match.
  model.validateLogin({email:email,password:password},function(callback){
    //In the callback variable you receive the answer in json
    res.send(callback);
  });    
}

//method: list 
//request GET 
//params: none
//Description:
// The list function brings all users that exist in the
// database
exports.list = function(req, res){
  model.findAll(function(callback){
    //We send the response to the client.
    res.send(callback);     
  });
};

//method: create 
//request POST /users/add
//params: nombre,apellido,email,password
// The create function lets you create a new user
//get name, last name, email, password.
exports.create=function(req,res){
  model.save(req.body, function(callback){  
    //We send the response to the client.
    res.send(callback);
  });
}
/*
   method: view
   request GET /users/:id 
   params: id (user id PK)
   The view function allows us to bring information from a user sending
   the id through a GET request
*/
exports.view=function(req,res){
  // Take the id of the url sent by GET  var id=req.params.id; 
  //  validate that is an integer
  if(id.match(/^\d+/)){
    model.findById({id:id},function(callback){
      //We send the response to the client.
      res.send(callback);  
    });
  }else{
    //if you receive a different parameter to an integer
    //send an error code
    res.status(430).send({error:"Invalid Request Error! "});
  } 
}
/*
   method: update 
   request PUT /users/edit/:id
   params:id user id
   La funcion update nos permite actualizar un usuario enviando como parametros
   los datos a actualizar es necesario el id de usuario. 
*/
exports.update=function(req,res){
  // Take the id of the url sent by GET  var id=req.params.id; 
  //  validate that is an integer
  var id=req.params.id;
  if(id.match(/^\d+/)){
    req.body.id=id;
    model.update(req.body, function(callback){
      //We send the response to the client.
      res.send(callback);           
    });
  }else{
    //if you receive a different parameter to an integer
    //send an error code
    res.status(430).send({error:"Invalid Request Error! "});
  } 
}
/*
   method: delete
   request DELETE /users/:id
   params:id user id 
   This function deletes a user by sending the user id for GET
*/
exports.delete=function(req,res){ 
  // Take the id of the url sent by GET  var id=req.params.id; 
  //  validate that is an integer
  var id=req.params.id;
  if(id.match(/^\d+/)){
    // send the id of the user to remove the model
    model.delete({id:id},function(callback){
      //We send the response to the client.
      res.send(callback);
    });
  }
}