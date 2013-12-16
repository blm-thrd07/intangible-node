#!/bin/bash 
 echo "/................................................./"    
 echo "/      ****API TEST******                        /"
 echo "/            LOGIN                              / "
 echo "/.............................................../ "


function Login(){
	 echo 'Login'
	 for((usr=1;usr<=100;usr++))
	  do
       curl -X POST   -H  'x-api-key: lnx1337'   -F email="email$usr@mail.com" -F password="password$usr" http://sspdemo.cloudapp.net/users/login
      done  
}
Login