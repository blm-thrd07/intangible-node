var Db = require('mysql-activerecord');
var db = new Db.Adapter({
    server: 'localhost',
    username: 'root',
    password: '',
    database: 'intangibledb'
});


exports.truncate=function(callback){

db.query('truncate table tbl_users', function(err, results) {  
        if(!err){
        	 callback({response:"Database truncated!"});
        }
	});

}


exports.validateLogin=function(model,callback){
   db.select('id,email,password').where('email= "'+ model.email +'" and password="'+model.password+'"').get('tbl_users',function(err,data){     
                
              if(!err){
                 if(data.length>0){
                 	 callback(data);
                 }else{
                 	callback("");
                 }
             }else{
              	callback({error:err});
              }
            
   });
}


exports.findAll=function(callback){
	db.select('nombre,apellido,email,password').get('tbl_users',function(err,data){
         if(!err){
                 if(data.length>0){
                 	 callback(data);
                 }else{
                 	callback("");
                 }
          }else{
              	callback({error:err});
          }
	});
}


exports.save=function(model,callback){


    db.select('id,nombre,apellido,email,password').where('email="'+model.email+'" and password="'+model.password+'"').get('tbl_users',function(err,data){
      
      if(data.length>0){
            callback({response:"The username already exists"});
      
      }else{
	 	db.insert('tbl_users', { nombre: model.nombre , apellido: model.apellido ,email:model.email ,password:model.password }, function(err, data){                 
			            if(!err){
			                 if(data.insertId!=null){
			            	     console.log(data);
			                 	 callback(data);
			                 }else{
			                 	callback("");
			                 }
			          }else{
			              	callback({error:err});
			          }
			});

      }  

      
    
    });    
}


exports.findById=function(model,callback){
  db.select('id,nombre,apellido,email,password').where('id='+model.id).get('tbl_users',function(err,data){
          if(!err){
                 if(data.length>0){
                 	 callback(data);
                 }else{
                 	callback("");
                 }
          }else{
              	callback({error:err});
          }
           
  });
}

exports.update=function(model,callback){

 db.select('id,nombre,apellido,email,password').where('id='+model.id).get('tbl_users',function(err,data){
            if(data.length>0){
                   db.where({id:model.id});
                   db.update('tbl_users', model.body , function(err){
                   if (!err) {
                         db.select('id,nombre,apellido,email,password').where('id='+model.id).get('tbl_users',function(err,result){
                             if(result.length>0){
                             	 result[0].update="ok";
                             	 callback(result);
                             }
                         });

                     }
                  });
            }else{
            	callback("");
            }   
      });
}


exports.delete=function(model,callback){

 db.select('id,nombre,apellido,email,password').where('id='+model.id).get('tbl_users',function(err,data){
            if(data.length>0){
					    db.where({ id: model.id }).delete('tbl_users', function(err) {
					        if (!err) {
					            callback({response:"delete"});
					        }else{
					           callback("");
					        }
					    });
	         }else{
                 callback({response:""});
            }   
        });	


}