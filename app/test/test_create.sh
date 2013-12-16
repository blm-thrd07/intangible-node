#!/bin/bash 
 echo "/................................................./"    
 echo "/      ****API TEST******                        /"
 echo "/            Create                              / "
 echo "/.............................................../ "

function Create(){
	 echo 'Creando Usuario'
	 for((usr=1;usr<=1;usr++))
	  do
       curl -X POST   -H  'x-api-key: lnx1337'  -F nombre="Usuario$usr" -F apellido="Apellido$usr" -F email="email$usr@mail.com" -F password="password$usr" http://localhost:3000/users/add
      done  
}
Create