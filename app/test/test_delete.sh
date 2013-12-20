#!/bin/bash 
 echo "/................................................./"    
 echo "/      ****API TEST******                        /"
 echo "/            UsersDelete                         / "
 echo "/.............................................../ "

function Delete(){
    echo "Borrando Usuario"
    for((usr=1;usr<=100;usr++))
	  do
       curl -X DELETE   -H  'x-api-key: lnx1337'   http://localhost:3000/users/$usr
      done 
}
Delete