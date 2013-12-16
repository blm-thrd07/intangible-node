#!/bin/bash 
 echo "/................................................./"    
 echo "/      ****API TEST******                        /"
 echo "/            UpdateAll                           / "
 echo "/.............................................../ "

function Update(){
   echo "Actualizando Usuario"
   for((usr=1;usr<=100;usr++))
	  do
       curl  -X PUT  -H  'x-api-key: lnx1337'  -F nombre="UsuarioModificado$usr" -F email="emailModificado$usr@mail.com" http://sspdemo.cloudapp.net/users/edit/$usr
      done
}
Update