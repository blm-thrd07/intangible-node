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
  var isValid=validateModel(model);
  if(isValid.status){
    db.select('id,email,password').where('email= "'+model.email+
      '" and password="'+ model.password+'"').get('tbl_users',function(err,data){         
      if(err==null){ 
        if(data.length>0){
          callback(data);
        }else{
          callback({data:"",error:"User and password are incorrect "});
        }
      }else{
          callback({error:err});
      }
    });
  }else{
    callback({error:isValid.error});
  } 
}

exports.findAll=function(callback){
  db.select('nombre,apellido,email,password').get('tbl_users',function(err,data){
    if(err==null){
      callback(data);
    }else{
      callback(err);
    } 
  });
}

exports.save=function(model,callback){
  var isValid=validateModel(model);
    if(isValid.status){
      db.select('id,nombre,apellido,email,password').where('email="'+model.email
        +'" and password="'+model.password+'"').get('tbl_users',function(err,data){
        if(data!=""&& data!=null){
          callback({data:"",error:"The username already exists"});  
        }else{
          db.insert('tbl_users', { nombre: model.nombre , apellido: model.apellido,
            email:model.email ,password:model.password }, function(err, data){
            if(err==null){
              callback(data);
            }else{
              callback({error:err});
            }                 
          });
        }  
      });
    }else{
    callback({error:isValid.error});
    }     
}


exports.findById=function(model,callback){
  model.id=parseInt(model.id);
  if(isInt(model.id)){
    db.select('id,nombre,apellido,email,password').where('id='+model.id).get('tbl_users',
      function(err,data){
        if(err==null){
          if(data!=null && data!=""){
            callback(data);
          }else{
            callback({error:"User Not exist"})
          }
        }else{
          callback(err);
        }  
    });
  }else{
    callback({error:"The userid is invalid"});
  }
}


exports.update=function(model,callback){
  model.id=parseInt(model.id);
  if(isInt(model.id)){
    db.select('id,nombre,apellido,email,password').where('id='+model.id).get('tbl_users',
      function(err,data){
        if(data.length>0){
          var isValid=validateModel(model);
          if(isValid.status){
            db.where({id:model.id});
            db.update('tbl_users', model , function(err){
              if(err==null){
                db.select('id,nombre,apellido,email,password').where('id='+model.id).get('tbl_users',
                  function(err,result){
                    var response={};
                    response.data=result;
                    response.data[0].update="ok";
                    response.data[0].error=err;
                    callback(response.data);
                });
              }else{
                callback({error:err});
              }    
            });
          }else{
            callback({error:isValid.error});
          } 
        }else{
          callback({error:"User not found"});
        }   
    });
  }else{
      callback({error:"The userid is invalid"});
  }
}

exports.delete=function(model,callback){
  model.id=parseInt(model.id);
  if(isInt(model.id)){
    db.select('id,nombre,apellido,email,password').where('id='+model.id).get('tbl_users',function(err,data){
      if(data!=null && data!=""){
        db.where({ id: model.id }).delete('tbl_users', function(err){
          if(err==null){
           callback({data:"Deleted"});  
          }else{
            callback({error:err});
          }
        });
      }else{
        callback({error:"User not found"});
      }   
    });
  }else{
    callback({error:"The userid is invalid"});
  }
}

function isInt(n) {
   return typeof n === 'number' && parseFloat(n) == parseInt(n, 10) && !isNaN(n);
}

function validateModel(data){
  var validData={status:1,error:""};
  var expreg={email:/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,other:"^$"};
  for(i in data){
    var key = i;
    if(key==='email'){
      if(!data[key].match(expreg.email)){
        validData.status=0;
        validData.error+=" Error: email is invalid.";
      }
    } 
    if(key!='email' && key != 'id'){
      if(data[key].match(expreg.other)){
        validData.status=0;
        validData.error+= " Error:"+ key +" is required. "
      }      
    }
  }
  return validData;
}