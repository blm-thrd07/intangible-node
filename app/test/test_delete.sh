#!/bin/bash 
 echo "/................................................./"    
 echo "/      ****API TEST******                        /"
 echo "/            UsersDelete                         / "
 echo "/.............................................../ "

function Delete(){
    echo "Borrando Usuario"
    for((usr=1;usr<=50000;usr++))
	  do
       curl -X DELETE   -H  'x-api-key: lnx1337'   http://sspdemo.cloudapp.net/users/$usr
      done 
}
Delete