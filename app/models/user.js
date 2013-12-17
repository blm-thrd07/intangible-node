var Db = require('mysql-activerecord');
var db = new Db.Adapter({
  server: 'localhost',
  username: 'root',
  password: '',
  database: 'intangibledb'
});

exports.truncate=function(callback){
  
  db.query('truncate table tbl_users', function(err, results) {  
    var response={};
    response.data=results;
    response.error=err;
    callback(response);
  });

}

exports.validateLogin=function(model,callback){

  db.select('id,email,password').where('email= "'+model.email+'" and pasword="'+
  model.password+'"').get('tbl_users',function(err,data){     
    var response={};
    response.data=data;
    response.error=err;   
    callback(response); 
  });

}

exports.findAll=function(callback){

  db.select('nombre,apellido,email,password').get('tbl_users',function(err,data){
    var response={};
    response.data=data;
    response.error=err;
    callback(response);
  });

}

exports.save=function(model,callback){

  db.select('id,nombre,apellido,email,password').where('email="'+model.email+
    '" and password="'+model.password+'"').get('tbl_users',function(err,data){
    if(data!=""){
      callback({data:"",error:"The username already exists"});  
    }else{
      db.insert('tbl_users', { nombre: model.nombre , apellido: model.apellido,
        email:model.email ,password:model.password }, function(err, data){                 
          var response={}; 
          response.data=data;
          response.error=err;
          callback(response);
      });
    }  
  });    

}

exports.findById=function(model,callback){

  db.select('id,nombre,apellido,email,password').where('id='+model.id).get('tbl_users',
    function(err,data){
      var response={};
      if(data.length>0){
        response.data=data;
        response.error=err;
      }else{
       response.data={response:"User not found"};
       response.error=err; 
      }
      callback(response);    
    });

}

exports.update=function(model,callback){
 
  db.select('id,nombre,apellido,email,password').where('id='+model.id).get('tbl_users',
    function(err,data){
      if(data.length>0){
        db.where({id:model.id});
        db.update('tbl_users', model.body , function(err){
          if(!err) {
            db.select('id,nombre,apellido,email,password').where('id='+model.id).get('tbl_users',
              function(err,result){
                var response={};
                result[0].update="ok";
                response.data=result;
                response.error=err;
                callback(response);
            });
          }    
        });
      }else{
        callback({data:"",error:"User not found"});
      }   
    });
}

exports.delete=function(model,callback){

  db.select('id,nombre,apellido,email,password').where('id='+model.id).get('tbl_users',function(err,data){
    if(data.length>0){
      db.where({ id: model.id }).delete('tbl_users', function(err) {
        var response={};
        response.data={response:"Deleted"};
        response.error=err;  
      });
    }else{
      callback({data:"",error:"User not found"});
    }   
  }); 

}