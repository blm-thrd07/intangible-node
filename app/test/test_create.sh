#!/bin/bash 
 echo "/................................................./"    
 echo "/      ****API TEST******                        /"
 echo "/            Create                              / "
 echo "/.............................................../ "

function Create(){
	 echo 'Creando Usuario'
	 for((usr=1;usr<=100;usr++))
	  do
       curl -X POST   -H  'x-api-key: lnx1337'  -F nombre="Usuario$usr" -F apellido="Apellido$usr" -F email="email$usr@mail.com" -F password="password$usr" http://sspdemo.cloudapp.net/users/add
      done  
}
Create