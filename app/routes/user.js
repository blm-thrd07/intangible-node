/*
 API RESTFUL USERS
 */
 var model=require('../models/user.js');



var Db = require('mysql-activerecord');
var db = new Db.Adapter({
    server: 'localhost',
    username: 'root',
    password: 'D3c3p710n',
    database: 'intangibledb'
});



/* Truncar tabla */
exports.db=function(req,res){
	model.truncate(function(callback){
          res.send(callback);
	})
}

/*
   method: Login 
   request POST 
   params: username,password
*/
exports.login=function(req,res){
   var email=req.body.email;
   var password=req.body.password;
   if(email.length !=0 && password.length !=0){

      if(validateEmail(email)){
	         
	         model.validateLogin({email:email,password:password},function(callback){   
		             if(callback.length>0){
		                   res.status(200).send(callback);
		             }else{
		            	   res.status(200).send({response:"User and password are incorrect "});
		             } 
	          });
         
         }else{
         
         	res.status(200).send({response:"Mail is not valid: example@example.com"})
         
         }
  

    }else{
  	          res.status(200).send({response:"User and password are required "});
    }
}

/*
   method: list 
   request GET 
   params: none
*/

exports.list = function(req, res){
    model.findAll(function(callback){
            if(callback!=""){
                 res.status(200).send(callback);
            }else{
            	 res.status(200).send({response:"No users"});
            }   
     });
};

/*
   method: create 
   request POST /users/add
   params: nombre,apellido,email,password
*/

exports.create=function(req,res){

      var nombre=req.body.nombre;
      var apellido=req.body.apellido;
      var email=req.body.email;
      var password=req.body.password;


      if( nombre !=" "  && apellido !=" " && email !=" " && password !=" " ){

       if(validateEmail(email)){
       
        model.save({ nombre: nombre , apellido: apellido ,email:email ,password:password }, function(callback){  
           
           if(!callback.error){
             	res.status(200).send(callback);
            }else{
            	res.status(200).send(callback);
            }
        });

         }else{
         
         	res.status(200).send({response:"Mail is not valid: example@example.com"})
         
         }




      }else{
      	res.status(200).send({response:"Error all data is required"});
      }
}

/*
   method: view
   request GET /users/:id 
   params: id (user id PK)
*/

exports.view=function(req,res){
	var id=req.params.id;
	if(id.match(/^\d+/)){
	     model.findById({id:id},function(callback){
	            if(callback.length>0){
	                 res.status(200).send(callback);
	            }else{
	            	res.status(200).send({response:"User not found"});
	            }   
	      });

	   }else{
	   	  res.status(430).send({response:"Invalid Request Error! "});
	   } 
}

/*
   method: update 
   request PUT /users/edit/:id
   params:id user id 
*/
exports.update=function(req,res){

 var id=req.params.id;
 if(id.match(/^\d+/)){
     model.update({id:id,body:req.body}, function(callback){
                 if(callback.length>0){
                        res.status(200).send(callback);
                   }else{ 
            	      res.status(200).send({response:"User not found"});
                  }              
     });
   }else{
   	  res.status(430).send({response:"Invalid Request Error! "});
   } 
}

/*
   method: delete
   request DELETE /users/:id
   params:id user id 
*/
exports.delete=function(req,res){
	
	var id=req.params.id;
    
    if(id.match(/^\d+/)){
      model.delete({id:id},function(callback){
            if(callback.response=="delete"){
					    res.status(200).send(callback);
	         }else{
            	        res.status(200).send({response:"User not Found"});
             }   
        });	
   }else{
   	  res.status(430).send({response:"Invalid Request Error! "});
   } 

}


function validateEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
} 